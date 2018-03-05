object-to-query-string(object)
========================================

[![Build Status](https://travis-ci.org/ramumb/object-to-query-string.svg?branch=master)](https://travis-ci.org/ramumb/object-to-query-string)
[![Coverage Status](https://coveralls.io/repos/github/ramumb/object-to-query-string/badge.svg?branch=master)](https://coveralls.io/github/ramumb/object-to-query-string?branch=master)

This is a port of the [PrototypeJS](http://prototypejs.org/) method
`toQueryString`. It turns an object into its URL-encoded query string
representation.  There's an inverse of this method called `toQueryParams` that's
available at [string-to-query-params](https://github.com/ramumb/string-to-query-params).

`object-to-query-string` is a form of serialization, and is mostly useful to
provide complex parameter sets for stuff such as objects related to Ajax.

Undefined-value pairs will be serialized as if empty-valued. Array-valued pairs
will get serialized with one name/value pair per array element. All values get
URI-encoded using JavaScript's native `encodeURIComponent` function.

The order of pairs in the serialized form is not guaranteed (and mostly
irrelevant anyway) — except for array-based parts, which are serialized in
array order.

Note that undefined will be returned for any non- object parameter.

## Installation

  `npm install @ramumb/object-to-query-string`

## Usage

    var toQueryString = require("object-to-query-string");

    toQueryString({section: 'blog', id: '45'});
    // -> 'section=blog&id=45'
    
    toQueryString({section: 'blog', tag: ['javascript', 'prototype', 'doc']});
    // -> 'section=blog&tag=javascript&tag=prototype&tag=doc'
    
    toQueryString({tag: 'ruby on rails'});
    // -> 'tag=ruby+on+rails'
    
    toQueryString({id: '45', raw: undefined});
    // -> 'id=45&raw'

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code.  See the [CONTRIBUTING](CONTRIBUTING.md) file for more detailed information.
