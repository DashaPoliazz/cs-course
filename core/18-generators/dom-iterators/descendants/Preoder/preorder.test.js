const { it, describe } = require("node:test");
const assert = require("node:assert");
const PreorderIterator = require("./iteratorApproach.js");
const PreorderGenerator = require("./generatorApproach.js");
const { JSDOM } = require("jsdom");

it("should traverse inorder correcrly", () => {
  const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Mock JSDOM</title>
          </head>
          <body>
		  	<div id="div1">
				<div id="div1.1">
					<div id="div1.1.1"></div>
					<div id="div1.1.2"></div>
				</div>
				<div id="div1.2">
					<div id="div1.2.1">
						<div id="div1.2.1.1"></div>
					</div>
				</div>
		  	</div>
			<div id="div2"></div>
          </body>
        </html>
      `);

  const { document } = dom.window;
  const body = document.getElementsByTagName("body")[0];
  const iter = PreorderIterator.new(body);
  const gen = PreorderGenerator.new(body);
  assert.deepEqual(
    [...iter].map((n) => n.id),
    [
      "div1",
      "div1.1",
      "div1.1.1",
      "div1.1.2",
      "div1.2",
      "div1.2.1",
      "div1.2.1.1",
      "div2",
    ],
  );
  assert.deepEqual(
    [...gen].map((n) => n.id),
    [
      "div1",
      "div1.1",
      "div1.1.1",
      "div1.1.2",
      "div1.2",
      "div1.2.1",
      "div1.2.1.1",
      "div2",
    ],
  );
});

it("should traverse empty treee inorder correcrly", () => {
  const dom = new JSDOM(`
		  <!DOCTYPE html>
		  <html>
			<head>
			  <title>Mock JSDOM</title>
			</head>
			<body>
			</body>
		  </html>
		`);

  const { document } = dom.window;
  const body = document.getElementsByTagName("body")[0];
  const iter = PreorderIterator.new(body);
  assert.deepEqual(
    [...iter].map((n) => n.id),
    [],
  );
  const gen = PreorderGenerator.new(body);
  assert.deepEqual(
    [...iter].map((n) => n.id),
    [],
  );
});
