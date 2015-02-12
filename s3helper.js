var AWS = require('aws-sdk'),
    Q = require('q'),
    _ = require('lodash'),
    config = require('./config').config;

AWS.config.update(config.amazon_west);
var s3_west = new AWS.S3(); 

AWS.config.update(config.amazon_central);
var s3_central = new AWS.S3(); 

exports.listAllKeys = function (marker, deferred, allKeys) {
    if (!deferred) {
        var allKeys = [],
            deferred = Q.defer();
    }
    s3_central.listObjects({Bucket: config.buckets.sourceBucket, Marker: marker/*, MaxKeys: 3*/}, function(err, data){
      if (err) console.log(err);
      allKeys.push(data.Contents);

      if(data.IsTruncated)
        exports.listAllKeys(data.Contents.slice(-1)[0].Key, deferred, allKeys);
      else
        deferred.resolve(allKeys);
    });

    return deferred.promise;
}

exports.copyObjects = function(objects) {
    var deferred = Q.defer(),
        params = {
            Bucket: config.buckets.targetBucket
        },
        keys = Object.keys(objects),
        len = keys.length,
        filesProcessed = 0,
        filesSuccessfullyProcessed = 0;

    keys.forEach(function(key, i) {
        var obj = objects[key];

        params.CopySource = config.buckets.sourceBucket + '/' + obj.Key,
        params.Key = _.last(obj.Key.split('/'));

        s3_west.copyObject(params, function(err, data) {
            filesProcessed++;
            if (err) {
                console.log(err, err.stack);
            } else {
                filesSuccessfullyProcessed++;
            }
            if (filesProcessed == len) {
                if (filesProcessed == filesSuccessfullyProcessed) {
                    deferred.resolve('success');
                } else {
                    deferred.reject('fail');
                }
            }
        });
    });

    return deferred.promise;
}