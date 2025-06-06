//@ts-check
import assert from 'node:assert';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { EntitiesJson } from './EntitiesJson.js';

test('Parse 1.tl', async () => {
    const tlStr = String(
        await fs.promises.readFile(path.join(import.meta.dirname, '../tests/data/1.tl')),
    );
    const entities = new EntitiesJson(tlStr).makeJson().entities;
    assert.deepStrictEqual(entities, [
        {
            entity_type: 'space',
            eolCount: 1,
        },
        {
            entity_type: 'comment',
            value: '@description A text with some entities @text The text @entities Entities contained in the text. Entities can be nested, but must not mutually intersect with each other.',
        },
        {
            entity_type: 'comment',
            value: "-Pre, Code and PreCode entities can't contain other entities. BlockQuote entities can't contain other BlockQuote entities. Bold, Italic, Underline, Strikethrough, and Spoiler entities can contain and can be part of any other entities. All other entities can't contain each other",
        },
        {
            entity_type: 'constructor',
            id: NaN,
            predicate: 'formattedText',
            params: [
                {
                    name: 'text',
                    type: 'string',
                },
                {
                    name: 'entities',
                    type: 'vector<textEntity>',
                },
            ],
            type: 'FormattedText',
        },
    ]);
});
