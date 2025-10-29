const DataURIParser = require('datauri/parser');
const path = require('path');
const parser = new DataURIParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

module.exports = getDataUri;
