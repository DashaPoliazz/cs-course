"use strict";

const { JSDOM } = require("jsdom");

// Create a new JSDOM instance with some initial HTML content
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Mock JSDOM</title>
    </head>
    <body>
      <h1>Hello, JSDOM!</h1>
      <p>This is a mock DOM environment.</p>
    </body>
  </html>
`);

// Access the document and window objects
const { document } = dom.window;

// Print the entire HTML
console.log(dom.serialize());

const needle = document.getElementsByTagName("body");
console.log("body", Array.from(needle[0].children));
