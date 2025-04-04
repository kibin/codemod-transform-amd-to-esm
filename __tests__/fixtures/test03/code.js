define(function (require) {
  var normal = require('./normal');
  var ChainedItem = require('./item').item;
  var chained = require('./dataModels/adl').getSomething().something.another;
  var parser = require('./parser').init().filter((arg) => arg === 1).lol.wut('hello', normal).omg.nothing.changed;
  var normal2 = require('./normal/normal');
  const L = require('i18n').getBundle().common.license;

  class Something extends Anything {
    constructor({ url }) {
      super();

      this.url = url;
    }
  }

  const something = [1, 2, 3, 4]

  return {
    Something,
    something,
    parser,
    chained,
    ChainedItem,
  };
});
