# @putout/plugin-declare-undefined-variables [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL]

[NPMIMGURL]: https://img.shields.io/npm/v/@putout/plugin-declare-undefined-variables.svg?style=flat&longCache=true
[NPMURL]: https://npmjs.org/package/@putout/plugin-declare-undefined-variables"npm"
[DependencyStatusURL]: https://david-dm.org/coderaiser/putout?path=packages/plugin-declare-undefined-variables
[DependencyStatusIMGURL]: https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-declare-undefined-variables

`putout` plugin adds ability to transform to new [Cloud Commander](https://declare-undefined-variables.io) API.

## Install

```
npm i putout @putout/plugin-declare-undefined-variables -D
```

Add `.putout.json` with:

```json
{
    "plugins": {
        "declare-undefined-variables": "on"
    }
}
```

## Rules

```json
{
    "rules": {
        "declare-undefined-variables": ["on", {
            "dismiss": [
                "assert"
            ]
        }]
    }
}
```

# declare-undefined-variables/assign

## ❌ Incorrect code example

```js
const hello = 'world';
const object = {
};

assign(object, {
    hello,
});
```

## ✅ Correct code Example

```js
const hello = 'world';
const object = {
};
const {assign} = Object;

assign(object, {
    hello,
});
```

# declare-undefined-variables/stringify

## ❌ Incorrect code example

```js
const hello = 'world';
const object = {
};

assign(object, {
    hello,
});
```

## ✅ Correct code Example

```js
const hello = 'world';
const object = {
};
const {assign} = Object;

assign(object, {
    hello,
});
```

## License

MIT