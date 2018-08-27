/* eslint-disable max-len */

import { h, patch } from '../../src/vdom';

describe('vdom', () => {
    const container = document.createElement('div');

    function compack(html) {
        return html.replace(/\s{2,}/g, '');
    }

    function setHTML(html) {
        container.innerHTML = compack(html);
    }

    function expectHTML(html) {
        expect(container.innerHTML).to.equal(compack(html));
    }

    afterEach(() => {
        container.innerHTML = '';
    });

    it('should patch an empty container', () => {
        patch(container,
            h('div')
        );

        expectHTML('<div></div>');
    });

    it('should patch a text node', () => {
        setHTML('foo');

        patch(container,
            'bar',
            'foo'
        );

        expectHTML('bar');
    });

    it('should patch an element', () => {
        setHTML('<span></span>');

        patch(container,
            h('div'),
            h('span')
        );

        expectHTML('<div></div>');
    });

    it('should add an attribute', () => {
        setHTML('<div></div>');

        patch(container,
            h('div', {id: 'foo'}),
            h('div')
        );

        expectHTML('<div id="foo"></div>');
    });

    it('should remove an attribute', () => {
        setHTML('<div foo="bar"></div>');

        patch(container,
            h('div'),
            h('div', {foo: 'bar'})
        );

        expectHTML('<div></div>');
    });

    it('should update an attribute', () => {
        setHTML('<div foo="bar"></div>');

        patch(container,
            h('div', {foo: 'baz'}),
            h('div', {foo: 'bar'})
        );

        expectHTML('<div foo="baz"></div>');
    });

    it('should add class names', () => {
        patch(container,
            h('div', {class: 'foo bar'})
        );

        expectHTML('<div class="foo bar"></div>');
    });

    it('should update class names', () => {
        setHTML('<div class="foo bar"></div>');

        patch(container,
            h('div', {class: 'bar baz'}),
            h('div', {class: 'foo bar'})
        );

        expectHTML('<div class="bar baz"></div>');
    });

    it('should add CSS styles', () => {
        patch(container,
            h('div', {style: 'width: 100px; background-color: #222222'})
        );

        expectHTML('<div style="width: 100px; background-color: #222222"></div>');
    });

    it('should update CSS styles', () => {
        setHTML('<div style="width: 100px; background-color: #222222"></div>');

        patch(container,
            h('div', {style: 'height: 100px; background-color: #111111'}),
            h('div', {style: 'width: 100px; background-color: #222222'})
        );

        expectHTML('<div style="height: 100px; background-color: #111111"></div>');
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
        setHTML('<div foo="1" bar="2" baz="3"></div>');

        patch(container,
            h('div', {foo: void 0, bar: null, baz: false}),
            h('div', {foo: 1, bar: 2, baz: 3})
        );

        expectHTML('<div></div>');
    });

    it('should patch a deeply nested text node', () => {
        setHTML(`
            <section>
                <div>
                    <span>foo</span>
                </div>
            </section>
        `);

        patch(container,
            h('section', null,
                h('div', null,
                    h('span', null, 'bar')
                )
            ),
            h('section', null,
                h('div', null,
                    h('span', null, 'foo')
                )
            )
        );

        expectHTML(`
            <section>
                <div>
                    <span>bar</span>
                </div>
            </section>
        `);
    });

    it('should patch a deeply nested element', () => {
        setHTML(`
            <section>
                <div>
                    <span>
                        <i></i>
                    </span>
                </div>
            </section>
        `);

        patch(container,
            h('section', null,
                h('div', null,
                    h('span', null, 
                        h('em')
                    )
                )
            ),
            h('section', null,
                h('div', null,
                    h('span', null, 
                        h('i')
                    )
                )
            )
        );

        expectHTML(`
            <section>
                <div>
                    <span>
                        <em></em>
                    </span>
                </div>
            </section>
        `);
    });

    it('should patch deeply nested attributes', () => {
        setHTML(`
            <section>
                <div>
                    <span foo="1" bar="2"></span>
                </div>
            </section>
        `);

        patch(container,
            h('section', null,
                h('div', null,
                    h('span', {foo: 2, baz: 3})
                )
            ),
            h('section', null,
                h('div', null,
                    h('span', {foo: 1, bar: 2})
                )
            )
        );

        expectHTML(`
            <section>
                <div>
                    <span foo="2" baz="3"></span>
                </div>
            </section>
        `);
    });
});
