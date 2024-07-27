const setCookie = ({ name = "", value, expiry = 360 }) => {

  var cookie = document.cookie || "", host = window.global.manifest.host
  var decodedCookie = decodeURIComponent(cookie)
  var hostSession = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === host) || "").split("=").slice(1).join("=") || "{}")

  hostSession[name] = value
  document.cookie = `${host}=${JSON.stringify(hostSession)};path=/`
}

const getCookie = ({ name, req } = {}) => {
  
  if (req) {
    if (!name) return req.cookies
    return req.cookies[name]
  }

  var host = window.global.manifest.host
  var cookie = document.cookie || ""
  var decodedCookie = decodeURIComponent(cookie)
  var hostSession = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === host) || "").split("=").slice(1).join("=") || "{}")

  if (!name) return hostSession
  return hostSession[name]
}

const eraseCookie = ({ name }) => {

  var host = window.global.manifest.host
  var cookie = document.cookie || ""
  var decodedCookie = decodeURIComponent(cookie)
  var hostSession = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === host) || "").split("=").slice(1).join("=") || "{}")
  
  delete hostSession[name]

  document.cookie = `${host}=${JSON.stringify(hostSession)};path=/`
}

function parseCookies (request, host) {

  const list = {};
  const cookieHeader = request.headers?.cookie;
  
  if (!cookieHeader) return request.cookies = list;

  cookieHeader.split(`;`).forEach(function(cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  request.cookies = request.headers.cookie = JSON.parse(list[host] || "{}")
}

module.exports = {setCookie, getCookie, eraseCookie, parseCookies}