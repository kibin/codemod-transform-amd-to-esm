import normal from "./normal";
import _ChainedItem from "./item";
import _chained from "./dataModels/adl";
import _parser from "./parser";
import normal2 from "./normal/normal";
const ChainedItem = _ChainedItem.item;
const chained = _chained.getSomething().something.another;
const parser = _parser
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