//@ts-check
import assert from 'node:assert';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { TdApiJson } from './TdApiJson.js';

test('Multiline comments', async () => {
    const tlStr = String(
        await fs.promises.readFile(path.join(import.meta.dirname, '../tests/data/1.tl')),
    );
    const result = new TdApiJson(tlStr).makeJson();
    assert.deepStrictEqual(result, {
        classes: [],
        constructors: [
            {
                id: NaN,
                predicate: 'formattedText',
                params: [
                    {
                        name: 'text',
                        type: 'string',
                        description: 'The text',
                    },
                    {
                        name: 'entities',
                        type: 'vector<textEntity>',
                        description:
                            "Entities contained in the text. Entities can be nested, but must not mutually intersect with each other. Pre, Code and PreCode entities can't contain other entities. BlockQuote entities can't contain other BlockQuote entities. Bold, Italic, Underline, Strikethrough, and Spoiler entities can contain and can be part of any other entities. All other entities can't contain each other",
                    },
                ],
                type: 'FormattedText',
                description: 'A text with some entities',
            },
        ],
        methods: [],
    });
});
