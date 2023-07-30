import normal from "./normal";
import __ChainedItem from "./item";
import __chained from "./dataModels/adl";
import __parser from "./parser";
import normal2 from "./normal/normal";
const ChainedItem = __ChainedItem.item;
const chained = __chained.getSomething().something.another;
const parser = __parser
  .init()
  .filter((arg) => arg === 1)
  .lol.wut("hello", normal).omg.nothing.changed;

class Something extends Anything {
  constructor({ url }) {
    super();

    this.url = url;
  }
}

const something = [1, 2, 3, 4];
export default {
  Something,
  something,
  parser,
  chained,
  ChainedItem,
};