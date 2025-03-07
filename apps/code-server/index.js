const fs = require('fs');
const { parseBoltArtifactXMLNode } = require('./xmlParser.js');

const xmlString = fs.readFileSync('input.xml', 'utf8');
const jsonResult = parseBoltArtifactXMLNode(xmlString);
console.log(JSON.stringify(jsonResult, null, 2));