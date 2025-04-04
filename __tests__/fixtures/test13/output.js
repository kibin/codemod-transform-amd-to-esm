export default (function (src) {
  const img = new window.Image();
  const sizeDef = $.Deferred();
  img.onload = () =>
    sizeDef.resolve({
      width: img.width,
      height: img.height,
    });
  img.onerror = (error) => sizeDef.reject(error);
  img.src = src;
  return sizeDef;
});
