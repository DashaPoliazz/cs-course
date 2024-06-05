"use strict";

const BODY_TAG_NAME = "BODY";

function* ancestors(domNode) {
  let parent = domNode.parentNode;
  while (parent && parent.tagName !== BODY_TAG_NAME) {
    yield parent;
    parent = parent.parentNode;
  }
}

module.exports = ancestors;
