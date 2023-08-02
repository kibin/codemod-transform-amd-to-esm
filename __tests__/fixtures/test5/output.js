import parser from "./parser";
import SCO from "./sco";
import __appConfig from "./appConfig";
import { meat, wood } from "winter-things";
import __somewhereThere from "somewhere/there";
import __i18n from "i18n";
import __wow from "wow";
import Bundle, { Hello } from "some-bundle";
const { PUSHSTREAM_PORT, PUSHSTREAM_MODE } = __appConfig;
const { one, two } = __somewhereThere.object.method().three;
const i18n = __i18n.getBundle();
const { something, another } = __wow.lol();

class Scorm extends EventEmitter {
  constructor({ url }) {
    super();

    this.url = url;
  }
}
export default Scorm;