import parser from "./parser";
import SCO from "./sco";
import cmi from "./dataModels/cmi";
import adl from "./dataModels/adl";
import Item from "./item";
import EventEmitter from "common/eventEmitter";
import BackendStore from "./stores/backend";

const a = 1;
const b = 2;
const c = 3;

const func = () => {
  const lol = "wut";

  return lol + "hello";
};
export default [a, b, c, func];
