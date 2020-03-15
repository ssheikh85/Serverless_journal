const fs = require('fs');
const path = require('path');

module.exports.createEntry = fs.readFileSync(path.join(__dirname, 'createEntry.gql'), 'utf8');
module.exports.updateEntry = fs.readFileSync(path.join(__dirname, 'updateEntry.gql'), 'utf8');
module.exports.deleteEntry = fs.readFileSync(path.join(__dirname, 'deleteEntry.gql'), 'utf8');
