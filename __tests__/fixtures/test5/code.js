define(function (require) {
    var parser = require('./parser');
    var SCO = require('./sco');
    const { PUSHSTREAM_PORT, PUSHSTREAM_MODE } = require('./appConfig');
    const { meat, wood } = require('winter-things');
    const { one, two } = require('somewhere/there').object.method().three;
    const i18n = require('i18n').getBundle();
    const { something, another } = require('wow').lol();
    const { Hello, default: Bundle } = require('some-bundle');

    class Scorm extends EventEmitter {
        constructor({ url }) {
            super();

            this.url = url;
        }
    }

    return Scorm;
});
