import fs from 'fs';
import { parseXML } from './xmlParser.ts';

const xmlString = fs.readFileSync('input.xml', 'utf8');
const jsonResult = parseXML(xmlString);
console.log(JSON.stringify(jsonResult, null, 2));