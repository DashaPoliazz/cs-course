const assert = require("node:assert");
const { it } = require("node:test");
const { JSDOM } = require("jsdom");
const generatorApproach = require("./generatorApproach.js");
const iteratorApproach = require("./iteratorApproach.js");

it("should yield all siblings correctly using generator approach", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mock JSDOM</title>
      </head>
      <body>
        <div id="ancestor">
          <div id="parent">
            <div id="sibling1">Sibling 1</div>
            <div id="target">Target Element</div>
            <div id="sibling2">Sibling 2</div>
          </div>
        </div>
      </body>
    </html>
  `);
  const { document } = dom.window;

  const target = document.getElementById("target");
  const generatorSiblings = generatorApproach(target);

  assert.deepEqual(
    [...generatorSiblings].map((s) => s.id),
    ["sibling1", "sibling2"],
    "Generator approach should yield all siblings correctly",
  );
});

it("should yield all siblings correctly using iterator approach", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mock JSDOM</title>
      </head>
      <body>
        <div id="ancestor">
          <div id="parent">
            <div id="sibling1">Sibling 1</div>
            <div id="target">Target Element</div>
            <div id="sibling2">Sibling 2</div>
          </div>
        </div>
      </body>
    </html>
  `);
  const { document } = dom.window;

  const target = document.getElementById("target");
  const iteratorSiblings = iteratorApproach(target);

  assert.deepEqual(
    [...iteratorSiblings].map((s) => s.id),
    ["sibling1", "sibling2"],
    "Iterator approach should yield all siblings correctly",
  );
});

it("should yield all siblings correctly if there is no children using generator approach", () => {
  const dom = new JSDOM(`
	  <!DOCTYPE html>
	  <html>
		<head>
		  <title>Mock JSDOM</title>
		</head>
		<body>
		  <div id="ancestor">
			<div id="parent">
			  <div id="target">Target Element</div>
			</div>
		  </div>
		</body>
	  </html>
	`);
  const { document } = dom.window;

  const target = document.getElementById("target");
  const generatorSiblings = generatorApproach(target);

  assert.deepEqual(
    [...generatorSiblings].map((s) => s.id),
    [],
    "Generator approach should yield no siblings when there are no siblings",
  );
});

it("should yield all siblings if there is no children correctly using iterator approach", () => {
  const dom = new JSDOM(`
	  <!DOCTYPE html>
	  <html>
		<head>
		  <title>Mock JSDOM</title>
		</head>
		<body>
		  <div id="ancestor">
			<div id="parent">
			  <div id="target">Target Element</div>
			</div>
		  </div>
		</body>
	  </html>
	`);
  const { document } = dom.window;

  const target = document.getElementById("target");
  const iteratorSiblings = iteratorApproach(target);

  assert.deepEqual(
    [...iteratorSiblings].map((s) => s.id),
    [],
    "Iterator approach should yield no siblings when there are no siblings",
  );
});
