function on(eventTarget, eventName) {
  const queue = [];
  const handler = (event) => {
    console.log(event.type);

    if (queue.length > 0) {
      const resolve = queue.shift();
      const iteratorResult = { done: false, value: event };
      resolve(iteratorResult);
    }
  };

  eventTarget.addEventListener(eventName, handler);

  return {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          return new Promise((resolve) => {
            queue.push(resolve);
          });
        },
      };
    },
  };
}

export default on;
