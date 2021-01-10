# Putout [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]:                https://img.shields.io/npm/v/putout.svg?style=flat&longCache=true
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/putout/master.svg?style=flat&longCache=true
[DependencyStatusIMGURL]:   https://david-dm.org/coderaiser/putout.svg?path=packages/putout
[NPMURL]:                   https://npmjs.org/package/putout "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/putout  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/putout?path=packages/putout "Dependency Status"

[CoverageURL]:              https://coveralls.io/github/coderaiser/putout?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/putout/badge.svg?branch=master&service=github

Putout is a pluggable and configurable code transformer with built-in `eslint`, `babel plugins` and `jscodeshift codemods` support for `js`, `jsx` `typescript` and `flow` files. It has [a lot of transforms](#built-in-transforms) that will keep your codebase in a clean state transforming any `code smell` to readable code according to best practices.

[![putout](https://asciinema.org/a/236695.svg)](https://asciinema.org/a/236695)

## Why?

- because [eslint](https://eslint.org) avoids [fixes that could change the runtime behavior](https://eslint.org/docs/developer-guide/working-with-rules#applying-fixes).
- because [babel](https://babeljs.io) produces [throw-away code](https://github.com/babel/babel/issues/5139);
- because [prettier](https://github.com/prettier/prettier) it is a formatter;
- because [jscodeshift](https://github.com/facebook/jscodeshift) has no `config` and `plugins` support.

The main difference of `putout` is saving code transformation results directly in a source code in a day-to-day baisis.

## Install

```
npm i putout -D
```

## Usage

```
Usage: putout [options] [path]
Options
   -h, --help                  display this help and exit
   -v, --version               output version information and exit
   -f, --format                use a specific output format - default: dump
   -s, --staged                add staged files when in git repository
   --fix                       apply fixes of errors to code
   --fix-count                 count of fixes rounds (defaults to 10)
   --rulesdir                  use additional rules from directory
   --transform                 apply inline transform
   --enable                    enable rule by name in .putout.json
   --disable                   disable rule by name in .putout.json
   --enable-all                enable all rules in .putout.json
   --disable-all               disable all rules in .putout.json
   --ext                       specify JavaScript file extensions
   --jsx                       enable jsx (try to determine by default)
   --flow                      enable flow
   --no-jsx                    disable jsx
   --no-flow                   disable flow (default)
   --cache                     enable .putoutcache to speed up processing
   --fresh                     generate a fresh .putoutcache
```

To find possible transform places:

```
putout lib test
```

To apply transforms:

```
putout lib test --fix
```

## .putout.json
You can use the following `.putout.json` file if you want to disable all the rules:
```
{
    "rules": {
        "apply-destructuring": "off",
        "apply-nullish-coalescing": "off",
        "apply-numeric-separators": "off",
        "apply-optional-chaining": "off",
        "apply-shorthand-properties": "off",
        "apply-top-level-await": "off",
        "convert-array-copy-to-slice": "off",
        "convert-binary-expression-to-boolean": "off",
        "convert-commonjs-to-esm": "off",
        "convert-equal-to-strict-equal": "off",
        "convert-esm-to-commonjs": "off",
        "convert-for-each-to-for-of": "off",
        "convert-for-in-to-for-of": "off",
        "convert-for-to-for-of": "off",
        "convert-generic-to-shorthand": "off",
        "convert-index-of-to-includes": "off",
        "convert-math-pow": "off",
        "convert-object-assign-to-merge-spread": "off",
        "convert-template-to-string": "off",
        "convert-to-arrow-function": "off",
        "convert-top-level-return": "off",
        "extract-object-properties": "off",
        "extract-sequence-expressions": "off",
        "madrun": "off",
        "merge-destructuring-properties": "off",
        "merge-duplicate-imports": "off",
        "merge-if-statements": "off",
        "promises": "off",
        "putout": "off",
        "remove-boolean-from-logical-expressions": "off",
        "remove-console": "off",
        "remove-constant-conditions": "off",
        "remove-debugger": "off",
        "remove-double-negations": "off",
        "remove-duplicate-keys": "off",
        "remove-empty": "off",
        "remove-nested-blocks": "off",
        "remove-only": "off",
        "remove-process-exit": "off",
        "remove-skip": "off",
        "remove-unreachable-code": "off",
        "remove-unreferenced-variables": "off",
        "remove-unused-expressions": "off",
        "remove-unused-for-of-variables": "off",
        "remove-unused-private-fields": "off",
        "remove-unused-types": "off",
        "remove-unused-variables": "off",
        "remove-useless-arguments": "off",
        "remove-useless-array-from": "off",
        "remove-useless-async": "off",
        "remove-useless-await": "off",
        "remove-useless-escape": "off",
        "remove-useless-for-of": "off",
        "remove-useless-functions": "off",
        "remove-useless-spread": "off",
        "remove-useless-template-expressions": "off",
        "remove-useless-typeof": "off",
        "remove-useless-types": "off",
        "remove-useless-variables": "off",
        "reuse-duplicate-init": "off",
        "simplify-ternary": "off",
        "split-nested-destructuring": "off",
        "split-variable-declarations": "off",
        "strict-mode": "off"
    }
}
```

## Environment variables

`Putout` supports next `environment variables`:
- `PUTOUT_FILES` - files that should be processed by putout, divided by ",";

```js
PUTOUT_FILES=lib,test putout --fix
```

## Architecture

`Putout` consists of a couple simple parts, here is workflow representation.

![putout](https://github.com/coderaiser/putout/blob/master/images/putout.png)

## API

### putout(source, options)

First things first, `require` putout:

```js
const putout = require('putout');
```

Let's consider next `source` with two `variables` and one `call expression`:

```js
const hello = 'world';
const hi = 'there';

console.log(hello);
```

We can declare it as `source`:
```js
const source = `
    const hello = 'world';
    const hi = 'there';
    
    console.log(hello);
`;
```

#### Plugins

Putout supports dynamic loading of plugins from `node_modules`. Let's consider example of using [remove-unused-variables](https://github.com/coderaiser/putout/tree/master/packages/plugin-remove-unused-variables/README.md) plugin:

```js
putout(source, {
    plugins: [
        'remove-unused-variables',
    ]
});
// returns
{
  code: "\n    const hello = 'world';\n\n    console.log(hello);\n",
  places: []
}
```

As you see `places` is empty, but the code is changed: there is no `hi` variable.

#### No fix

From the first day `putout` was developed with ability to split main process into two concepts: `find` and `fix`.
This conception mirrorod in the code, so you can find all places with redundant variables:

```js
putout(source, {
    fix: false,
    plugins: [
        'remove-unused-variables',
    ]
});
// returns
{
  code: '\n' +
    "    const hello = 'world';\n" +
    "    const hi = 'there';\n" +
    '    \n' +
    '    console.log(hello);\n',
  places: [
    {
      rule: 'remove-unused-variables',
      message: '"hi" is defined but never used',
      position: { line: 3, column: 10 }
    }
  ]
}
```

## Built-in transforms

<details><summary>remove unused variables</summary>

```diff
  function show() {
-     const message = 'hello';
      console.log('hello world');
  }
```
</details>

<details><summary>remove unused for-of variables</summary>

```diff
-for (const {a, b} of c) {
+for (const {a} of c) {
    console.log(a);
}
```
</details>

<details><summary>remove unreferenced variables</summary>

```diff
-let a;
- a = 1;
let b;
b = 2;
console.log(b);
```
</details>

<details><summary>remove duplicate keys</summary>

```diff
const a = {
-    x: 'hello',
-    ...y,
    x: 'world',
    ...y,
}
```
</details>

<details><summary>remove unused private fields</summary>

```diff
  class Hello {
    #a = 5;
-   #b = 3;
    get() {
        return this.#a;
    };
}
```
</details>

<details><summary>remove unused expressions</summary>

```diff
  function show(error) {
-     showError;
  }
```
</details>

<details><summary>remove useless <code>variables</code></summary>

```diff
-   function hi(a) {
-       const b = a;
    };
+   function hi(b) {
    };
```
</details>

<details><summary>remove useless <code>functions</code></summary>

```diff
-   const f = (...a) => fn(...a);
+   const f = fn;
```
</details>

<details><summary>remove useless <code>typeof</code></summary>

```diff
- typeof typeof 'hello';
+ typeof 'hello';
```
</details>

<details><summary>remove useless <code>await</code></summary>

```diff
-   await await Promise.resolve('hello');
+   await Promise.resolve('hello');
```
</details>

<details><summary>remove useless <code>async</code></summary>

```diff
-const show = async () => {
+const show = () => {
    console.log('hello');
};
```
</details>

<details><summary>remove useless <code>arguments</code></summary>

```diff
onIfStatement({
    push,
-   generate,
-   abc,
})

function onIfStatement({push}) {
}
```
</details>

<details><summary>remove useless <code>template expressions</code></summary>

```diff
-let y =`${"hello"} + ${"world"}`;
+let y =`hello + world`;
```
</details>

<details><summary>remove useless <code>for-of</code></summary>

```diff
-for (const a of ['hello']) {
-    console.log(a);
-}
+console.log('hello');
```
</details>


<details><summary>reuse duplicate<code>init</code></summary>

```diff
const putout = require('putout');
-const {operator} = require('putout');
+const {operator} = putout;
```
</details>

<details><summary>convert <code>templates</code> with one <code>expression</code> to <code>string</code></summary>

```diff
-const c = `${a + b}`;
+const c = String(a + b);
```
</details>

<details><summary>convert <code>equal</code> to <code>strict equal</code></summary>

```diff
-if (a == b) {
+if (a === b) {
}
```
</details>

<details><summary>convert <code>indexOf</code> to <code>includes</code></summary>

```diff
-if (~array.indexOf(element)) {
+if (array.includes(element)) {
}
```
</details>

<details><summary>convert <code>generic</code> to <code>shorthand</code> for typescript (<a href=https://stackoverflow.com/a/36843084/4536327>why</a>)</summary>

```diff
interface A {
-    x: Array<X>;
+    x: X[];
}
```
</details>

<details><summary>remove useless <code>types</code> for typescript</summary>

```diff
type oldType = number;

-type newType = oldType;
-const x: newType = 5;
+const x: oldType = 5;
```
</details>

<details><summary>remove unused <code>types</code> for typescript</summary>

```diff
type n = number;
-type s = string;
+const x: n = 5;
```
</details>

<details><summary>remove useless <code>escape</code></summary>

```diff
-const t = 'hello \"world\"';
-const s1 = `hello \"world\"`;
-const s = `hello \'world\'`;
+const t = 'hello "world"';
+const s1 = `hello "world"`;
+const s = `hello 'world'`;
```
</details>

<details><summary>remove useless <code>Array.from</code></summary>

```diff
-for (const x of Array.from(y)) {}
+for (const x of y) {}
```
</details>

<details><summary>remove useless <code>spread</code></summary>

```diff
-for (const x of [...y]) {}
+for (const x of y) {}
```
</details>

<details><summary>remove useless <code>Promise.resolve</code></summary>

```diff
async () => {
-    return Promise.resolve('x');
+    return 'x';
}
```
</details>

<details><summary>convert<code>Promise.reject</code> to <code>throw</code></summary>

```diff
async () => {
-    return Promise.reject('x');
+    throw 'x';
}
```
</details>

<details><summary>remove <code>debugger</code> statement</summary>

```diff
- debugger;
```
</details>

<details><summary>remove <code>boolean</code> from <code>logical expressions</code></summary>

```diff
-const t = true && false;
+const t = false;
```
</details>

<details><summary>remove nested blocks</summary>

```diff
for (const x of Object.keys(a)) {
-   {
-       console.log(x);
-   }
+   console.log(x);
}
```
</details>

<details><summary>remove double negations</summary>

```diff
--if (!!a)
++if (a)
    console.log('hi');
```
</details>

<details><summary>remove unreachable code</summary>

```diff
function hi() {
    return 5;
-  console.log('hello');
}
```
</details>

<details><summary>replace <code>test.only</code> with <code>test</code> calls</summary>

```diff
-test.only('some test here', (t) => {
+test('some test here', (t) => {
    t.end();
});
```
</details>

<details><summary>replace <code>test.skip</code> with <code>test</code> calls</summary>

```diff
-test.skip('some test here', (t) => {
+test('some test here', (t) => {
    t.end();
});
```
</details>

<details><summary>remove <code>process.exit</code> call</summary>

```diff
-process.exit();
```
</details>

<details><summary>split variable declarations</summary>

```diff
-let a, b;
+let a;
+let b;
```
</details>

<details><summary>split nested destructuring</summary>

```diff
-const {a: {b}} = c;
+const {a} = c;
+const {b} = a;
```

</details>

<details><summary>simplify ternary</summary>

```diff
-module.exports = fs.copyFileSync ? fs.copyFileSync : copyFileSync;
+module.exports = fs.copyFileSync || copyFileSync;
```
</details>

<details><summary>remove <code>console.log</code> calls</summary>

```diff
-console.log('hello');
```
</details>

<details><summary>remove empty block statements</summary>

```diff
-if (x > 0) {
-}
```
</details>

<details><summary>remove empty patterns</summary>

```diff
-const {} = process;
```
</details>

<details><summary>remove strict mode directive from esm</summary>

```diff
-'use strict';
-
import * from fs;
```
</details>

<details><summary>Add <code>strict mode</code> directive in <code>commonjs</code> if absent</summary>

```diff
+'use strict';
+
const fs = require('fs');
```
</details>

<details><summary>remove <code>constant conditions</code></summary>

```diff
function hi(a) {
-   if (2 < 3) {
-       console.log('hello');
-       console.log('world');
-   }
+   console.log('hello');
+   console.log('world');
};

function world(a) {
-   if (false) {
-       console.log('hello');
-       console.log('world');
-   }
};
```
</details>

<details><summary>convert <code>esm</code> to <code>commonjs</code> (disabled)</summary>

```diff
-import hello from 'world';
+const hello = require('world');
```
</details>
<details><summary>convert <code>commonjs</code> to <code>esm</code> (disabled)</summary>

```diff
-const hello = require('world');
+import hello from 'world';
```
</details>

<details><summary>apply destructuring</summary>

```diff
-const hello = world.hello;
-const a = b[0];
+const {hello} = world;
+const [a] = b;
```
</details>

<details><summary>apply top-level-await (<a href=https://github.com/tc39/proposal-top-level-await>proposal-top-level-await</a>, disabled)</summary>

```diff
import fs from 'fs';

-(async () => {
-    const data = await fs.promises.readFile('hello.txt');
-})();
+const data = await fs.promises.readFile('hello.txt');
```
</details>

<details><summary>apply numeric separators(<a href=https://github.com/tc39/proposal-numeric-separator>proposal-numeric-separator</a>)</summary>

```diff
-const a = 100000000;
+const a = 100_000_000;
```
</details>

<details><summary>convert <code>throw</code> statement into expression (<a href=https://github.com/tc39/proposal-throw-expressions>proposal-throw-expressions</a>, disabled)</summary>

```diff
-const fn = (a) => {throw Error(a);}
+const fn = (a) => throw Error(a);
```
</details>

<details><summary>apply optional chaining (<a href=https://github.com/tc39/proposal-optional-chaining>proposal-optional-chaining</a>, disabled)</summary>

```diff
-const result = hello && hello.world;
+const result = hello?.world;
```
</details>

<details><summary>apply nullish coalescing (<a href=https://github.com/tc39/proposal-nullish-coalescing>proposal-nullish-coalescing</a>, disabled)</summary>

```diff
-result = typeof result  === 'undefined' ? 'hello': result;
result = result ?? 'hello';
```
</details>

<details><summary>apply shorthand properties</summary>

```diff
-export const setSession = (session) => ({
-    payload: session,
+export const setSession = (payload) => ({
+    payload,
});
```
</details>

<details><summary>merge destructuring properties</summary>

```diff
-const {one} = require('numbers'):
-const {two} = require('numbers');
+ const {
+   one,
+   two
+} = require('numbers');
```
</details>

<details><summary>merge duplicate imports</summary>

```diff
-import {m as b} from 'y';
-import {z} from 'y';
-import x from 'y';
+import x, {m as b, z} from 'y';
```
</details>

<details><summary>merge <code>if</code> statements</summary>

```diff
-if (a > b)
-    if (b < c)
-        console.log('hi');
+if (a > b && b < c)
+    console.log('hi');
```
</details>

<details><summary>convert <code>Math.pow</code> to <code>exponentiation operator</code></summary>

```diff
-Math.pow(2, 4);
+2 ** 4;
```

</details>

<details><summary>convert <code>anonymous</code> to <code>arrow function</code></summary>

```diff
-module.exports = function(a, b) {
+module.exports = (a, b) => {
}
```

</details>

<details><summary>convert <code>for</code> to <code>for-of</code></summary>

```diff
-for (let i = 0; i < items.length; i++) {
+for (const item of items) {
-   const item = items[i];
    log(item);
}
```

</details>

<details><summary>convert <code>forEach</code> to <code>for-of</code></summary>

```diff
-Object.keys(json).forEach((name) => {
+for (const name of Object.keys(json)) {
    manage(name, json[name]);
-});
+}
```

</details>

<details><summary>convert <code>for-in</code> to <code>for-of</code></summary>

```diff
-for (const name in object) {
-   if (object.hasOwnProperty(name)) {
+for (const name of Object.keys(object)) {
    console.log(a);
-   }
}
```

</details>

<details><summary>convert <code>array copy</code> to <code>slice</code></summary>

```diff
-const places = [
-    ...items,
-];
+const places = items.slice();
```
</details>


<details><summary>extract sequence expressions</summary>

```diff
-module.exports.x = 1,
-module.exports.y = 2;
+module.exports.x = 1;
+module.exports.y = 2;
```

</details>

<details><summary>extract object properties into variable</summary>

```diff
-const {replace} = putout.operator;
-const {isIdentifier} = putout.types;
+const {operator, types} = putout;
+const {replace} = operator;
+const {isIdentifier} = types;
```

</details>

<details><summary>convert <code>apply</code> to <code>spread</code></summary>

```diff
-console.log.apply(console, arguments);
+console.log(...arguments);
```
</details>

<details><summary>convert <code>arguments</code> to <code>rest</code></summary>

```diff
-function hello() {
-    console.log(arguments);
+function hello(...args) {
+    console.log(args);
}
```
</details>

<details><summary>convert <code>Object.assign</code> to <code>merge spread</code></summary>

```diff
function merge(a) {
-   return Object.assign({}, a, {
-       hello: 'world'
-   });
+   return {
+       ...a,
+       hello: 'world'
+   };
};
```
</details>

<details><summary>convert <code>binary expression</code> to <code>boolean</code></summary>

```diff
-   const a = b === b;
+   const a = true;
```
</details>

<details><summary>convert <code>top-level return</code> into <code>process.exit()</code>(because EcmaScript Modules doesn't support top level return)</summary>

```diff
-   return;
+   process.exit();
```
</details>

<details><summary>add <code>await</code> to <code>return promise()</code> statements (<a href=https://v8.dev/blog/fast-async>because it's faster, produces call stack and more readable</a>)</summary>

```diff
async run () {
-   return promise();
+   return await promise();
}
```
</details>

## Plugins

The `putout` repo is comprised of many npm packages. It is a [lerna](https://github.com/lerna/lerna) monorepo similar to [babel](https://github.com/babel/babel).

### Appliers

| Package | Version | Dependencies |
|--------|-------|------------|
| [`@putout/plugin-apply-destructuring`](/packages/plugin-apply-destructuring) | [![npm](https://img.shields.io/npm/v/@putout/plugin-apply-destructuring.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-apply-destructuring) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-apply-destructuring)](https://david-dm.org/coderaiser/putout?path=packages/plugin-apply-destructuring) |
| [`@putout/plugin-apply-top-level-await`](/packages/plugin-apply-top-level-await) | [![npm](https://img.shields.io/npm/v/@putout/plugin-apply-top-level-await.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-apply-top-level-await) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-apply-top-level-await)](https://david-dm.org/coderaiser/putout?path=packages/plugin-apply-top-level-await) |
| [`@putout/plugin-apply-optional-chaining`](/packages/plugin-apply-optional-chaining) | [![npm](https://img.shields.io/npm/v/@putout/plugin-apply-optional-chaining.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-apply-optional-chaining) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-apply-optional-chaining)](https://david-dm.org/coderaiser/putout?path=packages/plugin-apply-optional-chaining) |
| [`@putout/plugin-apply-nullish-coalescing`](/packages/plugin-apply-nullish-coalescing) | [![npm](https://img.shields.io/npm/v/@putout/plugin-apply-nullish-coalescing.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-apply-nullish-coalescing) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-apply-nullish-coalescing)](https://david-dm.org/coderaiser/putout?path=packages/plugin-apply-nullish-coalescing) |
| [`@putout/plugin-apply-shorthand-properties`](/packages/plugin-apply-shorthand-properties) | [![npm](https://img.shields.io/npm/v/@putout/plugin-apply-shorthand-properties.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-apply-shorthand-properties) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-apply-shorthand-properties)](https://david-dm.org/coderaiser/putout?path=packages/plugin-apply-shorthand-properties) |
| [`@putout/plugin-apply-numeric-separators`](/packages/plugin-apply-numeric-separators) | [![npm](https://img.shields.io/npm/v/@putout/plugin-apply-numeric-separators.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-apply-numeric-separators) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-apply-numeric-separators)](https://david-dm.org/coderaiser/putout?path=packages/plugin-apply-numeric-separators) |

### Splitters

| Package | Version | Dependencies |
|--------|-------|------------|
| [`@putout/plugin-split-variable-declarations`](/packages/plugin-split-variable-declarations) | [![npm](https://img.shields.io/npm/v/@putout/plugin-split-variable-declarations.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-split-variable-declarations) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-split-variable-declarations)](https://david-dm.org/coderaiser/putout?path=packages/plugin-split-variable-declarations) |
| [`@putout/plugin-split-nested-destructuring`](/packages/plugin-split-nested-destructuring) | [![npm](https://img.shields.io/npm/v/@putout/plugin-split-nested-destructuring.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-split-nested-destructuring) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-split-nested-destructuring)](https://david-dm.org/coderaiser/putout?path=packages/plugin-split-nested-destructuring) |

### Mergers

| Package | Version | Dependencies |
|--------|-------|------------|
| [`@putout/plugin-merge-destructuring-properties`](/packages/plugin-merge-destructuring-properties) | [![npm](https://img.shields.io/npm/v/@putout/plugin-merge-destructuring-properties.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-merge-destructuring-properties) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-merge-destructuring-properties)](https://david-dm.org/coderaiser/putout?path=packages/plugin-merge-destructuring-properties) |
| [`@putout/plugin-merge-duplicate-imports`](/packages/plugin-merge-duplicate-imports) | [![npm](https://img.shields.io/npm/v/@putout/plugin-merge-duplicate-imports.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-merge-duplicate-imports) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-merge-duplicate-imports)](https://david-dm.org/coderaiser/putout?path=packages/plugin-merge-duplicate-imports) |
| [`@putout/plugin-merge-if-statements`](/packages/plugin-merge-if-statements) | [![npm](https://img.shields.io/npm/v/@putout/plugin-merge-if-statements.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-merge-if-statements) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-merge-if-statements)](https://david-dm.org/coderaiser/putout?path=packages/plugin-merge-if-statements) |

### Converters

| Package | Version | Dependencies |
|--------|-------|------------|
| [`@putout/plugin-convert-esm-to-commonjs`](/packages/plugin-convert-esm-to-commonjs) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-esm-to-commonjs.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-esm-to-commonjs) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-esm-to-commonjs)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-esm-to-commonjs) |
| [`@putout/plugin-convert-commonjs-to-esm`](/packages/plugin-convert-commonjs-to-esm) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-commonjs-to-esm.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-commonjs-to-esm) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-commonjs-to-esm)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-commonjs-to-esm) |
| [`@putout/plugin-convert-array-copy-to-slice`](/packages/plugin-convert-array-copy-to-slice) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-array-copy-to-slice.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-array-copy-to-slice) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-array-copy-to-slice)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-array-copy-to-slice) |
| [`@putout/plugin-convert-template-to-string`](/packages/plugin-convert-template-to-string) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-template-to-string.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-template-to-string) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-template-to-string)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-template-to-string) |
| [`@putout/plugin-convert-equal-to-strict-equal`](/packages/plugin-convert-equal-to-strict-equal) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-equal-to-strict-equal.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-equal-to-strict-equal) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-equal-to-strict-equal)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-equal-to-strict-equal) |
| [`@putout/plugin-convert-index-of-to-includes`](/packages/plugin-convert-index-of-to-includes) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-index-of-to-includes.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-index-of-to-includes) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-index-of-to-includes)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-index-of-to-includes) |
| [`@putout/plugin-convert-generic-to-shorthand`](/packages/plugin-convert-generic-to-shorthand) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-generic-to-shorthand.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-generic-to-shorthand) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-generic-to-shorthand)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-generic-to-shorthand) |
| [`@putout/plugin-convert-math-pow`](/packages/plugin-convert-math-pow) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-math-pow.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-math-pow) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-math-pow)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-math-pow) |
| [`@putout/plugin-convert-to-arrow-function`](/packages/plugin-convert-to-arrow-function) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-to-arrow-function.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-to-arrow-function) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-to-arrow-function)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-to-arrow-function) |
| [`@putout/plugin-convert-for-to-for-of`](/packages/plugin-convert-for-to-for-of) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-for-to-for-of.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-for-to-for-of) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-for-to-for-of)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-for-to-for-of) |
| [`@putout/plugin-convert-for-each-to-for-of`](/packages/plugin-convert-for-each-to-for-of) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-for-each-to-for-of.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-for-each-to-for-of) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-for-each-to-for-of)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-for-each-to-for-of) |
| [`@putout/plugin-convert-for-in-to-for-of`](/packages/plugin-convert-for-in-to-for-of) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-for-in-to-for-of.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-for-in-to-for-of) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-for-in-to-for-of)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-for-in-to-for-of) |
| [`@putout/plugin-convert-object-assign-to-merge-spread`](/packages/plugin-convert-object-assign-to-merge-spread) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-object-assign-to-merge-spread.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-object-assign-to-merge-spread) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-object-assign-to-merge-spread)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-object-assign-to-merge-spread) |
| [`@putout/plugin-convert-binary-expression-to-boolean`](/packages/plugin-convert-binary-expression-to-boolean) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-binary-expression-to-boolean.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-binary-expression-to-boolean) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-binary-expression-to-boolean)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-binary-expression-to-boolean) |
| [`@putout/plugin-convert-top-level-return`](/packages/plugin-convert-top-level-return) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-top-level-return.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-top-level-return) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-top-level-return)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-top-level-return) |

### Removers

| Package | Version | Dependencies |
|--------|-------|------------|
| [`@putout/plugin-remove-unused-variables`](/packages/plugin-remove-unused-variables) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-unused-variables.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-unused-variables) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-unused-variables)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-unused-variables) |
| [`@putout/plugin-remove-unused-for-of-variables`](/packages/plugin-remove-unused-for-of-variables) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-unused-for-of-variables.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-unused-for-of-variables) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-unused-for-of-variables)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-unused-for-of-variables) |
| [`@putout/plugin-remove-unused-types`](/packages/plugin-remove-unused-types) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-unused-types.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-unused-types) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-unused-types)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-unused-types) |
| [`@putout/plugin-remove-unreferenced-variables`](/packages/plugin-remove-unreferenced-variables) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-unreferenced-variables.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-unreferenced-variables) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-unreferenced-variables)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-unreferenced-variables) |
| [`@putout/plugin-remove-duplicate-keys`](/packages/plugin-remove-duplicate-keys) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-duplicate-keys.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-duplicate-keys) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-duplicate-keys)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-duplicate-keys) |
| [`@putout/plugin-remove-unused-expressions`](/packages/plugin-remove-unused-expressions) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-unused-expressions.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-unused-expressions) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-unused-expressions)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-unused-expressions) |
| [`@putout/plugin-remove-unused-private-fields`](/packages/plugin-remove-unused-private-fields) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-unused-private-fields.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-unused-private-fields) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-unused-private-fields)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-unused-private-fields) |
| [`@putout/plugin-remove-useless-variables`](/packages/plugin-remove-useless-variables) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-variables.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-variables) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-variables)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-variables) |
| [`@putout/plugin-remove-useless-functions`](/packages/plugin-remove-useless-functions) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-functions.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-functions) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-functions)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-functions) |
| [`@putout/plugin-remove-useless-async`](/packages/plugin-remove-useless-async) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-async.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-async) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-async)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-async) |
| [`@putout/plugin-remove-useless-await`](/packages/plugin-remove-useless-await) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-await.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-await) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-await)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-await) |
| [`@putout/plugin-remove-useless-typeof`](/packages/plugin-remove-useless-typeof) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-typeof.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-typeof) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-typeof)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-typeof) |
| [`@putout/plugin-remove-useless-types`](/packages/plugin-remove-useless-types) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-types.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-types) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-types)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-types) |
| [`@putout/plugin-remove-useless-array-from`](/packages/plugin-remove-useless-array-from) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-array-from.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-array-from) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-array-from)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-array-from) |
| [`@putout/plugin-remove-useless-spread`](/packages/plugin-remove-useless-spread) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-spread.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-spread) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-spread)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-spread) |
| [`@putout/plugin-remove-useless-arguments`](/packages/plugin-remove-useless-arguments) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-arguments.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-arguments) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-arguments)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-arguments) |
| [`@putout/plugin-remove-useless-escape`](/packages/plugin-remove-useless-escape) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-escape.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-escape) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-escape)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-escape) |
| [`@putout/plugin-remove-useless-template-expressions`](/packages/plugin-remove-useless-template-expressions) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-template-expressions.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-template-expressions) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-template-expressions)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-template-expressions) |
| [`@putout/plugin-remove-useless-for-of`](/packages/plugin-remove-useless-for-of) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-useless-for-of.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-useless-for-of) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-useless-for-of)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-useless-for-of) |
| [`@putout/plugin-remove-process-exit`](/packages/plugin-remove-process-exit) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-process-exit.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-process-exit) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-process-exit)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-process-exit) |
| [`@putout/plugin-remove-debugger`](/packages/plugin-remove-debugger) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-debugger.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-debugger) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-debugger)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-debugger) |
| [`@putout/plugin-remove-only`](/packages/plugin-remove-only) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-only.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-only) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-only)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-only) |
| [`@putout/plugin-remove-skip`](/packages/plugin-remove-skip) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-skip.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-skip) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-skip)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-skip) |
| [`@putout/plugin-remove-double-negations`](/packages/plugin-remove-double-negations) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-double-negations.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-double-negations) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-double-negations)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-double-negations) |
| [`@putout/plugin-remove-unreachable-code`](/packages/plugin-remove-unreachable-code) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-unreachable-code.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-unreachable-code) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-unreachable-code)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-unreachable-code) |
| [`@putout/plugin-remove-console`](/packages/plugin-remove-console) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-console.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-console) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-console)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-console) |
| [`@putout/plugin-remove-empty`](/packages/plugin-remove-empty) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-empty.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-empty) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-empty)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-empty) |
| [`@putout/plugin-remove-empty-pattern`](/packages/plugin-remove-empty-pattern) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-empty-pattern.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-empty-pattern) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-empty-pattern)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-empty-pattern) |
| [`@putout/plugin-remove-constant-conditions`](/packages/plugin-remove-constant-conditions) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-constant-conditions.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-constant-conditions) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-constant-conditions)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-constant-conditions) |
| [`@putout/plugin-remove-boolean-from-logical-expressions`](/packages/plugin-remove-boolean-from-logical-expressions) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-boolean-from-logical-expressions.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-boolean-from-logical-expressions) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-boolean-from-logical-expressions)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-boolean-from-logical-expressions) |
| [`@putout/plugin-remove-nested-blocks`](/packages/plugin-remove-nested-blocks) | [![npm](https://img.shields.io/npm/v/@putout/plugin-remove-nested-blocks.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-remove-nested-blocks) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-remove-nested-blocks)](https://david-dm.org/coderaiser/putout?path=packages/plugin-remove-nested-blocks) |

### Not bundled

Next packages not bundled with `putout` but can be installed separately.

| Package | Version | Dependencies |
|--------|-------|------------|
| [`@putout/plugin-react-hooks`](/packages/plugin-react-hooks) | [![npm](https://img.shields.io/npm/v/@putout/plugin-react-hooks.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-react-hooks) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-react-hooks)](https://david-dm.org/coderaiser/putout?path=packages/plugin-react-hooks) |
| [`@putout/plugin-convert-spread-to-array-from`](/packages/plugin-convert-spread-to-array-from) | [![npm](https://img.shields.io/npm/v/@putout/plugin-convert-spread-to-array-from.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-convert-spread-to-array-from) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-convert-spread-to-array-from)](https://david-dm.org/coderaiser/putout?path=packages/plugin-convert-spread-to-array-from) |
| [`@putout/plugin-cloudcmd`](/packages/plugin-cloudcmd) | [![npm](https://img.shields.io/npm/v/@putout/plugin-cloudcmd.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-cloudcmd) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-cloudcmd)](https://david-dm.org/coderaiser/putout?path=packages/plugin-cloudcmd) |

### Other

| Package | Version | Dependencies |
|--------|-------|------------|
| [`@putout/plugin-reuse-duplicate-init`](/packages/plugin-reuse-duplicate-init) | [![npm](https://img.shields.io/npm/v/@putout/plugin-reuse-duplicate-init.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-reuse-duplicate-init) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-reuse-duplicate-init)](https://david-dm.org/coderaiser/putout?path=packages/plugin-reuse-duplicate-init) |
| [`@putout/plugin-madrun`](/packages/plugin-madrun) | [![npm](https://img.shields.io/npm/v/@putout/plugin-madrun.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-madrun) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-madrun)](https://david-dm.org/coderaiser/putout?path=packages/plugin-madrun) |
| [`@putout/plugin-strict-mode`](/packages/plugin-strict-mode) | [![npm](https://img.shields.io/npm/v/@putout/plugin-strict-mode.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-strict-mode) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-strict-mode)](https://david-dm.org/coderaiser/putout?path=packages/plugin-strict-mode) |
| [`@putout/plugin-extract-sequence-expressions`](/packages/plugin-extract-sequence-expressions) | [![npm](https://img.shields.io/npm/v/@putout/plugin-extract-sequence-expressions.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-extract-sequence-expressions) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-extract-sequence-expressions)](https://david-dm.org/coderaiser/putout?path=packages/plugin-extract-sequence-expressions) |
| [`@putout/plugin-extract-object-properties`](/packages/plugin-extract-object-properties) | [![npm](https://img.shields.io/npm/v/@putout/plugin-extract-object-properties.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-extract-object-properties) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-extract-object-properties)](https://david-dm.org/coderaiser/putout?path=packages/plugin-extract-object-properties) |
| [`@putout/plugin-simplify-ternary`](/packages/plugin-simplify-ternary) | [![npm](https://img.shields.io/npm/v/@putout/plugin-simplify-ternary.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-simplify-ternary) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-simplify-ternary)](https://david-dm.org/coderaiser/putout?path=packages/plugin-simplify-ternary) |
| [`@putout/plugin-putout`](/packages/plugin-putout) | [![npm](https://img.shields.io/npm/v/@putout/plugin-putout.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-putout) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-putout)](https://david-dm.org/coderaiser/putout?path=packages/plugin-putout) |
| [`@putout/plugin-add-return-await`](/packages/plugin-add-return-await) | [![npm](https://img.shields.io/npm/v/@putout/plugin-add-return-await.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-add-return-await) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-add-return-await)](https://david-dm.org/coderaiser/putout?path=packages/plugin-add-return-await) |
| [`@putout/plugin-promises`](/packages/plugin-promises) | [![npm](https://img.shields.io/npm/v/@putout/plugin-promises.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/plugin-promises) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/plugin-promises)](https://david-dm.org/coderaiser/putout?path=packages/plugin-promises) |

## Formatters

`putout` use formatters similar to [eslint's formatters](https://eslint.org/docs/user-guide/formatters/).
You can specify a formatter using the `--format` or `-f` flag on the command line. For example, `--format codeframe` uses the `codeframe` formatter.

The built-in formatter options are:
- `dump`
- `stream`
- `json`
- `codeframe`
- `progress`
- `frame` (`codeframe` + `progress`)

| Package | Version | Dependencies |
|---------|---------|--------------|
| [`@putout/formatter-dump`](/packages/formatter-dump) | [![npm](https://img.shields.io/npm/v/@putout/formatter-dump.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/formatter-dump) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/formatter-dump)](https://david-dm.org/coderaiser/putout?path=packages/formatter-dump) |
| [`@putout/formatter-stream`](/packages/formatter-stream) | [![npm](https://img.shields.io/npm/v/@putout/formatter-stream.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/formatter-stream) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/formatter-stream)](https://david-dm.org/coderaiser/putout?path=packages/formatter-stream) |
| [`@putout/formatter-progress`](/packages/formatter-progress) | [![npm](https://img.shields.io/npm/v/@putout/formatter-progress.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/formatter-progress) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/formatter-progress)](https://david-dm.org/coderaiser/putout?path=packages/formatter-progress) |
| [`@putout/formatter-json`](/packages/formatter-json) | [![npm](https://img.shields.io/npm/v/@putout/formatter-json.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/formatter-json) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/formatter-json)](https://david-dm.org/coderaiser/putout?path=packages/formatter-json) |
| [`@putout/formatter-codeframe`](/packages/formatter-codeframe) | [![npm](https://img.shields.io/npm/v/@putout/formatter-codeframe.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/formatter-codeframe) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/formatter-codeframe)](https://david-dm.org/coderaiser/putout?path=packages/formatter-codeframe) |
| [`@putout/formatter-frame`](/packages/formatter-frame) | [![npm](https://img.shields.io/npm/v/@putout/formatter-frame.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/formatter-frame) | [![Dependency Status](https://david-dm.org/frame/putout.svg?path=packages/formatter-frame)](https://david-dm.org/frame/putout?path=packages/formatter-frame) |
| [`@putout/formatter-eslint`](/packages/formatter-eslint) | [![npm](https://img.shields.io/npm/v/@putout/formatter-eslint.svg?maxAge=86400)](https://www.npmjs.com/package/@putout/formatter-eslint) | [![Dependency Status](https://david-dm.org/coderaiser/putout.svg?path=packages/formatter-eslint)](https://david-dm.org/coderaiser/putout?path=packages/formatter-eslint) |

### Custom Formatter

Formatter function executes on every processed file, it should return `output string`.

```js
module.exports = ({name, source, places, index, count, filesCount, errorsCount}) => {
    return '';
};
```

Here is list of options:

- `name` - name of processed file
- `source` - source code of processed file
- `index` - current index
- `count` - processing files count
- `filesCount` - count of files with errors
- `errorsCount` count of errors

You can avoid any of this and use only what you nead. To make possible using with `putout` add prefix `putout-formatter-` to your `npm package`,
and add tags `putout`, `formatter`, `putout-formatter`.

### Eslint Formatters

`eslint formatters` can be used as well with help of `@putout/formatter-eslint` this way:

Install:
```
npm i putout @putout/formatter-eslint eslint-formatter-pretty -D
```

Run:
```sh
ESLINT_FORMATTER=pretty putout -f eslint lib
```

## Configuration

To configure `putout` add section `putout` to your `package.json` file or create `.putout.json` file and override any of [default options](/packages/putout/putout.json).

### Rules

By default all rules located in `plugins` section (and default rules) are enabled by default.
You can disable rules using "off", or enable them (in `match` section) using "on".

```json
{
    "rules": {
        "remove-unused-variables": "off"
    }
}
```

Or pass options using `rules` section:

```json
{
    "rules": {
        "remove-unused-variables": ["on", {
            "exclude": "const global = __"
        }]
    }
}
```

With help of `exclude` you can set code pattern to exclude for current rule.
Pass an array when you have a couple templates to exclude.

`exclude` is cross-plugins function supported by core, when develop your plugin, please use other name
to keep users ability to customize all plugins in a way they need to.

### Match

When you need to match paths to rules you can use `match` section for this purpose in `.putout.json`:

```json
{
    "match": {
        "server": {
            "remove-process-exit": true
        }
    }
}
```

### Ignore

When you need to ignore some routes no metter what, you can use `ignore` section in `.putout.json`:

```json
{
    "ignore": [
        "test/fixture"
    ]
}
```

### Plugins

There is two types of plugins supported by `putout`, their names in npm started with prefix:
- `@putout/plugin-` for official plugins
- `putout-plugin-` for user plugins

*Example*
If you need to `remove-something` create `putout` plugin with a name `putout-plugin-remove-something` and add it to `.putout.json`:

```json
{
    "plugins": [
        "remove-something"
    ]
}
```

Add `putout` as a `peerDependency` to your `packages.json`.

*Always add keywords `putout`, `putout-plugin` when publish putout plugin to `npm` so others can easily find it.*

#### Plugins API

Let's consider a couple plugin types, that can be used.

##### Replacer

The simplest `putout` plugin type, consits of 2 functions:

- `report(path)` - report error message to `putout` cli;
- `replace` - replace `key` template into `value` template;

```js
module.exports.report = () => 'use optional chaining';
module.exports.replace = () => ({
    '__a && __a.__b': '__a?.__b',
});
```

This plugin will find and sugest to replace all occurences of code: `object && object.property` into `object?.property`.

##### Includer

More powerful plugin type, when you need more control over traversing.
It should contain next 2 functions:

- `report(path)` - report error message to `putout` cli;
- `fix(path)` - fixes paths using `places` array received using `find` function;

and one or more of this:
- `filter(path)` - filter path, should return `true`, or `false` (don't use with `traverse`);
- `include` - returns array of templates, or node names to include;
- `exclude` - returns array of templates, or node names to exclude;

```js
module.exports.report = () => 'use optional chaining';
module.exports.include = () => [
    'debugger'
];

module.exports.fix = (path) => {
    path.remove(path);
};
```

More information about supported plugin types you can find at [@putout/engine-runner](https://github.com/coderaiser/putout/tree/master/packages/engine-runner).
About the process of plugins loading you can find at [@putout/engine-loader](https://github.com/coderaiser/putout/tree/master/packages/engine-loader).

When you need, you can use [@babel/types](https://babeljs.io/docs/en/next/babel-types.html), [template](https://babeljs.io/docs/en/next/babel-template.html) and [generate](https://babeljs.io/docs/en/babel-generator). All of this can be get from `putout`:

```js
const {
    types,
    template,
    generate,
} = require('putout');
```

Most information you can find in [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) is relevant to `putout` plugins.
To understand how things works from the inside take a look at [Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler).

##### Operator

When you need to use `replaceWith`, `replaceWithMultiple`, or `insertAfter`, please use `operator` insted of `path`-methods.

```js
const {template, operator} = require('putout');
const {replaceWith} = operator;

const ast = template.ast(`
  const str = 'hello';
`);

module.exports.fix = (path) => {
    // wrong
    path.replaceWith(ast);
    
    // correct
    replaceWith(path, ast);
}
```

This should be done to preserve `loc` and `comments` information, which is different in `babel` and `recast`. `putout` will handle this case for you :),
just use methods of `operator`.


#### Putout Plugin

When you work on a `plugin` or `codemod` please add rule `putout` into `.putout.json`:

```
{
    "rules": {
        "putout": true
    }
}
```

[@putout/plugin-putout](https://github.com/coderaiser/putout/tree/master/packages/plugin-putout) will handle plugin-specific cases for you :).

#### Example

Let's consider simplest possible plugin for removing `debugger statements` [@putout/plugin-remove-debugger](https://github.com/coderaiser/putout/tree/master/packages/plugin-remove-debugger):

```js
// this is a message to show in putout cli
module.exports.report = () => 'Unexpected "debugger" statement';

// lets find all "debugger" statements and replace them with ""
module.exports.replace = () => {
    'debugger': '',
};
```

`Visitor` used in `traverse function` can be code template as well. So when you need to find `module.exports = <something>`, you
can use:

```js
module.exports.traverse = ({push}) => {
    return {
        'module.exports = __'(path) {
            push(path);
        }
    }
};
```

Where `__` is a placeholder for anything.

*Remember: template key should be valid JavaScript, or Type name like in previous example.*

You can aslo use `include` and/or `exclude` insead of `traverse` and `filter` ([more sophisticated example](https://github.com/coderaiser/putout/blob/master/packages/plugin-add-return-await/lib/add-return-await.js)):

```js
// should be always used include/or exclude, when traverse not used
module.exports.include = () => [
    'debugger',
];

// optional
module.exports.exclude = () => [
    'console.log'
];

// optional
module.exports.filter = (path) => {
    // do some checks
    return true;
}
```

#### Template

There is predefined placeholders:

- `__` - any code;
- `"__"` - any string literal;
- ``__`` - any template string literal;

#### Testing

That was the simplest module to remove `debugger` statements in your code. Let's look how to test it using [@putout/test](https://github.com/coderaiser/putout/tree/master/packages/test):

```js
const removeDebugger = require('..');
const test = require('@putout/test')(__dirname, {
    'remove-debugger': removeDebugger,
});

// this is how we test that messages is correct
test('remove debugger: report', (t) => {
    t.reportCode('debugger', 'Unexpected "debugger" statement');
    t.end();
});

// stetement should be removed so result is empty
test('remove debugger: transformCode', (t) => {
    t.transformCode('debugger', '');
    t.end();
});
```

As you see test runner it is little bit modifed [tape](https://github.com/substack/tape).
To see more sophisticated example look at [@putout/remove-console](https://github.com/coderaiser/putout/tree/master/packages/plugin-remove-console).

### Babel Plugins

You can add `babel` to `plugins` section of `.putout.json` with `babel/` prefix.

*You can disable rule, or use match in a similar, way*
*Remember to omit `babel-plugin-` or `@babel/plugin`: putout will set it up for you :)*

*Example*
Let's add `babel-plugin-transform-inline-consecutive-adds` to `.putout.json`:

```json
{
    "plugins": [
        "babel/transform-inline-consecutive-adds"
    ]
}
```

Then create a file and process it with help of `babel plugin`.

```sh
coderaiser@cloudcmd:~$ cat > a.js
const t = [];
t.push(1);
t.push(2);

coderaiser@cloudcmd:~$ putout a.js -f codeframe
/home/coderaiser/a.js:4:0
  2 | t.push(1);
  3 | t.push(2);
> 4 |
    | ^ transform inline consecutive adds

✖ 1 errors in 1 files
  fixable with the `--fix` option
coderaiser@cloudcmd:~$ putout --fix a.js
coderaiser@cloudcmd:~$ cat a.js
const t = [1, 2];
```

Using `putout` as a runner for `babel` `plugins` you can not only change file content, but also see what exactly will be changed. You can use your already written
`babel` `plugins` or reuse work in progress plugins made for `babel`, but remember that `putout` `plugins` gave more accurate information about changing places, and works faster (no need to find infromation about changes in transformed file).

#### Babel plugins list

Here you can find `babel plugins` which feets the most main purpose of `putout` and adviced to use:

<details><summary><a href="https://babeljs.io/docs/en/babel-plugin-transform-inline-consecutive-adds">transform-inline-consecutive-adds</a></summary>

```diff
-const foo = {};
-foo.a = 42;
-foo.b = ["hi"];
-foo.c = bar();
-foo.d = "str";
+const foo = {
+  a: 42,
+  b: ["hi"],
+  c: bar(),
+  d: "str"
+};

-const bar = [];
-bar.push(1);
-bar.push(2);
+const bar = [1, 2];
```
</details>

<details><summary><a href="https://github.com/babel/babel/tree/master/codemods/babel-plugin-codemod-object-assign-to-object-spread">codemod-object-assign-to-object-spread</a></summary>

```diff
function merge(a) {
-   return Object.assign({}, a, {
-       hello: 'world'
-   });
+   return {
+       ...a,
+       hello: 'world'
+   };
};
```
</details>

<details><summary><a href="https://github.com/babel/babel/tree/master/codemods/babel-plugin-codemod-optional-catch-binding">codemod-optional-catch-binding</a></summary>

```diff
try {
    throw 0;
-} catch (err) {
+} catch {
    console.log("it failed, but this code executes");
}
```
</details>

Please send pull requests with `babel plugins` which can be used as codemods, or simplify, fix, makes code more readable.

### JSCodeshift

`jscodeshift` codemods can be added to `plugins` section of `.putout.json` with prefix `jscodeshift/`. This way:

*Example*

```json
{
    "plugins": [
        "jscodeshift/async-await-codemod"
    ]
}
```

#### JSCodeshift codemods list

Here you can find `jscodeshift codemods` which feets the most main purpose of `putout` and adviced to use:

<details><summary><a href="https://github.com/sgilroy/async-await-codemod">async-await-codemod</a></summary>

```diff
-function makeRequest() {
-  return getJSON().then(data => {
-    console.log(data);
-    return 'done';
-  });
+ async function makeRequest() {
+  const data = await getJSON();
+  console.log(data);
+  return 'done';
}
```
</details>

Please send pull requests with `jscodeshift codemods` which can be used to simplify, fix or makes code more readable.

## Codemods

`putout` supports `codemodes` in the similar to plugins way, just create a directory `~/.putout` and put your plugins there. Here is example: [convert-tape-to-supertape](https://github.com/coderaiser/putout/tree/master/codemods/plugin-convert-tape-to-supertape) and [this is example of work](https://github.com/coderaiser/putout/commit/ad02cebc344ce73cdee668cffc5078bf08830d52).

## ESLint

If you see that `putout` brokes formatting of your code, use eslint plugin [eslint-plugin-putout](https://github.com/coderaiser/putout/tree/master/packages/eslint-plugin-putout).

Install `eslint-plugin-putout` with:
```
npm i eslint eslint-plugin-putout -D
```

Then create `.eslintrc.json`:

```json
{
    "extends": [
        "plugin:putout/recommended"
    ],
    "plugins": [
        "putout"
    ]
}
```

And use with `putout` this way:

```sh
putout --fix lib
```

To set custom `eslint config file` use `ESLINT_CONFIG_FILE` env variable:

```sh
ESLINT_CONFIG_FILE=test.eslintrc.json putout --fix lib
```

You can even use only `eslint`, because `putout` bundled to `eslint-plugin-putout` with:

```js
eslint --fix lib
```

Will uses putout transformations for you :).

## Babel

`Putout` can be used as [babel plugin](/packages/babel-plugin-putout).
Just create `.babelrc` file with configuration you need.

```json
{
  "plugins": [
      ["putout", {
          "rules": {
              "remove-unused-variables": false
          }
      }]
  ]
}
```

## License

MIT
