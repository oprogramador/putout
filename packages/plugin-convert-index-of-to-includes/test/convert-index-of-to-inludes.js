'use strict';

const test = require('@putout/test')(__dirname, {
    'convert-index-of-to-includes': require('..'),
});

test('plugin-convert-index-of-to-includes: report', (t) => {
    t.report('index-of', '"includes" should be used instead of "indexOf"');
    t.end();
});

test('plugin-convert-index-of-to-includes: transform', (t) => {
    t.transform('index-of');
    t.end();
});

test('plugin-convert-index-of-to-includes: transform: equal', (t) => {
    t.transform('equal');
    t.end();
});

test('plugin-convert-index-of-to-includes: transform: not equal', (t) => {
    t.transform('not-equal');
    t.end();
});

