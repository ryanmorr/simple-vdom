/* eslint-disable max-len */

import { h, patch } from '../../src/vdom';

describe('vdom', () => {
    const container = document.createElement('div');

    afterEach(() => {
        container.innerHTML = '';
    });

    it('should patch an empty container', () => {
        patch(container,
            h('div')
        );

        expect(container.innerHTML).to.equal('<div></div>');
    });

    it('should patch a text node', () => {
        container.innerHTML = 'foo';

        patch(container,
            'bar',
            'foo'
        );

        expect(container.innerHTML).to.equal('bar');
    });

    it('should patch an element', () => {
        container.innerHTML = '<span></span>';

        patch(container,
            h('div'),
            h('span')
        );

        expect(container.innerHTML).to.equal('<div></div>');
    });

    it('should add an attribute', () => {
        container.innerHTML = '<div></div>';

        patch(container,
            h('div', {id: 'foo'}),
            h('div')
        );

        expect(container.innerHTML).to.equal('<div id="foo"></div>');
    });

    it('should remove an attribute', () => {
        container.innerHTML = '<div foo="bar"></div>';

        patch(container,
            h('div'),
            h('div', {foo: 'bar'})
        );

        expect(container.innerHTML).to.equal('<div></div>');
    });

    it('should update an attribute', () => {
        container.innerHTML = '<div foo="bar"></div>';

        patch(container,
            h('div', {foo: 'baz'}),
            h('div', {foo: 'bar'})
        );

        expect(container.innerHTML).to.equal('<div foo="baz"></div>');
    });

    it('should add class names', () => {
        patch(container,
            h('div', {class: 'foo bar'})
        );

        expect(container.innerHTML).to.equal('<div class="foo bar"></div>');
    });

    it('should update class names', () => {
        container.innerHTML = '<div class="foo bar"></div>';

        patch(container,
            h('div', {class: 'bar baz'}),
            h('div', {class: 'foo bar'})
        );

        expect(container.innerHTML).to.equal('<div class="bar baz"></div>');
    });

    it('should add CSS styles', () => {
        patch(container,
            h('div', {style: 'width: 100px; background-color: #222222'})
        );

        expect(container.innerHTML).to.equal('<div style="width: 100px; background-color: #222222"></div>');
    });

    it('should update CSS styles', () => {
        container.innerHTML = '<div style="width: 100px; background-color: #222222"></div>';

        patch(container,
            h('div', {style: 'height: 100px; background-color: #111111'}),
            h('div', {style: 'width: 100px; background-color: #222222'})
        );

        expect(container.innerHTML).to.equal('<div style="height: 100px; background-color: #111111"></div>');
    });

    it('should add an event listener', () => {
        const div = container.appendChild(document.createElement('div'));

        const callback = () => {};
        const addEventSpy = sinon.spy(div, 'addEventListener');

        patch(container,
            h('div', {onclick: callback}),
            h('div')
        );

        expect(addEventSpy.called).to.equal(true);
        expect(addEventSpy.calledWith('click', callback)).to.equal(true);
        addEventSpy.restore();
    });

    it('should remove an event listener', () => {
        const div = container.appendChild(document.createElement('div'));

        const callback = () => {};
        const removeEventSpy = sinon.spy(div, 'removeEventListener');

        patch(container,
            h('div', {onclick: callback}),
            h('div')
        );

        patch(container,
            h('div'),
            h('div', {onclick: callback})
        );

        expect(removeEventSpy.called).to.equal(true);
        expect(removeEventSpy.calledWith('click', callback)).to.equal(true);
        removeEventSpy.restore();
    });

    it('should remove an attribute if the value assigned is undefined, null, or false', () => {
        container.innerHTML = '<div foo="1" bar="2" baz="3"></div>';

        patch(container,
            h('div', {foo: void 0, bar: null, baz: false}),
            h('div', {foo: 1, bar: 2, baz: 3})
        );

        expect(container.innerHTML).to.equal('<div></div>');
    });
});
