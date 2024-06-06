const { it, describe } = require("node:test");
const assert = require("node:assert");
const Preorder = require("./Preorder.js");
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
  const iter = Preorder.new(body);
  console.log([...iter].map((n) => n.id));
  //   assert.deepEqual(
  //     [...iter].map((n) => n.id),
  //     [
  //       "div1",
  //       "div1.1",
  //       "div1.1.1",
  //       "div1.1.2",
  //       "div1.2",
  //       "div1.2.1",
  //       "div1.2.1.1",
  //       "div2",
  //     ],
  //   );
});
