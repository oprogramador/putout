# @putout/engine-processor [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL]

[NPMIMGURL]:                https://img.shields.io/npm/v/@putout/engine-loader.svg?style=flat&longCache=true
[NPMURL]:                   https://npmjs.org/package/@putout/engine-loader"npm"

[DependencyStatusURL]:      https://david-dm.org/coderaiser/putout?path=packages/engine-loader
[DependencyStatusIMGURL]:   https://david-dm.org/coderaiser/putout.svg?path=packages/engine-loader

Run putout `pre-` and `post-` processors.

```
npm i @putout/engine-processor
```

## Code Example

```js
const {runProcessors} = require('@putout/engine-processor');

runProcessors({
    name,
    process,
    options,
    rawSource,
    index,
    length,
});
// returns
({
    isProcessed,
    places,
    processedSource,
})
```

## Processor Example

Simplest possible procesor exampmle can look like this:

```js
module.exports.extensions = [
    'js'
];

// preProcess should always return array of sources that was get from source
module.exports.preProcess = (source) => {
    return [{
        source,
        startLine: 0,
    }];
};

// postProcess should join all processed source list into main source
module.exports.postProcess = (source, list) => {
    return list[0];
};
```

## License

MIT
