'use strict';

const test = require('@putout/test')(__dirname, {
    'remove-useless-spread': require('..'),
});

test('plugin-remove-useless-spread: report', (t) => {
    t.report('for-of', 'Useless spread should be avoided');
    t.end();
});

test('plugin-remove-useless-spread: transform: array', (t) => {
    t.transform('for-of');
    t.end();
});

test('plugin-remove-useless-spread: transform: object', (t) => {
    t.transform('object');
    t.end();
});

