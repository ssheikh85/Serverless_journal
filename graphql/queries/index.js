const fs = require('fs');
const path = require('path');

module.exports.getEntries = fs.readFileSync(path.join(__dirname, 'getEntries.gql'), 'utf8');
