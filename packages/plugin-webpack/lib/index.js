'use strict';

const getRule = (a) => ({
    [a]: require(`./${a}`),
});

module.exports.rules = getRule('convert-loader-to-use');
