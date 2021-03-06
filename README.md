# simple-vdom

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> A tiny virtual DOM implementation

## Install

Download the [development](http://github.com/ryanmorr/simple-vdom/raw/master/dist/vdom.js) or [minified](http://github.com/ryanmorr/simple-vdom/raw/master/dist/vdom.min.js) version, or install via NPM:

``` sh
npm install @ryanmorr/simple-vdom
```

## Usage

Import the `h` function to build virtual DOM trees and the `patch` function to diff two virtual DOM trees and update the DOM:

``` javascript
import { h, patch } from '@ryanmorr/simple-vdom';
```

Patch an element's content by providing the root element as the first argument, the new virtual DOM tree as the second argument, and the current virtual DOM tree as the third argument (if necessary):

``` javascript
patch(
    document.querySelector('#root'),
    h('div', null, 
        h('h1', null, 'Hello World'),
        h('p', null, 'Here is some content')
    ),
    h('div')
);
```

Supports patching of attributes, including CSS styles as a string and event listeners indicated by a prefix of "on":

``` javascript
patch(
    document.querySelector('#root'),
    h('div', {
        class: 'foo bar',
        style: 'width: 100px; height: 100px; background-color: red',
        onClick: (e) => handleEvent(e)
    }),
    h('div')
);
```

Supports basic [JSX](https://reactjs.org/docs/introducing-jsx.html) syntax (not components):

``` javascript
patch(
    document.querySelector('#root'),
    <div>
        <h1>{title}</h1>
        <button onClick={handleEvent}>Submit</button>
    </div>,
    <div></div>
);
```

If you want to support JSX and you're using Babel, install the [JSX transform plugin](https://babeljs.io/docs/plugins/transform-react-jsx) and add the pragma option to your Babel config:

``` json
{
  "plugins": [["transform-react-jsx", { "pragma": "h" }]]
}
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/simple-vdom
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fsimple-vdom.svg
[build-url]: https://travis-ci.org/ryanmorr/simple-vdom
[build-image]: https://travis-ci.org/ryanmorr/simple-vdom.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE