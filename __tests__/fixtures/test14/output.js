export default (function (file) {
  const dataUrlDef = $.Deferred();
  const reader = new FileReader();
  reader.onload = (e) => dataUrlDef.resolve(e.target.result);
  reader.readAsDataURL(file);
  return dataUrlDef;
});
