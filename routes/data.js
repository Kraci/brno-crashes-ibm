var Cloudant = require('@cloudant/cloudant');
var express = require('express');
var router = express.Router();

var DB_NAME = 'crashes';

router.get('/', async function(req, res, next) {
    var cloudant = new Cloudant({ url: 'https://2a3aa61b-f613-4803-adc7-251f160febf7-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'mJqWGbjL5fLrHgC9mfMc04X16ESP6dmdtzp6HJoLzHpb'}}});
    var crashes = cloudant.db.use(DB_NAME);
    var result = [];

    console.log('Read data...')

    await crashes.list({include_docs: true}).then((body) => {
        body.rows.forEach((row) => {
            let doc = row.doc;
            result.push(doc);
        });
    });

    res.send(result);
});

module.exports = router;