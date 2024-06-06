class Preorder {
  constructor(domNode) {
    this.domNode = domNode;
  }

  static new(domNode) {
    return new Preorder(domNode);
  }

  *[Symbol.iterator](domNode = this.domNode) {
    // Don't yield the node we start iterating
    if (this.domNode !== domNode) yield domNode;
    const children = Array.from(domNode.children);
    for (const child of children) {
      yield* this[Symbol.iterator](child);
    }
  }
}

module.exports = Preorder;
