var _ = require('lodash');
var fs = require("fs");
var parseArgs = require('minimist')
var Converter = require("csvtojson").Converter;
const low = require('lowdb');
const db = low('db.json');

db.defaults({ transactions: [] })
    .value();

var converter = new Converter({
    delimiter: ";"
});

converter.on("end_parsed", function (jsonArray) {
    _.forEach(jsonArray, function (value) {
        var foundValue = db.get('transactions')
            .find(value)
            .value();
        if (!foundValue) {
            db.get('transactions')
                .push(value)
                .value();
            debugger;
        }
    });
});

fs.createReadStream("./1202635332-2015.csv")
    .pipe(converter);