Amazon S3 Migration script
==========================


eDocu internal purposes

To perform a migration of Amazon S3 bucket as needed for our internal purposes:

* clone this repository
* copy `config.js.dist` as `config.js` and fill with credentials
* run `node index.js`
* ???
* PROFIT

Sample output looks like this:

```
All objects: 15
Excluding folders: 12
Excluding folders and duplicates: 9
The file with groups including info about duplicates was saved! Check output/groups.txt
The file with list of duplicates was saved! Check output/dupes.txt
success
migration: 1160ms
```