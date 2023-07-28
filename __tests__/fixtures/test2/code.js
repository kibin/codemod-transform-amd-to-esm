define(function (require) {
    var parser = require('./parser');
    var SCO = require('./sco');
    var cmi = require('./dataModels/cmi');
    var adl = require('./dataModels/adl');
    var Item = require('./item');

    var EventEmitter = require('common/eventEmitter');
    var BackendStore = require('./stores/backend');

    class Scorm extends EventEmitter {
        constructor({ url }) {
            super();

            this.url = url;
        }
    }

    return Scorm;
});
