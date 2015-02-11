var AWS = require('aws-sdk'),
    Q = require('q'),
    config = require('./config').config;

AWS.config.update(config.amazon);

var s3 = new AWS.S3(); 

exports.listAllKeys = function (marker, deferred, allKeys) {
    if (!deferred) {
        var allKeys = [],
            deferred = Q.defer();
    }
    s3.listObjects({Bucket: config.buckets.sourceBucket, Marker: marker/*, MaxKeys: 3*/}, function(err, data){
      if (err) console.log(err);
      allKeys.push(data.Contents);

      if(data.IsTruncated)
        exports.listAllKeys(data.Contents.slice(-1)[0].Key, deferred, allKeys);
      else
        deferred.resolve(allKeys);
    });

    return deferred.promise;
}