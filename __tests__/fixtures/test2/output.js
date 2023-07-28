import parser from "./parser";
import SCO from "./sco";
import cmi from "./dataModels/cmi";
import adl from "./dataModels/adl";
import Item from "./item";
import EventEmitter from "common/eventEmitter";
import BackendStore from "./stores/backend";

class Scorm extends EventEmitter {
  constructor({ url }) {
    super();

    this.url = url;
  }
}
export default Scorm;
