var Cloudant = require('@cloudant/cloudant');
var express = require('express');
var router = express.Router();

var DB_NAME = 'crashes';

router.get('/', async function(req, res, next) {
    const xlsx = require('node-xlsx');
    const obj = xlsx.parse('./data/nehody-brno.xlsx');
    const data = obj[0].data;
    var result = [];

    for (var i = 1; i < data.length; i++) {
        const item = data[i];
        result.push({
            _id: item[0].toString(),
            day: item[3],
            dayNight: item[5],
            type: item[7],
            causedBy: item[9],
            alcohol: item[11],
            mainCause: item[13],
            diedCount: item[14],
            roadCondition: item[21],
            weather: item[23],
            latitude: item[33],
            longitude: item[34],
        });
    }

    var cloudant = new Cloudant({ url: 'https://2a3aa61b-f613-4803-adc7-251f160febf7-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'mJqWGbjL5fLrHgC9mfMc04X16ESP6dmdtzp6HJoLzHpb'}}});

    var crashes = cloudant.db.use(DB_NAME);

    await crashes.bulk({docs: result});

    res.send('Data created.');
});

async function createDB() {
    try {
        await cloudant.db.create(DB_NAME);
    } catch(e) {
        console.error('Something went wrong with creating db!');
        console.error(e);
    }
}

async function deleteDB() {
    try {
        console.log('destroy db');
        await cloudant.db.destroy(DB_NAME);
    } catch(e) {
        console.error('Something went wrong with destroying db!');
        console.error(e);
    }
}

module.exports = router;
