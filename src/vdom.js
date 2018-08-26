/**
 * Set an attribute or add an event
 * to an element
 *
 * @param {Element} element
 * @param {String} name
 * @param {String|Number|Boolean|Function} value
 * @api private
 */
function setAttribute(element, name, value) {
    if (name[0] === 'o' && name[1] === 'n') {
        return element.addEventListener(name.slice(2).toLowerCase(), value);
    }
    element.setAttribute(name, value);
}

/**
 * Remove an attribute or event from
 * an element
 *
 * @param {Element} element
 * @param {String} name
 * @param {Function} value
 * @api private
 */
function removeAttribute(element, name, value) {
    if (name[0] === 'o' && name[1] === 'n') {
        return element.removeEventListener(name.slice(2).toLowerCase(), value);
    }
    element.removeAttribute(name);
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
    Object.keys(attributes).forEach((name) => setAttribute(element, name, attributes[name]));
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
            const newVal = newNode.attributes[name], oldVal = oldNode.attributes[name];
            if (newVal == null || newVal === false) {
                removeAttribute(element, name, oldVal);
            } else if (!oldVal || newVal !== oldVal) {
                setAttribute(element, name, newVal);
            }
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
