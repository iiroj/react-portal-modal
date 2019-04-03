import { hasDom } from "./hasDom";

describe("hasDom: () => boolean", () => {
  it("Returns true in browser environment", () => {
    expect(hasDom()).toEqual(true);
  });

  it("Returns false without window.document", () => {
    delete (window as Writeable<Window>).document;
    expect(hasDom()).toEqual(false);
  });
});
