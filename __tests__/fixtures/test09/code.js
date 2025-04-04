const more = require('./more');
const required = require('./required');
const content = require('./content').one.two('hello').three;
const L = require('i18n').getBundle()['40x'];

require('some-side-effects');
require('side-effects-factory').init();

define(function (require) {
  var EventEmitter = require('common/eventEmitter');
  var BackendStore = require('./stores/backend');
  const ReactSlider = require('react-slick').default;

  return [EventEmitter, BackendStore, more, required, content];
});
