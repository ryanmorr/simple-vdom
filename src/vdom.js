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
function updateAttribute(element, name, newVal, oldVal = null) {
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
    const element = document.createElement(vnode.nodeName), attributes = vnode.attributes;
    Object.keys(attributes).forEach((name) => updateAttribute(element, name, attributes[name]));
    vnode.children.map(createElement).forEach((node) => element.appendChild(node));
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
export function patch(parent, newNode, oldNode = null, index = 0) {
    const element = parent.childNodes[index];
    if (oldNode == null) {
        return parent.appendChild(createElement(newNode));
    }
    if (newNode == null) {
        return parent.removeChild(element);
    } else if (typeof newNode !== typeof oldNode
        || typeof newNode === 'string' && newNode !== oldNode
        || newNode.nodeName !== oldNode.nodeName) {
        return parent.replaceChild(createElement(newNode), element);
    }
    if (newNode.nodeName) {
        for (const name in Object.assign({}, newNode.attributes, oldNode.attributes)) {
            updateAttribute(element, name, newNode.attributes[name], oldNode.attributes[name]);
        }
        for (let i = 0; i < Math.max(newNode.children.length, oldNode.children.length); ++i) {
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
export function h(nodeName, attributes, ...children) {
    attributes = attributes || {};
    return {nodeName, attributes, children};
}
