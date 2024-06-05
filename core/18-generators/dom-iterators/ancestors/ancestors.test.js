const assert = require("assert");
const { it, describe } = require("node:test");
const { JSDOM } = require("jsdom");
const iterattiveApproach = require("./iteratorApproach.js");
const generatorApproach = require("./generatorApproach.js");

describe("ancestors", () => {
  it("should yield all ancestors correctly", () => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mock JSDOM</title>
        </head>
        <body>
          <div id="ancestor">
            <div id="parent">
              <div id="child">Child Element</div>
            </div>
          </div>
        </body>
      </html>
    `);
    const { document } = dom.window;

    const childElement = document.getElementById("child");
    const generatorAncestors = generatorApproach(childElement);
    const iteratrivaAncestors = iterattiveApproach(childElement);

    const expectedAncestorsIds = ["parent", "ancestor"];

    const generatorAncestorsIds = [...generatorAncestors].map(
      (node) => node.id,
    );
    const iterativeAncestorsIds = [...iteratrivaAncestors].map(
      (node) => node.id,
    );

    console.log(expectedAncestorsIds, iterativeAncestorsIds);
    assert.deepStrictEqual(
      generatorAncestorsIds,
      expectedAncestorsIds,

      "Ancestors should be yielded correctly",
    );

    assert.deepStrictEqual(
      iterativeAncestorsIds,
      expectedAncestorsIds,

      "Ancestors should be yielded correctly",
    );
  });

  it("should stop iteration when reaching the root node", () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Mock JSDOM</title>
          </head>
          <body>
            <div id="root">
              <div id="parent">
                <div id="child">Child Element</div>
              </div>
            </div>
          </body>
        </html>
      `);
    const { document } = dom.window;

    const rootElement = document.getElementById("root");
    const generatorAncestors = generatorApproach(rootElement);

    const result = [...generatorAncestors];

    assert.strictEqual(
      result.length,
      0,
      "Iterator should stop when reaching the root node",
    );
  });
});
