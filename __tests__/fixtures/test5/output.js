import parser from "./parser";
import SCO from "./sco";
import { PUSHSTREAM_PORT, PUSHSTREAM_MODE } from "appConfig";
import __somewhereThere from "somewhere/there";
const { one, two } = __somewhereThere.object.method().three;

class Scorm extends EventEmitter {
  constructor({ url }) {
    super();

    this.url = url;
  }
}
export default Scorm;