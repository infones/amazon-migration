var AWS = require('aws-sdk'),
    config = require('./config').config;

AWS.config.update(config.amazon);

var s3 = new AWS.S3(); 

// s3.listBuckets(function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


var allKeys = [];
function listAllKeys(marker, cb)
{
  s3.listObjects({Bucket: config.buckets.sourceBucket, Marker: marker}, function(err, data){
    console.log(err);
    allKeys.push(data.Contents);

    if(data.IsTruncated)
      listAllKeys(data.Contents.slice(-1)[0].Key, cb);
    else
      cb();
  });
}

listAllKeys('', function() {
    console.log(allKeys);
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