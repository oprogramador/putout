# @putout/keypress [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL]

[NPMIMGURL]: https://img.shields.io/npm/v/@putout/keypress.svg?style=flat&longCache=true
[NPMURL]: https://npmjs.org/package/@putout/keypress"npm"
[DependencyStatusURL]: https://david-dm.org/coderaiser/putout?path=packages/keypress
[DependencyStatusIMGURL]: https://david-dm.org/coderaiser/putout.svg?path=packages/keypress

`putout` keypress handler;

## Install

```
npm i @putout/keypress
```

## Examples

```js
const keyPress = require('keypress');
const {isStop} = keyPress();

// do some stuf antil ctrl+c pressed
async function again() {
    if (isStop())
        return;
    
    await again();
}
```

## License

MIT