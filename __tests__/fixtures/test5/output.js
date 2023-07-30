import parser from "./parser";
import SCO from "./sco";
import { PUSHSTREAM_PORT, PUSHSTREAM_MODE } from "appConfig";

class Scorm extends EventEmitter {
  constructor({ url }) {
    super();

    this.url = url;
  }
}
export default Scorm;