var s3helper = require('./s3helper'),
    _ = require('lodash'),
    fs = require('fs');


console.time("migration");

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

    var dupeInfo = _.filter(groupped, function(obj) {
        return obj.length > 1;
    });

    //we write dupe info to a file
    fs.writeFile("./output/groups.txt", JSON.stringify(dupeInfo), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file with groups including info about duplicates was saved! Check output/groups.txt");
        }
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
            console.log("The file with list of duplicates was saved! Check output/dupes.txt");
        }
    });

    //let's copy.
    s3helper.copyObjects(dupeFreeObjects).then(function(msg) {
        console.log(msg);
        console.timeEnd("migration");
    }, function(msg) {
        console.log(msg);
    });
});