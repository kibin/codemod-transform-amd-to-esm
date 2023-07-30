define(function (require) {
    var parser = require('./parser');
    var SCO = require('./sco');
    const { PUSHSTREAM_PORT, PUSHSTREAM_MODE } = require('appConfig');
    const { one, two } = require('somewhere/there').object.method().three;

    class Scorm extends EventEmitter {
        constructor({ url }) {
            super();

            this.url = url;
        }
    }

    return Scorm;
});
