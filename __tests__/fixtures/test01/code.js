define(function (require) {
  var parser = require('./parser');
  var SCO = require('./sco');
  var cmi = require('./dataModels/cmi');
  var adl = require('./dataModels/adl');
  var Item = require('./item');

  var EventEmitter = require('common/eventEmitter');
  var BackendStore = require('./stores/backend');

  const a = 1;
  const b = 2;
  const c = 3;

  const func = () => {
    const lol = 'wut'

    return lol + 'hello'
  }

  return [a, b, c, func];
});
