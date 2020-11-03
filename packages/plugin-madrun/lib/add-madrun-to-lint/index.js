'use strict';

const {types} = require('putout');

const {
    isStringLiteral,
    isTemplateLiteral,
} = types;

const isUM = (a) => a.includes(' -um');
const isDot = (a) => a === 'putout .';

module.exports.report = () => '"lint" should check ".madrun.js"';

module.exports.fix = ({node}) => {
    if (isStringLiteral(node)) {
        const result = addMadrun(node.value);
        
        node.value = result;
        node.raw = result;
        return;
    }
    
    const result = addMadrun(node.value.raw);
    
    node.value.raw = result;
    node.value.cooked = result;
};

function getValue(body) {
    if (isStringLiteral(body))
        return [body, body.value];
    
    if (body.expressions.length)
        return [body, ''];
    
    const [line] = body.quasis;
    
    return [line, line.value.raw];
}

module.exports.traverse = ({push}) => {
    return {
        'module.exports = __object'(path) {
            const rightPath = path.get('right');
            const lint = findKey('lint', rightPath);
            
            if (!lint)
                return;
            
            const value = lint.parentPath.get('value');
            
            const {body} = value.node;
            const [node, str] = getValue(body);
            
            if (!str)
                return;
            
            if (!isDot(str) && !isUM(str) && !/\.madrun/.test(str) && !str.includes('.*.js'))
                return push({
                    path: rightPath,
                    lint,
                    node,
                });
        },
    };
};

function findKey(name, path) {
    const properties = path.get('properties');
    
    for (const property of properties) {
        const key = property.get('key');
        const is = isKey(name, key);
        
        if (is)
            return key;
    }
    
    return null;
}

function isKey(name, key) {
    const isId = key.isIdentifier({name});
    const isStr = key.isStringLiteral({
        value: name,
    });
    
    return isStr || isId;
}

function addMadrun(a) {
    if (!a.includes('.madrun') && a.includes('madrun'))
        return a.replace('madrun', '.madrun');
    
    if (a.includes('test'))
        return a.replace('test', 'test madrun.js');
    
    return `${a} madrun.js`;
}

