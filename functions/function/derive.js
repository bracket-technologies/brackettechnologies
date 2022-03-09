const derive = (data, keys, defaultData, editable) => {
  if (!Array.isArray(keys)) keys = keys.split(".");

  data = keys.reduce((o, k, i) => {
    // path doesnot exist => create path
    if (editable && typeof o[k] !== "object") {
      if (i < keys.length - 1) {
        if (!isNaN(keys[i + 1])) o[k] = [];
        else o[k] = {};
      } else if (i === keys.length - 1) {
        if (defaultData !== undefined) o[k] = defaultData;
        else if (Array.isArray(o) && isNaN(k)) {
          if (o.length === 0) {
            o.push({});
            keys.splice(i, 0, 0);
          }
        }
      }
    }

    if (o === undefined) return undefined;

    return o[k];
  }, data);

  return [data, keys];
};

module.exports = {derive};
