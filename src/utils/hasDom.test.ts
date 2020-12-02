import { hasDom } from './hasDom'

describe('hasDom', () => {
    it('Returns true in browser environment', () => {
        expect(hasDom()).toEqual(true)
    })

    it('Returns false without window.document', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        delete (window as Writeable<Window>).document
        expect(hasDom()).toEqual(false)
    })
})
