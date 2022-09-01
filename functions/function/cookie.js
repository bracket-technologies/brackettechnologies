const setCookie = ({ _window, name = "", value, expiry = 360 }) => {

  var d = new Date()
  d.setTime(d.getTime() + (expiry*24*60*60*1000))
  var expires = "expires="+ d.toUTCString()

  document.cookie = name + "=" + value + ";" + expires + ";path=/"
}

const getCookie = ({ name, req }) => {
  
  var cookie = req ? req.headers.cookie : document ? document.cookie : ""
  if (!name || !cookie) return cookie
  name = name + "="
  
  var decodedCookie = decodeURIComponent(cookie)
  var ca = decodedCookie.split(';')
  cookie = ""

  for (var i = 0; i <ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) cookie = c.substring(name.length, c.length)
  }
  
  return cookie
}

const eraseCookie = ({ _window, name }) => {
  document.cookie = name +'=; Max-Age=-99999999;'  
}

module.exports = {setCookie, getCookie, eraseCookie}