function once(eventTarget, eventName) {
  const queue = [];
  let triggered = false;

  const handler = (event) => {
    if (queue.length > 0) {
      const resolve = queue.shift();
      if (triggered) return void resolve({ done: true, value: undefined });
      const iteratorResult = { done: false, value: event };
      resolve(iteratorResult);
      triggered = true;
    }
  };

  // once: true needless here ?
  eventTarget.addEventListener(eventName, handler, { once: true });

  return {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          if (triggered) {
            return { done: true, value: undefined };
          }

          return new Promise((resolve) => {
            queue.push(resolve);
          });
        },
      };
    },
  };
}

export default once;
