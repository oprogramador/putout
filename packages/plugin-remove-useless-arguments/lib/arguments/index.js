'use strict';

const {findBinding} = require('putout').operator;

module.exports.report = (path) => `Argument "${path.node.name}" is useless`;

module.exports.fix = (path) => {
    path.remove();
};

module.exports.traverse = ({push}) => ({
    '__(__args)': (path) => {
        const {name} = path.node.callee;
        const binding = findBinding(path, name);
        
        if (!binding)
            return false;
        
        let bindingPath = binding.path;
        
        if (bindingPath.isVariableDeclarator())
            bindingPath = bindingPath.get('init');
        
        if (!checkParams(bindingPath))
            return false;
        
        const params = bindingPath.get('params');
        const args = path.get('arguments');
        
        if (params.length >= args.length)
            return false;
        
        const count = args.length - params.length;
        args.slice(-count).map(push);
    },
});

function checkParams(path) {
    if (!path.isFunction())
        return false;
    
    const params = path.get('params');
    
    if (!params.length)
        return true;
    
    const last = params.length - 1;
    
    if (params[last].isRestElement())
        return false;
    
    return true;
}
