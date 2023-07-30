define(function (require) {
    var parser = require('./parser');
    const questionL = parser.getBundle().assessments.question;
    var SCO = require('./sco');

    require('common/appEvents').attachEvents();
    require('select2');
    require('ui/jquery.plugins/spinner');
    require('ui/jquery.plugins/mousewheel');
    require('jquery-ui/ui/widgets/autocomplete');

    class Scorm extends EventEmitter {
        constructor({ url }) {
            super();

            this.url = url;
        }
    }

    return Scorm;
});
