import repeat from "./iterables/repeat.js";
import filter from "./iterables/filter.js";
import seq from "./iterables/seq.js";
import once from "./iterables/once.js";
import every from "./iterables/every.js";
import on from "./iterables/on.js";
import any from "./iterables/any.js";
import take from "./iterables/take.js";

function forEach(asyncIterable, cb) {
  (async () => {
    for await (const item of asyncIterable) {
      cb(item);
    }
  })();
}

// Elements:
const box = document.getElementById("mybox");

const onlyEvent = (eventName) => (data) => {
  return data.eventName === eventName;
};

const dnd = repeat(
  filter(
    seq(
      once(box, "mousedown"),

      every(
        any(on(document.body, "mousemove"), on(box, "mouseup")),

        onlyEvent("mousemove"),
      ),
    ),

    onlyEvent("mousemove"),
  ),
);

// const dnd = any(on(document.body, "mousemove"), on(box, "mouseup"));
// const dnd = on(box, "mousemove");
forEach(dnd, (e) => {
  console.log(e);
});

// DND logic
