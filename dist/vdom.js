/*! @ryanmorr/simple-vdom v0.1.1 | https://github.com/ryanmorr/simple-vdom */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vdom = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = patch;
exports.h = h;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Add or remove an attribute/event to
 * and from an element
 *
 * @param {Element} element
 * @param {String} name
 * @param {String|Number|Boolean|Function} newVal
 * @param {String|Number|Boolean|Function} oldVal (optional)
 * @api private
 */
function updateAttribute(element, name, newVal) {
  var oldVal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (name[0] === 'o' && name[1] === 'n') {
    name = name.slice(2).toLowerCase();

    if (newVal == null) {
      element.removeEventListener(name, oldVal);
    } else if (oldVal == null) {
      element.addEventListener(name, newVal);
    }

    return;
  }

  if (newVal == null || newVal === false) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, newVal);
  }
}
/**
 * Create a DOM node from a virtual
 * node
 *
 * @param {Object|String} vnode
 * @param {String} vnode.nodeName
 * @param {Object} vnode.attributes
 * @param {Array} vnode.children
 * @return {Element}
 * @api private
 */


function createElement(vnode) {
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  var element = document.createElement(vnode.nodeName),
      attributes = vnode.attributes;
  Object.keys(attributes).forEach(function (name) {
    return updateAttribute(element, name, attributes[name]);
  });
  vnode.children.map(createElement).forEach(function (node) {
    return element.appendChild(node);
  });
  return element;
}
/**
 * Recursively patch a DOM element so that
 * it matches the updated virtual tree
 *
 * @param {Element} parent
 * @param {Object|String} newNode
 * @param {Object|String} oldNode (optional)
 * @param {Number} index (optional)
 * @api public
 */


function patch(parent, newNode) {
  var oldNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var element = parent.childNodes[index];

  if (oldNode == null) {
    return parent.appendChild(createElement(newNode));
  }

  if (newNode == null) {
    return parent.removeChild(element);
  } else if (_typeof(newNode) !== _typeof(oldNode) || typeof newNode === 'string' && newNode !== oldNode || newNode.nodeName !== oldNode.nodeName) {
    return parent.replaceChild(createElement(newNode), element);
  }

  if (newNode.nodeName) {
    for (var name in Object.assign({}, newNode.attributes, oldNode.attributes)) {
      updateAttribute(element, name, newNode.attributes[name], oldNode.attributes[name]);
    }

    for (var i = 0; i < Math.max(newNode.children.length, oldNode.children.length); ++i) {
      patch(element, newNode.children[i], oldNode.children[i], i);
    }
  }
}
/**
 * JSX-compatible virtual DOM builder
 *
 * @param {String} nodeName
 * @param {Object|Null} attributes (optional)
 * @param {...String|Object} children (optional)
 * @return {Object}
 * @api public
 */


function h(nodeName, attributes) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  attributes = attributes || {};
  return {
    nodeName: nodeName,
    attributes: attributes,
    children: children
  };
}

},{}]},{},[1])(1)
});

