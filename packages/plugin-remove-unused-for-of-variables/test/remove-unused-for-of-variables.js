'use strict';

const test = require('@putout/test')(__dirname, {
    'remove-unused-for-of-variables': require('..'),
});

test('remove unused for-of-variables: report: object', (t) => {
    t.report('object', '"b" inside for-of defined but never used');
    t.end();
});

test('remove unused for-of-variables: report: array', (t) => {
    t.report('array', '"b" inside for-of defined but never used');
    t.end();
});

test('remove unused for-of-variables: transform: object', (t) => {
    t.transform('object');
    t.end();
});

test('remove unused for-of-variables: transform: array', (t) => {
    t.transform('array');
    t.end();
});

test('remove unused for-of-variables: no transform: identifier', (t) => {
    t.noTransform('identifier');
    t.end();
});

test('remove unused for-of-variables: no transform: object: one', (t) => {
    t.noTransform('object-one');
    t.end();
});

test('remove unused for-of-variables: no transform: array: one', (t) => {
    t.noTransform('array-one');
    t.end();
});

test('remove unused for-of-variables: no transform: referenced', (t) => {
    t.noTransform('referenced');
    t.end();
});

test('remove unused for-of-variables: no transform: not all identifiers', (t) => {
    t.noTransform('not-all-identifiers');
    t.end();
});

test('remove unused for-of-variables: transform: array-sparse', (t) => {
    t.transform('array-sparse');
    t.end();
});

