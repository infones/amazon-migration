var s3helper = require('./s3helper'),
    _ = require('lodash'),
    fs = require('fs');

// s3.listBuckets(function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


s3helper.listAllKeys('').then(function(keyArr) {
    var flattenedObjects = _.flatten(_.union(keyArr));

    console.log("All objects: " + flattenedObjects.length);

    //clear object of folders
    var folderFreeObjects = _.reject(flattenedObjects, function(obj) {
        return _.endsWith(obj.Key, '/');
    });

    console.log("Excluding folders: " + folderFreeObjects.length);

    var dupeFreeObjects = _.uniq(folderFreeObjects, false, function(obj) {
        var arr /* yarr */ = obj.Key.split('/');

        return _.last(arr);
    });

    console.log("Excluding folders and duplicates: " +  dupeFreeObjects.length);

    //list duplicate file names
    
    //first we group objects by key
    var groupped = _.groupBy(folderFreeObjects, function(obj) {
        var arr /* yarr */ = obj.Key.split('/');

        return _.last(arr);
    });

    //we transform this group to see which key has duplicates
    var mappedValues = _.mapValues(groupped, function(obj) {
        return (obj.length > 1);
    });

    //we transform this to the keys where it's true
    var dupes = [];
    Object.keys(mappedValues).forEach(function(key, i) {
        if (mappedValues[key]) {
            dupes.push(key);
        }
    });

    //we write duplicates to a file
    fs.writeFile("./output/dupes.txt", dupes, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });     
});

// var params = {
//   Bucket: config.buckets.targetBucket, /* required */
//   CopySource: config.buckets.sourceBucket + '/abcd/hell_1.png', /* required */
//   Key: 'hell_1.png', /* required */
//   // ACL: 'private | public-read | public-read-write | authenticated-read | bucket-owner-read | bucket-owner-full-control',
//   // CacheControl: 'STRING_VALUE',
//   // ContentDisposition: 'STRING_VALUE',
//   // ContentEncoding: 'STRING_VALUE',
//   // ContentLanguage: 'STRING_VALUE',
//   // ContentType: 'STRING_VALUE',
//   // CopySourceIfMatch: 'STRING_VALUE',
//   // CopySourceIfModifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
//   // CopySourceIfNoneMatch: 'STRING_VALUE',
//   // CopySourceIfUnmodifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
//   // CopySourceSSECustomerAlgorithm: 'STRING_VALUE',
//   // CopySourceSSECustomerKey: 'STRING_VALUE',
//   // CopySourceSSECustomerKeyMD5: 'STRING_VALUE',
//   // Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
//   // GrantFullControl: 'STRING_VALUE',
//   // GrantRead: 'STRING_VALUE',
//   // GrantReadACP: 'STRING_VALUE',
//   // GrantWriteACP: 'STRING_VALUE',
//   // Metadata: {
//   //   someKey: 'STRING_VALUE',
//   //   /* anotherKey: ... */
//   // },
//   // MetadataDirective: 'COPY | REPLACE',
//   // SSECustomerAlgorithm: 'STRING_VALUE',
//   // SSECustomerKey: 'STRING_VALUE',
//   // SSECustomerKeyMD5: 'STRING_VALUE',
//   // SSEKMSKeyId: 'STRING_VALUE',
//   // ServerSideEncryption: 'AES256',
//   // StorageClass: 'STANDARD | REDUCED_REDUNDANCY',
//   // WebsiteRedirectLocation: 'STRING_VALUE'
// };
// s3.copyObject(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });