var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const xlsx = require('node-xlsx');
    //const obj = xlsx.parse('./data/nehody-brno-2018.xlsx');
    const obj = xlsx.parse('./data/kolo_2011_2018.xlsx');
    const data = obj[0].data;
    var result = [];

    for (var i = 1; i < data.length; i++) {
        const item = data[i];
        const alc = item[9] === 'ne' || item[9] === 'nezjišťováno';

        result.push({
            latitude: item[26],
            longitude: item[27],
            alcoholOrDrugs: !alc,
        });
    }
    
    res.send(result);
});

module.exports = router;
