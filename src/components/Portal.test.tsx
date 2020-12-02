import { mount } from 'enzyme'
import React from 'react'

import Portal from './Portal'

describe('Portal', () => {
    it('Renders to and creates div#modal by default', () => {
        expect(document.body.childElementCount).toEqual(0)

        mount(<Portal>test</Portal>)
        const modalContainer = document.getElementById('modal')!

        expect(modalContainer.innerHTML).toEqual('test')
        expect(document.body.childElementCount).toEqual(1)
    })

    it('Renders to pre-existing div#modal by default', () => {
        document.body.innerHTML = '<div id="modal"></div>'
        expect(document.body.childElementCount).toEqual(1)

        mount(<Portal>test</Portal>)
        const modalContainer = document.getElementById('modal')!

        expect(modalContainer.innerHTML).toEqual('test')
        expect(document.body.childElementCount).toEqual(1)
    })

    it('Renders to and creates div with supplied id', () => {
        document.body.innerHTML = '<div id="foo"></div>'
        expect(document.body.childElementCount).toEqual(1)

        mount(<Portal target="bar">test</Portal>)
        const modalContainer = document.getElementById('bar')!

        expect(modalContainer.innerHTML).toEqual('test')
        expect(document.body.childElementCount).toEqual(2)

        const otherContainer = document.getElementById('foo')!
        expect(otherContainer.innerHTML).toEqual('')
    })

    it('Renders to pre-existing div with supplied id', () => {
        document.body.innerHTML = '<div id="foo"></div><div id="bar"></div>'
        expect(document.body.childElementCount).toEqual(2)

        mount(<Portal target="foo">test</Portal>)
        const modalContainer = document.getElementById('foo')!

        expect(modalContainer.innerHTML).toEqual('test')
        expect(document.body.childElementCount).toEqual(2)

        const otherContainer = document.getElementById('bar')!
        expect(otherContainer.innerHTML).toEqual('')
    })
})
