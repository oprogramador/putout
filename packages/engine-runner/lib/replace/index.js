'use strict';

const {template} = require('@putout/engine-parser');
const {
    remove,
    replaceWith,
} = require('@putout/operate');
const {
    compare,
    findVarsWays,
    getValues,
    setValues,
} = require('@putout/compare');

const maybeArray = require('../maybe-array');
const watermark = require('./watermark');

const {keys, entries} = Object;

const stub = () => [];
const stubMatch = () => ({});
const packKeys = (a) => () => keys(a);
const isObj = (a) => typeof a === 'object';

module.exports = ({rule, plugin, msg, options}) => {
    const {
        report,
        exclude = stub,
        replace,
        filter = getFilter(plugin.match),
    } = plugin;
    
    const replaceItems = replace();
    const fix = getFix(replaceItems);
    const include = packKeys(replaceItems);
    
    return {
        rule,
        msg,
        options: {
            ...options,
            exclude: [
                ...exclude(),
                ...maybeArray(options.exclude),
            ],
        },
        plugin: {
            report,
            fix,
            filter,
            include,
        },
    };
};

const isFn = (a) => typeof a === 'function';

const fix = (from, to, path) => {
    const nodeFrom = template.ast(from);
    const mark = watermark(from, to, path);
    
    mark.init();
    
    if (mark.has())
        return;
    
    if (!compare(path, nodeFrom))
        return;
    
    const waysFrom = findVarsWays(nodeFrom);
    const {node} = path;
    
    const values = getValues({
        waysFrom,
        node,
    });
    
    const nodeTo = parseTo(to, values, path);
    
    if (!nodeTo)
        return remove(path);
    
    const waysTo = findVarsWays(nodeTo);
    const newPath = replaceWith(path, nodeTo);
    
    setValues({
        waysTo,
        values,
        path: newPath,
    });
    
    mark.add();
};

const getFix = (items) => (path) => {
    for (const [from, to] of entries(items))
        fix(from, to, path);
};

const getFilter = (match = stubMatch) => (path) => {
    for (const [from, fn] of entries(match())) {
        const nodeFrom = template.ast(from);
        
        if (!compare(path, nodeFrom)) {
            continue;
        }
        
        const waysFrom = findVarsWays(nodeFrom);
        const {node} = path;
        
        const values = getValues({
            waysFrom,
            node,
        });
        
        return fn(values, path);
    }
    
    return true;
};

function parseTo(to, values, path) {
    const toStr = isFn(to) ? to(values, path) : to;
    
    if (!toStr)
        return null;
    
    if (isObj(toStr))
        return toStr;
    
    return template.ast.fresh(toStr);
}

