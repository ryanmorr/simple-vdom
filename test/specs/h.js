/* eslint-disable max-len */

import { h } from '../../src/vdom';

describe('h', () => {
    it('should be defined and callable', () => {
        expect(h).to.be.a('function');
    });

    it('should create a virtual element', () => {
        expect(h('div')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: []
        });
    });

    it('should create a virtual element with attributes', () => {
        expect(h('div', {id: 'foo', class: 'bar'})).to.deep.equal({
            nodeName: 'div',
            attributes: {id: 'foo', class: 'bar'},
            children: []
        });
    });

    it('should create a virtual element with a single text child', () => {
        expect(h('div', null, 'foo')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: ['foo']
        });
    });

    it('should create a virtual element with a single element child', () => {
        expect(h('div', null, h('span'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [{
                nodeName: 'span',
                attributes: {},
                children: []
            }]
        });
    });

    it('should create a virtual element with multiple children', () => {
        expect(h('div', null, h('i'), 'foo', h('em'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [
                {nodeName: 'i', attributes: {}, children: []},
                'foo',
                {nodeName: 'em', attributes: {}, children: []}
            ]
        });
    });

    it('should support JSX', () => {
        const title = 'Hello World';

        expect((
            <div>
                <h1>{title}</h1>
                <section class="content"></section>
            </div>
        )).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [
                {nodeName: 'h1', attributes: {}, children: ['Hello World']},
                {nodeName: 'section', attributes: {class: 'content'}, children: []}
            ]
        });
    });
});
