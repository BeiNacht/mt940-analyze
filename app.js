var _ = require('lodash');
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var Converter = require("csvtojson").Converter;
const low = require('lowdb');
const db = low('db.json');

db.defaults({ transactions: [] })
    .value();

var converter = new Converter({
    delimiter: ";",
    headers: [
        "account",
        "bookdate",
        "valuedate",
        "bookingtext",
        "usage",
        "beneficiary",
        "accountnumber",
        "bankcode",
        "amount",
        "currency",
        "info"
    ]
});

converter.on("end_parsed", function (jsonArray) {
    console.log('entries: ' + db.get('transactions').size().value())
    _.forEach(jsonArray, function (value) {
        var foundValue = db.get('transactions')
            .find(value)
            .value();
        if (!foundValue) {
            db.get('transactions')
                .push(value)
                .value();
            console.log('added');
        } else {
            console.log('found');
        }
    });
    console.log('entries: ' + db.get('transactions').size().value())
});

var importCSV = function () {
    fs.createReadStream('./' + argv.f.trim())
        .pipe(converter);
};

var countData = function () {
    console.log(db.get('transactions').size().value());
};

if (argv && argv._ && argv._[0]) {
    if (argv._[0] === 'import') {
        importCSV();
    } else if (argv._[0] === 'count') {
        countData();
    } else {
        console.log('there is no function');
    }
}