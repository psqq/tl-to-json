#!/usr/bin/env node
import { promises as fs } from 'fs';
import { EntitiesJson } from '../src/EntitiesJson.js';
import { TdApiJson } from '../src/TdApiJson.js';
import { DefaultJson } from '../src/DefaultJson.js';

const [nodePath, thisFile, tlFile, jsonFile, convertType, indent] = process.argv;

if (!tlFile) {
    console.log('No input tl file');
    process.exit(1);
}

if (!jsonFile) {
    console.log('No output json file');
    process.exit(1);
}

if (!convertType) {
    console.log('No type of converter');
    process.exit(1);
}

const tlFileContent = (await fs.readFile(tlFile)).toString('utf-8');

let json = null;

if (convertType === 'entities') {
    const converter = new EntitiesJson(tlFileContent);
    json = converter.makeJson();
} else if (convertType === 'tdapi') {
    const converter = new TdApiJson(tlFileContent);
    json = converter.makeJson();
} else if (convertType === 'default') {
    const converter = new DefaultJson(tlFileContent);
    json = converter.makeJson();
} else {
    console.error('Unknown type of converter', convertType);
    process.exit(1);
}

if (!json) {
    console.error('No json after convert by', convertType);
    process.exit(1);
}

const space = indent ? parseInt(indent) : 0;
const jsonStr = JSON.stringify(json, null, space);

await fs.writeFile(jsonFile, jsonStr);

console.log(`Success convert from TL to JSON by ${convertType}`);
