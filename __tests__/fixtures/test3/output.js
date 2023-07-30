import normal from "./normal";
import __item from "./item";
import __dataModelsAdl from "./dataModels/adl";
import __parser from "./parser";
import normal2 from "./normal/normal";
import __i18n from "i18n";
const ChainedItem = __item.item;
const chained = __dataModelsAdl.getSomething().something.another;
const parser = __parser
  .init()
  .filter((arg) => arg === 1)
  .lol.wut("hello", normal).omg.nothing.changed;
const L = __i18n.getBundle().common.license;

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