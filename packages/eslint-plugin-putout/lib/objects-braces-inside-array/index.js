'use strict';

const {isObjectExpression} = require('putout').types;

module.exports.category = 'destructuring';
module.exports.report = () => 'Keep braces on the same line with brackets';

module.exports.include = () => {
    return [
        'ArrayExpression',
    ];
};

const badEndReg = /},?\n(\s+)?]/;

module.exports.filter = ({node, text}) => {
    const {elements} = node;
    
    for (const element of elements) {
        if (!isObjectExpression(element))
            return false;
    }
    
    const isStart = /^\[\n(\s+)?{/.test(text);
    const isEnd = badEndReg.test(text);
    
    return isStart || isEnd;
};

module.exports.fix = ({text}) => {
    return text
        .replace('[\n', '[')
        .replace(/\[\s+{/, '[{')
        .replace('\n]', ']')
        .replace(/},\n(\s+)?{/, '}, {')
        .replace(badEndReg, '}]');
};
