const decode = ({ _window, string }) => {

  var global = _window ? _window.global : window.global
  if (typeof string !== "string") return string
  
  if (string.includes("coded()")) {

    string.split("coded()").map((state, i) => {

      if (i === 0) return string = state
      
      var code = state.slice(0, 5)
      var after = state.slice(5)
      var statement = global.codes[`coded()${code}`]

      statement = decode({ _window, string: statement })
      string += `[${statement}]` + after
    })
  }
  
  if (string.includes("codedS()")) {

    string.split("codedS()").map((state, i) => {

      if (i === 0) return string = state
      
      var code = state.slice(0, 5)
      var after = state.slice(5)
      var statement = global.codes[`codedS()${code}`]

      statement = decode({ _window, string: statement })
      string += `'${statement}'` + after
    })
  }

  return string
}

module.exports = {decode}
