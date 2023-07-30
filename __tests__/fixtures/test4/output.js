import parser from "./parser";
import SCO from "./sco";
import __appEvents from "common/appEvents";
import "select2";
import "ui/jquery.plugins/spinner";
import "ui/jquery.plugins/mousewheel";
import "jquery-ui/ui/widgets/autocomplete";
__appEvents.attachEvents();

class Scorm extends EventEmitter {
  constructor({ url }) {
    super();

    this.url = url;
  }
}
export default Scorm;