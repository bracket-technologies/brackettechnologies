module.exports = {
  toNumber: (string) => {
    
    if (!string) return string
    if (typeof string === 'number') return string
    if (!isNaN(string)) return parseFloat(string)
    else return parseFloat(string.match(/[\d\.]+/) || 0)
    
    if ((parseFloat(string) || parseFloat(string) === 0)  && (!isNaN(string.charAt(0)) || string.charAt(0) === '-')) {
      if (!isNaN(string.split(",").join(""))) {
        // is Price
        string = parseFloat(string.split(",").join(""));

      } else if (parseFloat(string).length === string.length) parseFloat(string)
    }

    return string
  },
};
