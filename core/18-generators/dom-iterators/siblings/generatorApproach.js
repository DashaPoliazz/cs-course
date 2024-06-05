"use strict";

function* siblings(domNode) {
  const parent = domNode.parentNode;
  if (!parent) return;
  const children = Array.from(parent.children);
  yield* children.filter((child) => child !== domNode);
}

module.exports = siblings;
