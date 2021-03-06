'use strict';

const {red} = require('chalk');
const yargsParser = require('yargs-parser');

const merge = require('../merge');
const processFile = require('./process-file');
const getFiles = require('./get-files');
const cacheFiles = require('./cache-files');
const supportedFiles = require('./supported-files');
const {
    PLACE,
    STAGE,
} = require('./exit-codes');

const {PUTOUT_FILES = ''} = process.env;
const envNames = !PUTOUT_FILES ? [] : PUTOUT_FILES.split(',');

const {isArray} = Array;
const maybeArray = (a) => isArray(a) ? a.pop() : a;

module.exports = async ({argv, halt, log, write, logError}) => {
    const args = yargsParser(argv, {
        coerce: {
            format: maybeArray,
        },
        boolean: [
            'cache',
            'debug',
            'version',
            'help',
            'fix',
            'fresh',
            'raw',
            'enable-all',
            'disable-all',
            'jsx',
            'flow',
            'options',
            'staged',
        ],
        number: [
            'fixCount',
        ],
        string: [
            'ext',
            'config',
            'format',
            'disable',
            'enable',
            'rulesdir',
            'transform',
        ],
        alias: {
            v: 'version',
            h: 'help',
            c: 'config',
            f: 'format',
            s: 'staged',
            t: 'transform',
            d: 'debug',
        },
        default: {
            fix: false,
            fixCount: 10,
            options: true,
            cache: false,
            fresh: false,
            enable: '',
            disable: '',
            debug: false,
        },
    });
    
    supportedFiles.add(args.ext);
    
    const {
        debug,
        fix,
        fixCount,
        raw,
        rulesdir,
        format,
        flow: isFlow,
        jsx: isJSX,
        disable,
        disableAll,
        enable,
        enableAll,
        staged,
        fresh,
        cache,
        transform,
    } = args;
    
    const exit = getExit({
        raw,
        halt,
        logError,
    });
    
    if (args.version) {
        log(`v${require('../../package.json').version}`);
        return exit();
    }
    
    if (args.help) {
        const help = require('./help');
        log(help());
        return exit();
    }
    
    if (enable || disable) {
        const rulerProcessor = require('./ruler-processor');
        rulerProcessor({enable, disable}, []);
    }
    
    const stagedNames = [];
    
    if (staged) {
        const {get} = require('./staged');
        const names = await get();
        
        stagedNames.push(...names);
    }
    
    const globFiles = [
        ...stagedNames,
        ...args._.map(String),
        ...envNames,
    ];
    
    const [e, files] = await getFiles(globFiles);
    
    if (e)
        return exit(e);
    
    if (!files.length)
        return exit();
    
    const fileCache = cacheFiles({
        files,
        cache,
        fresh,
    });
    
    const options = {
        debug,
        fix,
        fileCache,
        rulesdir,
        format,
        isFlow,
        isJSX,
        fixCount,
        raw,
        ruler: {
            disable,
            disableAll,
            enable,
            enableAll,
        },
        
        exit,
        log,
        logError,
        write,
        transform,
        noOptions: !args.options,
    };
    
    const rawPlaces = [];
    
    const process = processFile(options);
    const {length} = files;
    
    for (let i = 0; i < length; i++) {
        const file = files[i];
        const place = await process(file, i, {length});
        rawPlaces.push(place);
    }
    
    const places = rawPlaces.filter(Boolean);
    const mergedPlaces = merge(...places);
    
    fileCache.reconcile();
    
    if (enableAll || disableAll) {
        const rulerProcessor = require('./ruler-processor');
        rulerProcessor({enableAll, disableAll}, mergedPlaces);
        return exit();
    }
    
    if (fix && staged) {
        const {set} = require('./staged');
        const stagedNames = await set();
        
        if (!stagedNames.length)
            exit(STAGE);
    }
    
    if (mergedPlaces.length)
        return exit(PLACE);
};

const getExit = ({halt, raw, logError}) => (e) => {
    if (!e)
        return halt(0);
    
    if (typeof e === 'number')
        return halt(e);
    
    const message = raw ? e : red(e.message);
    
    logError(message);
    halt(1);
};

