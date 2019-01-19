import { ariaHidden } from "./ariaHidden";

describe("ariaHidden: { on: (id: string) => void, off: (id: string => void) }", () => {
  let root: any;

  beforeAll(() => {
    root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
  });

  it("Sets the attribute aria-hidden on/off for specified dom element", () => {
    expect(root.getAttribute("aria-hidden")).toEqual(null);

    ariaHidden.on("root");
    expect(root.getAttribute("aria-hidden")).toEqual("true");

    ariaHidden.off("root");
    expect(root.getAttribute("aria-hidden")).toEqual(null);
  });
});
