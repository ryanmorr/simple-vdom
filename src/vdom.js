/**
 * Determine if the type of a vnode
 * has changed
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 * @api private
 */
function hasChanged(a, b) {
    return typeof a !== typeof b || typeof a === 'string' && a !== b || a.nodeName !== b.nodeName;
}

/**
 * Set an attribute or add an event
 * to an element
 *
 * @param {Element} element
 * @param {String} name
 * @param {String|Number|Boolean|Array|Object|Function} value
 * @api private
 */
function setAttribute(element, name, value) {
    if (value == null || value === false) {
        return false;
    }
    if (name === 'class') {
        if (Array.isArray(value)) {
            value = value.join(' ');
        }
        element.className = value;
    } else if (name === 'style') {
        Object.keys(value).forEach((key) => {
            const style = value == null || value[key] == null ? '' : value[key];
            element.style[key] = style;
        });
    } else if (name[0] === 'o' && name[1] === 'n') {
        element.addEventListener(name.slice(2).toLowerCase(), value);
    } else {
        element.setAttribute(name, value);
    }
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
        element.removeEventListener(name.slice(2).toLowerCase(), value);
        return;
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
    const type = typeof vnode;
    if (type === 'string' || type === 'boolean' || type === 'number') {
        return document.createTextNode(vnode);
    }
    const element = document.createElement(vnode.nodeName);
    const attributes = vnode.attributes;
    Object.keys(attributes).forEach((name) => setAttribute(element, name, attributes[name]));
    vnode.children.map(createElement).forEach((node) => element.appendChild(node));
    return element;
}

/**
 * Recursively patch a DOM element so that
 * it matches the updated virtual tree
 *
 * @param {Element} parent
 * @param {Object} patches
 * @param {Number} index (optional)
 * @api public
 */
export function patch(parent, newNode, oldNode, index = 0) {
    const el = parent.childNodes[index];
    const type = typeof newNode;
    if (type === 'boolean' || type === 'number') {
        newNode = newNode.toString();
    }
    if (!oldNode) {
        const newEl = createElement(newNode);
        return parent.appendChild(newEl);
    }
    if (!newNode) {
        return parent.removeChild(el);
    }
    if (hasChanged(newNode, oldNode)) {
        const newEl = createElement(newNode);
        return parent.replaceChild(newEl, el);
    }
    if (newNode.nodeName) {
        const attributes = Object.assign({}, newNode.attributes, oldNode.attributes);
        Object.keys(attributes).forEach((name) => {
            const newVal = newNode.attributes[name];
            const oldVal = oldNode.attributes[name];
            if (newVal == null || newVal === false) {
                removeAttribute(el, name, oldVal);
            } else if (!oldVal || newVal !== oldVal) {
                setAttribute(el, name, newVal);
            }
        });
        const length = Math.max(newNode.children.length, oldNode.children.length);
        for (let i = 0; i < length; ++i) {
            patch(el, newNode.children[i], oldNode.children[i], i);
        }
    }
}

/**
 * JSX-compatible virtual DOM builder
 *
 * @param {String|Function} nodeName
 * @param {Object|Null} attributes (optional)
 * @param {...String|Number|Boolean|Object} children (optional)
 * @return {Object}
 * @api public
 */
export function h(nodeName, attributes, ...children) {
    attributes = attributes || {};
    return {nodeName, attributes, children};
}
