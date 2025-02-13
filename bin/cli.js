#!/usr/bin/env node
import { promises as fs } from 'fs';
import { EntitiesJson } from '../src/EntitiesJson.js';
import { TdApiJson } from '../src/TdApiJson.js';
import { DefaultJson } from '../src/DefaultJson.js';

let args = process.argv.slice(2);
const [tlFile, jsonFile, convertType, ...restArgs] = args;
let indent = '';
let int32Ids = false;
/** @type {string[]} */
let skipPredicates = [];

/**
 * @type {{name: string; argsCount: number; onValue: (...args: string[]) => void;}[]}
 */
const options = [
    {
        name: '--indent',
        argsCount: 1,
        onValue(val) {
            indent = val;
        }
    },
    {
        name: '--int32-ids',
        argsCount: 1,
        onValue(val) {
            int32Ids = val === 'true';
        }
    },
    {
        name: '--skip-predicates',
        argsCount: 1,
        onValue(val) {
            skipPredicates = val.split(',');
        }
    },
];

let i = 0;
while_loop: while (i < restArgs.length) {
    for (const option of options) {
        if (option.name === restArgs[i] && i + option.argsCount < restArgs.length) {
            option.onValue(...restArgs.slice(i + 1, i + 1 + option.argsCount));
            i += 1 + option.argsCount;
            continue while_loop;
        }
    }
    i++;
}

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

/** @type {EntitiesJson | TdApiJson | DefaultJson} */
let converter;

if (convertType === 'entities') {
     converter = new EntitiesJson(tlFileContent);
} else if (convertType === 'tdapi') {
     converter = new TdApiJson(tlFileContent);
} else if (convertType === 'default') {
     converter = new DefaultJson(tlFileContent);
} else {
    console.error('Unknown type of converter', convertType);
    process.exit(1);
}

converter.parser.int32Ids = int32Ids;
converter.parser.skipPredicates = skipPredicates;

const json = converter.makeJson();

if (!json) {
    console.error('No json after convert by', convertType);
    process.exit(1);
}

const space = indent ? parseInt(indent) : 0;
const jsonStr = JSON.stringify(json, null, space);

await fs.writeFile(jsonFile, jsonStr);

console.log(`Success convert from TL to JSON by ${convertType}`);
