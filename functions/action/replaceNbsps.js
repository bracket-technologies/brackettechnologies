const replaceNbsps = (str) => {
    var re = new RegExp(String.fromCharCode(160), "g");
    return str.toString().replace(re, " ");
  }

  module.exports = { replaceNbsps }