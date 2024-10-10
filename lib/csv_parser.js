const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname + '/../data/sales_cloud.csv');
const jsonFile = path.join(__dirname + '/../data/sales_cloud.json');

// Initialize the parser
const parser = parse({
    delimiter: ',',
    columns: true
});
// Use the readable stream api to consume records
let p = 1;
const records = [];

parser.on('readable', function () {
    let record;
    while ((record = parser.read()) !== null) {
        const data = {
            text: record.Variation,
            priority: p
        }
        records.push(data);
        p++;
    }
    fs.writeFile(jsonFile, JSON.stringify({data:records}, null, 2), function (err) {
        if (err) return console.log(err);
    });
});
// Catch any error
parser.on('error', function (err) {
    console.error(err.message);
});

fs.createReadStream(file).pipe(parser);
