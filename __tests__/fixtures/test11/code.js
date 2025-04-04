define([], () =>
  function (clazz) {
    return {
      initialize() {
        this.on("add", model => {
          if (model.id == null) { return model.set("id", this._getNextId()); }
        });
        return clazz.prototype.initialize.apply(this, arguments);
      },

      _getNextId() {
        for (let ix = 0, end = this.length, asc = 0 <= end; asc ? ix < end : ix > end; asc ? ix++ : ix--) {
          if (!this.get(ix)) { return ix; }
        }
        return this.length;
      }
    };
  });

