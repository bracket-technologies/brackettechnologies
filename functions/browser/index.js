(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],3:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
const { starter } = require("../function/starter")
const { setElement } = require("../function/setElement")

window.value = JSON.parse(document.getElementById("value").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

var value = window.value
var global = window.global

value.document = document
value.document.element = document
value.body.element = document.body
value.window = { element: window }

// lunch arabic text
var _ar = document.createElement("P")
_ar.innerHTML = "مرحبا"
_ar.classList.add("ar")
_ar.style.position = "absolute"
_ar.style.top = "-1000px"
value.body.element.appendChild(_ar)

history.pushState(null, global.data.page[global.currentPage].title, global.path)

// clicked element
document.addEventListener('click', e => {

    global["clickedElement()"] = window.value[(e || window.event).target.id]
    global.clickedElement = (e || window.event).target
    
}, false)

// not auth
/*if (window.global.currentPage === "developer-editor") {
    var await = [`global().project-auth=().search.data.code;document().body.innerHTML=You are not authenticated!<<global().project-auth.isnot().${getCookie({ name: "project-auth" })}`]
    search({ search: { collection: "authentication", doc: global.data.project.id }, await, asyncer: "search", id: "body" })
}*/

// default global mode
global.mode = global["default-mode"] = global["default-mode"] || "Light"

setElement({ id: "public" })
var toReturn = setElement({ id: "root" })

setTimeout(() => {
    starter({ id: "public" })
    if (!toReturn) starter({ id: "root" })
}, 0)

Object.entries(window.value).map(([id, value]) => {
    if (value.status === "Loading") delete window.value[id]
})
},{"../function/setElement":99,"../function/starter":102}],6:[function(require,module,exports){
const { toComponent } = require("../function/toComponent")

module.exports = (component) => {

  component.hover = component.hover || {}
  component.style = component.style || {}
  component.hover.style = component.hover.style || {}
  component.style.after = component.style.after || {}
  
  component.icon = component.icon || {}
  component.icon.style = component.icon.style || {}
  component.icon.hover = component.icon.hover || {}
  component.icon.hover.style = component.icon.hover.style || {}
  component.icon.style.after = component.icon.style.after || {}
  
  component.text = component.text || {}
  component.text.style = component.text.style || {}
  component.text.hover = component.text.hover || {}
  component.text.hover.style = component.text.hover.style || {}
  component.text.style.after = component.text.style.after || {}

  component = toComponent(component)
  
  var { style, hover, icon, text, id } = component
  
  return {
    ...component,
    type: "View?class=flex-box;touchableOpacity",
    isButton: true,
    hover: {
      style: { border: "1px solid #0d6efd", ...style.after, ...hover.style }
    },
    style: {
      border: "1px solid #e0e0e0",
      borderRadius: ".75rem",
      padding: "0.75rem 1rem",
      margin: "0 0.4rem",
      cursor: "pointer",
      transition: "border 0.1s",
      ...style
    },
    children: [{
      type: `Icon?id=${id}-icon?const.${icon.name}`,
      ...icon,
      hover: {
        id,
        style: { color: "#0d6efd", ...icon.style.after, ...icon.hover.style },
      },
      style: {
        color: style.color || "#444",
        fontSize: style.fontSize || "1.4rem",
        margin: "0 0.4rem",
        transition: "color 0.1s",
        display: "flex",
        alignItems: "center",
        ...icon.style
      }
    }, {
      type: `Text?id=${id}-text;text=${text.text}?const.${text.text}`,
      ...text,
      hover: {
        id,
        style: { color: "#0d6efd", ...text.style.after, ...text.hover.style },
      },
      style: {
        color: style.color || "#444",
        fontSize: style.fontSize || "1.4rem",
        margin: "0 0.4rem",
        transition: "color 0.1s",
        ...text.style
      }
    }]
  }
}

},{"../function/toComponent":114}],7:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

  component = toComponent(component)
  var { check, style } = component
  check = check || {}

  return {
    ...component,
    "type": `View?class=flexbox pointer;style.height=2rem;style.width=2rem;style.borderRadius=.25rem;style.transition=.1s;style.backgroundColor=#fff;style.border=1px solid #ccc;click.style.backgroundColor=#2C6ECB;click.style.border=1px solid #ffffff00;click.sticky;${toString({ style })}`,
    "children": [{
      "type": `Icon?name=bi-check;style.color=#fff;style.fontSize=2rem;style.opacity=0;style.transition=.1s;${toString(check)}`
    }],
    "controls": [{
      "event": "click?().element.checked=if():[().element.checked]:false.else():true;().1stChild().element.style.opacity=[1].if().[().element.checked].else().[0];().data()=[true].if().[().element.checked].else().[false]"
    }]
  }
}

},{"../function/toComponent":114}],8:[function(require,module,exports){
const { generate } = require("../function/generate")
const { toComponent } = require("../function/toComponent")

module.exports = (component) => {

  if (component.templated) return component

  component = toComponent(component)
  var { text, style, sort, path, model } = component
  var id = component.id || generate()

  if (model === "classic") return component
  else if (model === "featured")
    return {
      ...component,
      type: "Header",
      id,
      style: {
        display: "flex",
        ...style,
      },
      children: [
        {
          type: "View?class=flex-box;style.position=relative;style.flexDirection=column",
          children: [
            {
              type: `Text?text=${text};id=${id}-text`,
              style: {
                width: "fit-content",
                fontSize: style.fontSize || "1.4rem",
                cursor: "pointer",
              },
              controls: [
                {
                  event: "click",
                  actions: [
                    // hide previous visible carrets
                    `setStyle?style.display=none?global().${sort.state}-sort!=${id}-caret?global().${sort.state}-sort`,
                    // show carrets
                    `setStyle?style.display=flex??${id}-caret`,
                    // sort
                    `sort;setState?data=global().${sort.state};id=${sort.id};path=${path};global().${sort.state}-sort=${id}-caret?const.${path}`,
                    // caret-up
                    `setStyle?style.display=flex?().sort=ascending?${id}-caret-up`,
                    `setStyle?style.display=none?().sort=descending?${id}-caret-up`,
                    // caret-down
                    `setStyle?style.display=none?().sort=ascending?${id}-caret-down`,
                    `setStyle?style.display=flex?().sort=descending?${id}-caret-down`,
                  ],
                },
              ],
            },
            {
              type: `View?id=${id}-caret;style.display=none;style.cursor=pointer?const.${path}`,
              children: [
                {
                  type: `Icon?id=${id}-caret-up;style.position=absolute;style.top=-1rem;style.left=calc(50% - 1rem);style.width=2rem;icon.name=bi-caret-up-fill`,
                },
                {
                  type: `Icon?id=${id}-caret-down;style.position=absolute;style.bottom=-1.1rem;style.left=calc(50% - 1rem);style.width=2rem;icon.name=bi-caret-down-fill`,
                }
              ]
            }
          ]
        }
      ]
    };
}

},{"../function/generate":68,"../function/toComponent":114}],9:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')
const { toString } = require('../function/toString')
const { override } = require('../function/merge')
const { clone } = require('../function/clone')

const Input = (component) => {

    if (component.templated) return component

    component.hover = component.hover || {}
    component.style = component.style || {}
    component.hover.style = component.hover.style || {}
    component.style.after = component.style.after || {}

    // container
    component.container = component.container || {}

    // icon
    component.icon = component.icon || {}
    component.icon.style = component.icon.style || {}
    component.icon.hover = component.icon.hover || {}
    component.icon.hover.style = component.icon.hover.style || {}
    component.icon.style.after = component.icon.style.after || {}

    // input
    component.input = component.input || {}
    component.input.hover = component.input.hover || {}
    component.input.type = component.password && "password" || component.input.type || 'text'
    component.input.style = component.input.style || {}
    component.input.hover.style = component.input.hover.style || {}
    component.input.style.after = component.input.style.after || {}

    // required
    if (component.required) component.required = typeof component.required === "object" ? component.required : {}
    
    component = toComponent(component)

    var { id, input, model, droplist, readonly, style, controls, icon, duplicated, duration, required,
        placeholder, textarea, filterable, clearable, removable, msg, day, disabled, label, password,
        duplicatable, lang, unit, currency, google, key, note, edit, minlength , children, container
    } = component
    
    if (duplicatable && typeof duplicatable !== "object") duplicatable = {}
    if (clearable && typeof clearable !== "object") clearable = {}

    readonly = readonly ? true : false
    removable = removable !== undefined ? (removable === false ? false : true) : false

    if (duplicatable) removable = true
    if (minlength === undefined) minlength = 1
    if (droplist) droplist.align = "left"
    
    // upload input styles
    var uploadInputStyle = input.type === 'file'
    ? {
        position: 'absolute',
        left: '0',
        top: '0',
        opacity: '0',
        cursor: 'pointer',
    } : {}
    
    var path = `${unit ? `path=amount` :  currency ? `path=${currency}` : duration ? `path=${duration}` : day ? `path=${day}` : lang ? `path=${lang}` : google ? `path=name` : key ? `path=${key}` : ''}`

    if (label && (label.location === "inside" || label.position === "inside")) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var password = component.password && true
        
        delete component.parent
        delete component.label
        delete component.path
        delete component.id
        delete component.password
        delete component.derivations

        label.text = label.text.split("?").join("_quest")
        label.text = label.text.split("=").join("_equal")

        return {
            id, path, Data, parent, derivations,
            "type": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=100%;${toString(container)}`,
            "children": [{
                "type": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
                "children": [{
                    "type": `Text?text=${label.text || "Label"};style.color=#888;style.fontSize=1.1rem;${toString(label)}`,
                    "controls": [{
                        "event": "click?().next().getInput().focus()"
                    }]
                }, Input({ ...component, component: true, parent: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
                ]
            }, {
                "type": `View?style.height=inherit;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative;${toString(password)}?${password}`,
                "children": [{
                    "type": `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?().parent().prev().getInput().element.type=text;().next().style().display=flex;().style().display=none"
                    }]
                }, {
                    "type": `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?().parent().prev().getInput().element.type=password;().prev().style().display=flex;().style().display=none"
                    }]
                }]
            }],
            "controls": [{
                "event": "click:body?().style().border.equal():[2px solid #008060]<<global().clickedElement.insideOrSame():[().element];().style().border.equal():[1px solid #ccc]<<global().clickedElement.outside():[().element]"
            }, {
                "event": "click?().getInput().focus()"
            }]
        }
    }
    
    if ((label && (label.location === "outside" || label.position === "outside")) || label) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var clicked = component.clicked || { style: {} }
        
        delete component.label
        delete component.path
        delete component.id
        
        label.text = label.text.split("?").join("_quest")
        label.text = label.text.split("=").join("_equal")

        return {
            id, Data, parent, derivations, required, path,
            "type": `View?class=flex start column;style.gap=.5rem;${toString(container)}`,
            "children": [{
                "type": `Text?text=${label.text || "Label"};style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${toString(label)}`,
                "controls": [{
                    "event": `click:body?().next().style().border.equal():${clicked.style.border || "2px solid #008060"}<<global().clickedElement.insideOrSame():[().element].or():[global().clickedElement.insideOrSame():[().next().element]];().next().style().border.equal():${style.border || "1px solid #ccc"}<<global().clickedElement.outside():[().element].and():[global().clickedElement.outside():[().next().element]]?!().parent().required.mount`
                }, {
                    "event": "click?global().clickedElement=().next().getInput().element;().next().getInput().focus()"
                }]
            }, 
                Input({ ...component, component: true, parent: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
            {
                "type": "View?class=flex start align-center gap-1;style.alignItems=center;style.display=none",
                "children": [{
                    "type": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
                }, {
                    "type": `Text?text=Input is required;style.color=#D72C0D;style.fontSize=1.4rem;${toString(required)}`
                }]
            }],
            "controls": [{
                "event": "click?().lastChild().style().display=if():[().required.mount]:flex.else():none;().2ndChild().style().backgroundColor=if():[().required.mount]:#FFF4F4.else():[().2ndChild().style.backgroundColor.else():[().2ndChild().style.backgroundColor].else():inherit];().2ndChild().style().border=if():[().required.mount]:[1px solid #d72c0d].else():[().2ndChild().clicked.style.border.else():[().2ndChild().style.border].else():1px solid #ccc]"
            }]
        }
    }
    
    if (model === 'featured' || password) {
        
        return {
            ...component,
            type: 'View',
            class: 'flex-box unselectable',
            // remove from comp
            controls: {},
            droplist: undefined,
            style: {
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                maxWidth: "100%",
                position: "relative",
                backgroundColor: "inherit",
                height: "fit-content",
                borderRadius: "0.25rem",
                overflow: "hidden",
                transition: ".1s",
                border: input.type === "file" ? "1px dashed #ccc" : "0",
                ...style,
            },
            children: [...children, {
                type: `Icon?id=${id}-icon?${icon.name}`,
                ...icon,
                hover: {
                    ...icon.hover,
                    style: {
                        ...icon.style.after,
                        ...icon.hover.style
                    }
                },
                style: {
                    fontSize: '1.6rem',
                    marginLeft: '1rem',
                    marginRight: '.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    ...icon.style
                }
            }, {
                type: `Text?id=${id}-msg;msg=${msg};text=${msg}?${msg}`,
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    fontSize: '1.3rem',
                    maxWidth: '95%',
                }
            }, {
                type: `Input`,
                id: `${id}-input`,
                path: component.path,
                class: `${input.class} ${component.class.includes("ar") ? "ar" : ""}`,
                input,
                currency, 
                day,
                unit,
                key,
                lang,
                google,
                duration,
                textarea,
                readonly,
                filterable,
                placeholder,
                duplicated,
                disabled,
                droplist,
                templated: true,
                'placeholder-ar': component['placeholer-ar'],
                hover: {
                    ...input.hover,
                    style: {
                        backgroundColor: style.after.backgroundColor,
                        color: style.after.color || style.color,
                        ...input.style.after,
                        ...input.hover.style
                    }
                },
                style: {
                    width: password ? "100%" : "fit-content",
                    height: 'fit-content',
                    borderRadius: style.borderRadius || '0.25rem',
                    backgroundColor: style.backgroundColor || 'inherit',
                    fontSize: style.fontSize || '1.4rem',
                    maxHeight: style.maxHeight || "initial",
                    border: '0',
                    height: "100%",
                    padding: "0.5rem",
                    color: '#444',
                    outline: 'none',
                    userSelect: password ? "none" : "initial",
                    ...uploadInputStyle,
                    ...input.style
                },
                controls: [...controls, {
                    event: `keyup??().data();e().key=Enter;${duplicatable}`,
                    actions: `duplicate:${id}?${duplicatable && duplicatable.path ? `duplicate.path=${duplicatable.path}` : ''}`
                }, {
                    event: "select;mousedown?e().preventDefault()"
                }, {
                    event: "input?().parent().parent().required.mount=false;().parent().parent().click()?().parent().parent().required.mount;e().target.value.exist()"
                }]
            }, {
                type: `View?style.height=100%;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative?[${password}]`,
                children: [{
                    type: `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?().parent().prev().element.type=text;().next().style().display=flex;().style().display=none"
                    }]
                }, {
                    type: `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?().parent().prev().element.type=password;().prev().style().display=flex;().style().display=none"
                    }]
                }]
            }, {
                type: `View?class=flex-box;style.alignSelf=flex-start;style.minWidth=fit-content;style.height=${style.height || '4rem'}?!().parent().password`,
                children: [{
                    type: `Icon?icon.name=bi-caret-down-fill;style.color=#444;style.fontSize=1.2rem;style.width=1rem;style.marginRight=.5rem?():${id}-input.droplist.items.isdefined()`
                }, {
                    type: `Icon?class=pointer;icon.name=bi-files;style.color=#444;style.fontSize=1.2rem;style.width=1rem;style.marginRight=.5rem;hoverable;style.after.color=#116dff?${duplicatable}`,
                    controls: {
                        event: `click??():${id}-input.data();[${duplicatable}]`,
                        actions: `duplicate:${id}?${duplicatable && duplicatable.path ? `duplicate.path=${duplicatable.path}` : "" }`
                    }
                }, {
                    type: `Text?text=${note};style.color=#666;style.fontSize=1.3rem;style.padding=.5rem?[${note}]`
                }, {
                    type: `Text?id=${id}-key;key=${key};text=${key};droplist.items<<!${readonly}=await()._array:[any.Enter a special key:._param.readonly]:[any.${key}._param.input];hoverable;duplicated=${duplicated}?${key}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    },
                }, {
                    type: `Text?id=${id}-currency;currency=${currency};text=${currency};droplist.items<<!${readonly}=await().global().asset.findByName():Currency.options.map():name;hoverable;duplicated=${duplicated}?${currency}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    },
                }, {
                    type: `Text?path=unit;id=${id}-unit;droplist.items<<!${readonly}=await().global().asset.findByName():Unit.options.map():name;hoverable?${unit}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    },
                    actions: `setData?data.value=${unit}?!().data()`
                }, {
                    type: `Text?id=${id}-day;day=${day || 'day'};text=${day};droplist.items<<!${readonly}=await()._array:Monday:Tuesday:Wednesday:Thursday:Friday:Saturday:Sunday;droplist.day;hoverable;duplicated=${duplicated}?${day}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    }
                }, {
                    type: `Text?id=${id}-duration;duration=${duration || 'hr'};text=${duration};droplist.items<<!${readonly}=_array:sec:min:hr:day:week:month:3month:year;droplist.duration;hoverable;duplicated=${duplicated}?${duration}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    }
                }, {
                    type: `Text?id=${id}-language;lang=${lang};text=${lang};droplist.items<<!${readonly}=await().global().asset.findByName():Language.options.map():name;droplist.lang;hoverable;duplicated=${duplicated}?${lang}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    }
                }, {
                    type: `Checkbox?id=${id}-google;class=align-center;path=google;style.cursor=pointer;style.margin=0 .25rem?${google}`,
                    controls: [{
                        event: `change;loaded?():${id}-more.style().display=none<<!e().target.checked;():${id}-more.style().display=flex<<e().target.checked`
                    }]
                }, {
                    type: `Icon?id=${id}-more;name=bi-three-dots-vertical;path=type;style.width=1.5rem;style.display=none;style.color=#666;style.cursor=pointer;style.fontSize=2rem;global().google-items=_array:outlined:rounded:sharp:twoTone;droplist.items=_array:[any.Enter google icon type]:[global().google-items];hoverable?${google}`,
                }, {
                    type: `Icon?class=align-center;name=bi-x;id=${id}-x;hoverable?${clearable}.or():${removable}`,
                    style: {
                        fontSize: '2rem',
                        color: '#444',
                        cursor: 'pointer',
                        after: { color: 'red' }
                    },
                    controls: [{
                        event: 'click',
                        actions: [
                            // remove element
                            `remove:${id}??${removable};():${id}.length().greater():${minlength};!():${id}-input.data()<<${clearable}`,
                            // clear data
                            `focus;resize?().Data().path():[[():${id}.clearable.path].or():[():${id}-input.derivations]]=_string;():${id}-input.val()=_string?():${id}.clearable.isdefined()?${id}-input`,
                            // for key
                            `focus:${id}-input?():${id}-input.val()=_string;():${edit}-key.element.innerHTML=():${edit}-key.key;():${edit}-input.path=():${edit}-key.key;():${edit}-input.derivations=():${edit}.derivations.push():[${edit}-key.key];().Data().[():${edit}-input.derivations]=():${edit}-input.val()?${edit}`
                        ]
                    }]
                }]
            }]
        }
    }

    if (model === 'classic' && !password) {
        return {
            ...component,
            style: {
                border: "0",
                width: "fit-content",
                padding: '0.5rem',
                color: '#444',
                backgroundColor: 'inherit',
                height: 'fit-content',
                borderRadius: '0.25rem',
                fontSize: '1.4rem',
                ...input.style,
                ...style,
            },
            controls: [...controls, {
                event: "input?().parent().required.mount=false;().parent().click()?().parent().required.mount;e().target.value.exist()"
            }]
        }
    }
}

module.exports = Input
},{"../function/clone":40,"../function/merge":81,"../function/toComponent":114,"../function/toString":124}],10:[function(require,module,exports){
const { toComponent } = require("../function/toComponent")

module.exports = (component) => {

  component.hover = component.hover || {}
  component.style = component.style || {}
  component.hover.style = component.hover.style || {}
  component.style.after = component.style.after || {}

  component.icon = component.icon || {}
  component.icon.style = component.icon.style || {}
  component.icon.hover = component.icon.hover || {}
  component.icon.hover.style = component.icon.hover.style || {}
  component.icon.style.after = component.icon.style.after || {}

  component.text = component.text || {}
  component.text.text = component.text.text
  component.text.style = component.text.style || {}
  component.text.hover = component.text.hover || {}
  component.text.hover.style = component.text.hover.style || {}
  component.text.style.after = component.text.style.after || {}

  if (component.hover.freeze) {
    component.icon.hover.freeze = true
    component.text.hover.freeze = true
  }

  if (component.hover.mount) {
    component.icon.hover.mount = true
    component.text.hover.mount = true
  }

  component = toComponent(component)

  var {
    id,
    model,
    state,
    style,
    icon,
    text,
    hover,
    tooltip,
    controls,
    readonly,
    borderMarker,
  } = component
  
  borderMarker = borderMarker !== undefined ? borderMarker : true
  readonly = readonly !== undefined ? readonly : false
  var mount = hover.mount ? true : false

  
  if (model === "classic")
    return {
      ...component,
      class: "flex-box item",
      component: "Item",
      type: `View?touchableOpacity`,
      tooltip,
      hover: {
        ...hover,
        id,
        style: {
          backgroundColor: readonly ? "initial" : "#eee",
          ...style.after,
          ...hover.style 
        }
      },
      style: {
        position: "relative",
        justifyContent: text.text !== undefined ? "flex-start" : "center",
        width: "100%",
        minHeight: "3.3rem",
        cursor: readonly ? "initial" : "pointer",
        marginBottom: "1px",
        borderRadius: "0.5rem",
        padding: "0.9rem",
        borderBottom: readonly ? "1px solid #eee" : "initial",
        pointerEvents: "fill",
        ...style
      },
      children: [{
        type: `Icon?id=${id}-icon?[${icon.name}]`,
        ...icon,
        hover: {
          id,
          mount,
          disable: true,
          ...icon.hover,
          style: {
            color: style.after.color || "#444",
            ...icon.style.after,
            ...icon.hover.style
          }
        },
        style: {
          display: icon ? "flex" : "none",
          color: !readonly ? style.color || "#444" : "#333",
          fontSize: !readonly ? style.fontSize || "1.4rem" : "1.6rem",
          fontWeight: !readonly ? "initial" : "bolder",
          marginRight: text.text !== undefined ? "1rem" : "0",
          ...icon.style,
        }
      }, {
        type: `Text?id=${id}-text;text=${text.text}.str()?[${text.text}]`,
        ...text,
        hover: {
          id,
          mount,
          disable: true,
          ...text.hover,
          style: {
            color: style.after.color || "#444",
            ...text.style.after,
            ...text.hover.style
          }
        },
        style: {
          fontSize: style.fontSize || "1.4rem",
          color: !readonly ? style.color || "#444" : "#333",
          fontWeight: !readonly ? "initial" : "bolder",
          userSelect: "none",
          textAlign: "left",
          ...text.style,
        }
      }],
      controls: [...controls,
      {
        event: `click?():[global().${state}].hover.freeze=false?global().${state}.undefined().or():[global().${state}.0.not():${id}]`,
        actions: [
          `resetStyles:global().${state}`,
          `mountAfterStyles:[global().${state}]?global().${state}=_array:${id}:${id}-icon:${id}-text;():[global().${state}].hover.freeze`,
        ]
      }]
    }
}

},{"../function/toComponent":114}],11:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)
    
    return {
        ...component,
        type: "View?global().opened-maps=_array<<!global().opened-maps;class=flex-column;style.marginLeft=2rem<<().isField;style.width=100%;style.width=calc(100% - 2rem)<<().isField;style.borderLeft=1px solid #ddd<<().isField.isdefined();mode.dark.style.borderLeft=1px solid #888",
        children: [{
            type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem?!().parent().isField",
            controls: [{
                event: "click?().opened=().1stChild().style().transform.includes():rotate(90deg);().parent().children().pull():0.pullLast().map():[style().display.equal():[if():[().opened]:none.else():flex]];().1stChild().style().transform=if():[().opened]:rotate(0deg).else():rotate(90deg);().1stChild().2ndlast().style().display=if():[().opened]:flex.else():none;().lastSibling().style().display=if():[().opened]:none.else():flex;().1stChild().3rdlast().style().display=if():[().opened]:flex.else():none?global().clickedElement.not():[().2ndChild().element].and():[global().clickedElement.not():[().3rdChild().element]].and():[global().clickedElement.id.not():[().lastChild().1stChild().element.id]]"
            }, {
                event: "mouseenter?().lastChild().style().opacity=1"
            }, {
                event: "mouseleave?().lastChild().style().opacity=0"
            }],
            children: [{
                type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s"
            }, {
                type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%"
            }, {
                type: "Text?class=pointer;text=_dots;style.display=none;mode.dark.style.color=#888;style.fontSize=1.4rem"
            }, {
                type: "Text?style.display=none;text=};style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem"
            }, {
                type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                children: [{
                    type: "Icon?mainMap;name=bi-three-dots-vertical;actionlist.undeletable;actionlist.placement=left;mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                }]
            }]
        }, {
            type: "[View]?class=flex column;sort;arrange=().parent().arrange;style.marginLeft=2rem<<!().parent().isField?().data().isdefined()",
            children: [{
                type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem?().derivations.lastIndex().not():id;().derivations.lastIndex().not():creation-date",
                controls: [{
                    event: "click?():[().next().id].style().display=if():[().next().style().display.is():flex]:none.else():flex;():[().1stChild().id].style().transform=if():[().1stChild().style().transform.includes():rotate(0deg)]:rotate(90deg).else():rotate(0deg);().1stChild().2ndlast().style().display=if():[().1stChild().2ndlast().style().display.is():flex]:none.else():flex;().next().next().style().display=if():[().next().next().style().display.is():flex]:none.else():flex;().1stChild().3rdlast().style().display=if():[().1stChild().3rdlast().style().display.is():flex.or():[().data().length().is():0]]:none.else():flex?().data().type().is():array.or():[().data().type().is():map];global().clickedElement.id.not():[().2ndChild().element.id].and():[global().clickedElement.id.not():[().3rdChild().element.id]]:[global().clickedElement.id.not():[().lastChild().1stChild().element.id]]"
                }, {
                    event: "mouseenter?().lastChild().style().opacity=1"
                }, {
                    event: "mouseleave?().lastChild().style().opacity=0"
                }],
                children: [{
                    type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s?().data().type().is():map.or():[().data().type().is():array]"
                }, {
                    type: "View?style.minWidth=2rem;text=?().data().type().not():map.and():[().data().type().not():array]"
                }, {
                    type: "Input?preventDefault;mode.dark.style.color=#8cdcfe;style.height=3.2rem;style.border=1px solid #ffffff00;mode.dark.style.border=1px solid #131313;hover.style.border=1px solid #ddd;input.style.color=blue;input.value=().derivations.lastIndex();style.borderRadius=.5rem;style.minWidth=fit-content;style.width=fit-content?().derivations.lastIndex().num().type().not():number",
                    controls: [{
                        event: "input?global().innerdata=().data().clone();().data().delete();global().element-value=().val();global().derivation-index=().derivations.length().subs():1;().Data().path():[().derivations.clone().pull():[().derivations.length().else():1.subs():1].push():[().val()]].equal():[global().innerdata];().parent().parent().deepChildren().map():[derivations.[global().derivation-index].equal():[global().element-value]]"
                    }, {
                        event: "keyup?():droplist.children().[global().keyup-index].click().then():[()::200.global().keyup-index.delete()]:[().break.eq():true]<<global().droplist-positioner.and():[global().keyup-index];global().keyup-index=0;().next().click();timer():[():droplist.children().0.mouseenter()]:200?e().key=Enter"
                    }, {
                        event: "keyup?():droplist.children().[global().keyup-index].mouseleave();global().keyup-index.equal():[if():[e().keyCode.is():40]:[global().keyup-index.add():1].else():[global().keyup-index.subs():1]];():droplist.children().[global().keyup-index].mouseenter()?e().keyCode.is():40.or():[e().keyCode.is():38];global().droplist-positioner;if():[e().keyCode.is():38]:[global().keyup-index.isgreater():0].elif():[e().keyCode.is():40]:[global().keyup-index.less():[().next().droplist.items.length().subs():1]]"
                    }]
                }, {
                    type: "Text?text=().derivations.lastIndex();class=flex-box;mode.dark.style.color=#888;style.color=#666;style.fontSize=1.4rem;style.marginRight=.5rem;style.minWidth=3rem;style.minHeight=2rem;style.borderRadius=.5rem;style.border=1px solid #ddd?().derivations.lastIndex().num().type().is():number"
                }, {
                    type: "Text?text=:;class=flex-box pointer;mode.dark.style.color=#888;style.fontSize=1.5rem;style.marginRight=.5rem;style.minWidth=2rem;style.minHeight=2rem;style.paddingBottom=.25rem;style.borderRadius=.5rem;hover.style.backgroundColor=#e6e6e6;droplist.items=_array:children:controls:string:number:boolean:map:array:timestamp:geopoint;droplist.isMap"
                }, {
                    type: "Text?text=_quotations;mode.dark.style.color=#c39178;style.color=#ce743a;style.marginRight=.3rem;style.fontSize=1.4rem?().data().type().is():string"
                }, {
                    type: "Text?class=flexbox;text=[;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?().data().type().is():array"
                }, {
                    type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?().data().type().is():map"
                }, {
                    type: "View?style.overflow=auto;style.whiteSpace=nowrap?().data().type().is():string",
                    children: [{
                        type: "View?style.display=inline-flex",
                        children: [{
                            type: "Input?mode.dark.style.color=#c39178;input.readonly<<().derivations.lastElement().is():id;style.maxHeight=3.2rem;style.height=3.2rem;mode.dark.style.border=1px solid #131313;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;style.borderRadius=.5rem;input.style.color=#ce743a",
                            controls: [{
                                event: "keyup?global().insert-index=().parent().parent().parent().parent().parent().children()._findIndex():[_.id.is():[().parent().parent().parent().parent().id]].add():1;().parent().parent().parent().parent().parent().data().field():_string:_string<<().parent().parent().parent().parent().parent().data().type().is():map;().parent().parent().parent().parent().parent().data().splice():_string:[global().insert-index]<<().parent().parent().parent().parent().parent().data().type().is():array;().parent().parent().parent().parent().parent().children().slice():[global().insert-index]._map():[_.1stChild().2ndChild().text().equal():[_.1stChild().2ndChild().text().num().add():1].then():[global().last-index.equal():[_.derivations.length().subs():1]]:[global().el-index.equal():[_.derivations.lastElement().num().add():1]]:[_.deepChildren().map():[derivations.[global().last-index].equal():[global().el-index]]]]<<global().insert-index.less():[().parent().parent().parent().parent().parent().data().length().add():1].and():[().parent().parent().parent().parent().parent().data().type().is():array]?e().key=Enter",
                                actions: "insert:[().parent().parent().parent().parent().parent().id]?insert.component=().parent().parent().parent().parent().parent().children.1.clone().removeMapping();insert.path=if():[().parent().parent().parent().parent().parent().data().type().is():array]:[().parent().parent().parent().parent().parent().derivations.clone().push():[global().insert-index]].else():[().parent().parent().parent().parent().parent().derivations.clone().push():_string];insert.index=global().insert-index"
                            }]
                        }]
                    }]
                }, {
                    type: "Input?style.height=3.2rem;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.type=number;input.style.color=olive;style.width=fit-content;style.borderRadius=.5rem?().data().type().is():number",
                    controls: [{
                        event: "keyup?global().insert-index=().parent().parent().parent().children()._findIndex():[_.id.is():[().parent().parent().id]].add():1;().parent().parent().parent().data().field():_string:_string<<().parent().parent().parent().data().type().is():map;().parent().parent().parent().data().splice():_string:[global().insert-index]<<().parent().parent().parent().data().type().is():array;().parent().parent().parent().children().slice():[global().insert-index]._map():[_.1stChild().2ndChild().text().equal():[_.1stChild().2ndChild().text().num().add():1].then():[global().last-index.equal():[_.derivations.length().subs():1]]:[global().el-index.equal():[_.derivations.lastElement().num().add():1]]:[_.deepChildren().map():[derivations.[global().last-index].equal():[global().el-index]]]]<<global().insert-index.less():[().parent().parent().parent().data().length().add():1].and():[().parent().parent().parent().data().type().is():array]?e().key=Enter",
                        actions: "insert:[().parent().parent().parent().id]?insert.component=().parent().parent().parent().children.1.clone().removeMapping();insert.path=if():[().parent().parent().parent().data().type().is():array]:[().parent().parent().parent().derivations.clone().push():[global().insert-index]].else():[().parent().parent().parent().derivations.clone().push():_string];insert.index=global().insert-index"
                    }]
                }, {
                    type: "Input?style.height=3.2rem;readonly;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.color=purple;style.width=fit-content;style.borderRadius=.5rem;droplist.items=_array:true:false?().data().type().is():boolean"
                }, {
                    type: "Input?style.height=3.2rem;input.type=datetime-local;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.minWidth=25rem;style.borderRadius=.5rem?().data().type().is():timestamp",
                    controls: [{
                        event: "change?().data()=().val().date().timestamp()"
                    }, {
                        event: "loaded?().val()=().data().date().getDateTime()"
                    }]
                }, {
                    type: "Text?text=_quotations;mode.dark.style.color=#c39178;style.marginLeft=.3rem;style.color=#ce743a;style.fontSize=1.4rem?().data().type().is():string"
                }, {
                    type: "Text?class=pointer;style.display=none;mode.dark.style.color=#888;text=_dots;style.fontSize=1.4rem?().data().type().is():array.or():[().data().type().is():map];().data().length().greater():0"
                }, {
                    type: "Text?style.display=none;text=];style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?().data().type().is():array"
                }, {
                    type: "Text?style.display=none;text=};style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?().data().type().is():map"
                }, {
                    type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                    children: [{
                        type: "Icon?actionlist.placement=left;mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;icon.name=bi-three-dots-vertical;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                    }]
                }]
            }, {
                type: "View?arrange=().parent().arrange;class=flex-start;style.display=flex;style.transition=.2s?().data().type().is():map.or():[().data().type().is():array]",
                children: [{
                    type: "Map?arrange=().parent().arrange;isField"
                }]
            }, {
                type: "Text?class=flex-box;text=];mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?().data().type().is():array"
            }, {
                type: "Text?class=flex-box;text=};mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?().data().type().is():map"
            }]
        }, {
            type: "Text?class=flexbox;style.justifyContent=flex-start;text=};style.marginLeft=2rem;style.paddingBottom=.25rem;style.height=2.5rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?!().parent().isField",
        }]
    }
}
},{"../function/toComponent":114}],12:[function(require,module,exports){
const { toComponent } = require("../function/toComponent");
const { generate } = require("../function/generate");

module.exports = (component) => {

  component = toComponent(component);
  var { model, controls } = component;

  var id = component.id || generate();
  var id00 = generate();
  var id05 = generate();
  var id10 = generate();
  var id15 = generate();
  var id20 = generate();
  var id25 = generate();
  var id30 = generate();
  var id35 = generate();
  var id40 = generate();
  var id45 = generate();
  var id50 = generate();

  if (model === "classic")
    return {
      ...component,
      type: "View?class=half-stars",
      children: [
        {
          type: "View?class=rating-group",
          children: [
            {
              type: `Input?id=${id00};class=rating__input rating__input-none;input.defaultValue=0;input.type=radio;checked;input.name=rating`,
            },
            // 0.5 star
            {
              type: `Label?aria-label=0.5 stars;class=rating__label rating__label-half;for=${id05}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id05};class=rating__input;input.defaultValue=0.5;input.type=radio;input.name=rating`,
            },
            // 1 star
            {
              type: `Label?aria-label=1 stars;class=rating__label;for=${id10}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id10};class=rating__input;input.defaultValue=1;input.type=radio;input.name=rating`,
            },
            // 1.5 star
            {
              type: `Label?aria-label=1.5 stars;class=rating__label rating__label-half;for=${id15}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id15};class=rating__input;input.defaultValue=1.5;input.type=radio;input.name=rating`,
            },
            // 2 star
            {
              type: `Label?aria-label=2 stars;class=rating__label;for=${id20}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id20};class=rating__input;input.defaultValue=2;input.type=radio;input.name=rating`,
            },
            // 2.5 star
            {
              type: `Label?aria-label=2.5 stars;class=rating__label rating__label-half;for=${id25}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id25};class=rating__input;input.defaultValue=2.5;input.type=radio;input.name=rating`,
            },
            // 3 star
            {
              type: `Label?aria-label=3 stars;class=rating__label;for=${id30}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id30};class=rating__input;input.defaultValue=3;input.type=radio;input.name=rating`,
            },
            // 3.5 star
            {
              type: `Label?aria-label=3.5 stars;class=rating__label rating__label-half;for=${id35}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id35};class=rating__input;input.defaultValue=3.5;input.type=radio;input.name=rating`,
            },
            // 4 star
            {
              type: `Label?aria-label=4 stars;class=rating__label;for=${id40}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id40};class=rating__input;input.defaultValue=4;input.type=radio;input.name=rating`,
            },
            // 4.5 star
            {
              type: `Label?aria-label=4.5 stars;class=rating__label rating__label-half;for=${id45}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id45};class=rating__input;input.defaultValue=4.5;input.type=radio;input.name=rating`,
            },
            // 5 star
            {
              type: `Label?aria-label=5 stars;class=rating__label;for=${id50}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id50};class=rating__input;input.defaultValue=5;input.type=radio;input.name=rating`,
            },
          ],
        },
      ],
    };
}

},{"../function/generate":68,"../function/toComponent":114}],13:[function(require,module,exports){
const { toComponent } = require("../function/toComponent");

module.exports = (component) => {

  component = toComponent(component)

  return {
    ...component,
    "type": "View?style.flex=1;style.margin=0 1rem;style.height=4.5rem",
    "children": [{
        "type": "View?class=overlay;id=search-mini-page-overlay;style.zIndex=-1;style.transition=.2s;style.display=none;style.after.opacity=1>>50;style.after.display=flex;style.after.zIndex=1",
        "controls": {
            "event": "click",
            "actions": "resetStyles:search-mini-page;resetStyles:search-mini-page-results;setStyle?style.opacity=0;style.display=none>>250"
        }
    }, {
        "type": "View?id=search-mini-page;style.display=flex;style.flexDirection=column;style.backgroundColor=#f0f0f0;style.borderRadius=.75rem;style.flex=1;style.top=1rem;style.position=initial>>200;style.width=60rem;style.after.backgroundColor=#fff;style.after.boxShadow=0 0 6px rgba(33, 33, 33, 0.431);style.after.position=absolute;style.after.zIndex=2",
        "children": [{
            "type": "View?class=flex-start;style.flex=1;style.borderRadius=.75rem;style.height=4.5rem",
            "children": [{
                "type": "Icon?icon.name=bi-search;style.margin=0 1rem;style.color=#888;style.fontSize=1.8rem"
            }, {
                "type": "Input?placeholder=Search for booking, provider, service, category...;style.flex=1;style.height=4.5rem;style.backgroundColor=inherit;style.border=0;style.color=#444;style.fontSize=1.5rem;style.outline=none",
                "controls": [{
                    "event": "focusin",
                    "actions": "mountAfterStyles???search-mini-page-overlay;search-mini-page;search-mini-page-results"
                }, {
                    "event": "input",
                    "actions": "async().search?search.collection=path;search."
                }]
            }]
        }, {
            "type": "View?id=search-mini-page-results;style.width=100%;style.padding=0 1rem;style.transition=.2s;style.height=0;style.opacity=0;style.after.opacity=1;style.after.height=15rem>>25",
            "children": {
                "type": "Text?class=divider;style.margin=0"
            }
        }]
    }]
  }
}

},{"../function/toComponent":114}],14:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)

    component.style = component.style || {}
    component.hover = component.hover || {}
    component.hover.style = component.hover.style || {}

    // innerbox
    component.innerbox = component.innerbox || {}
    component.innerbox.style = component.innerbox.style || {}
    component.innerbox.hover = component.innerbox.hover || {}
    component.innerbox.hover.style = component.innerbox.hover.style || {}
    
    return {
        ...component,
        type: "View?class=swiper",
        children: [{
            type: "View?style.display=inline-flex;style.alignItems=center;style.height=100%",
            ...component.innerbox,
            children: component.children
        }]
    }
}
},{"../function/toComponent":114}],15:[function(require,module,exports){
const { toComponent } = require("../function/toComponent")
const { toString } = require("../function/toString")

module.exports = (component) => {

  var { icon, pin, controls, style } = toComponent(component)

  pin = pin || {}
  icon = icon || {}
  icon.on = icon.on || {}
  icon.off = icon.off || {}

  return {
    ...component,
    type: `View?class=flexbox pointer;hover.style.backgroundColor=#ddd;style.justifyContent=flex-start;style.width=5rem;style.height=2.4rem;style.position=relative;style.borderRadius=2.2rem;style.backgroundColor=#eee;${toString({ style })}`,
    children: [{
      type: `View?class=flexbox;style.transition=.3s;style.width=2rem;style.height=2rem;style.borderRadius=2rem;style.backgroundColor=#fff;style.position=absolute;style.left=0.3rem;${toString(pin)}`,
      children: [{
          type: `Icon?style.color=red;style.fontSize=1.8rem;style.position=absolute;style.transition=.3s;${toString(icon.off)}?[${icon.off.name}]`
        }, {
          type: `Icon?style.color=blue;style.fontSize=1.3rem;style.position=absolute;style.opacity=0;style.transition=.3s;${toString(icon.on)}?[${icon.on.name}]`
        }]
    }],
    controls: [{
        event: "click?().element.checked=[true].if().[().element.checked.notexist()].else().[false];().checked=().element.checked;().1stChild().element.style.left=[calc(100% - 2.3rem)].if().[().element.checked].else().[0.3rem];().1stChild().1stChild().element.style.opacity=[0].if().[().element.checked].else().[1];().1stChild().2ndChild().element.style.opacity=[1].if().[().element.checked].else().[0]"
      },
      ...controls
    ]
  }
}

},{"../function/toComponent":114,"../function/toString":124}],16:[function(require,module,exports){
module.exports = {
  Button : require("./Button"),
  Input : require("./Input"),
  Item : require("./Item"),
  Header : require("./Header"),
  Switch : require("./Switch"),
  SearchBox : require("./SearchBox"),
  Checkbox : require("./Checkbox"),
  Rate : require("./Rate"),
  Map : require("./Map"),
  Swiper : require("./Swiper")
}

},{"./Button":6,"./Checkbox":7,"./Header":8,"./Input":9,"./Item":10,"./Map":11,"./Rate":12,"./SearchBox":13,"./Swiper":14,"./Switch":15}],17:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  
  return [{
    event: "click",
    actions: [
      `?():actionlist.children().map():[style().pointerEvents.eq():none];():actionlist.style().opacity=0;():actionlist.style().transform=scale(0.5);():actionlist.style().pointerEvents=none;global().actionlist-caller.delete();break?():actionlist.style().opacity=1;global().actionlist-caller=${id}`,
      `update:actionlist?().actionlist.undeletable=():actionlist.undeletable.or():_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;global().actionlist-caller=${id};global().actionlist-caller-id=${id};path=${controls.path || ""};():actionlist.style().opacity=0;():actionlist.style().transform=scale(0.5);():actionlist.style().pointerEvents=none;():actionlist.children().map():[style().pointerEvents.eq():none]`,
      `setPosition:actionlist?():actionlist.children().map():[style().pointerEvents.eq():auto];():actionlist.style().opacity=1;():actionlist.style().transform=scale(1);():actionlist.style().pointerEvents=auto;position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance}`
    ]
  }]
}

},{}],18:[function(require,module,exports){
module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var _id = controls.id || id
    
    local.click.sticky = local.click.sticky ? true : false
    local.click.before = local.click.before || {}
    local.click.style &&
    Object.keys(local.click.style).map(key => 
        local.click.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:${_id}?global().[().state]<<().state=().click.id?().click.mount`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().click.style].else():[().mode.[global().mode].click.style].else():_map"
    }, {
        "event": `mousedown:${_id}??!().click.disable;!().click.sticky`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().click.style].else():[().mode.[global().mode].click.style].else():_map"
    }, {
        "event": `mouseup:${_id}??!().click.freeze;!().click.disable;!().click.sticky`,
        "actions": "setStyle?style=().click.before?().click.freeze.not()"
    }, {
        "event": `click:${_id}?().click.mount=if():[().click.mount]:false.else():true?().click.sticky;!().click.disable`,
        "actions": "setStyle?style=if():[().click.mount]:[().click.style].else():[().click.before]"
    }]
}
},{}],19:[function(require,module,exports){
module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var _id = controls.id || id
    
    local.clicked.freeze = local.clicked.freeze ? true : false
    local.clicked.before = local.clicked.before || {}
    local.clicked.style &&
    Object.keys(local.clicked.style).map(key => 
        local.clicked.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:${_id}?().clicked.freeze=true?().clicked.mount.or():[().clicked.freeze]`,
        "actions": "setStyle?style=if().[global().mode.is():[global().default-mode]]:[().clicked.style].else():[().mode.[global().mode].clicked.style].else():_map"
    }, {
        "event": `click??!().required.mount;!().parent().required.mount;!().clicked.disable`,
        "actions": "setStyle?style=if().[global().mode.is():[global().default-mode]]:[().clicked.style].else():[().mode.[global().mode].clicked.style].else():_map;().clicked.freeze=true"
    }, {
        "event": `click:body??!().required.mount;!().parent().required.mount;().clicked.freeze;global().clickedElement.outside():[().element];!().clicked.disable`,
        "actions": "setStyle?style=().clicked.before;().clicked.freeze=false"
    }]
}
},{}],20:[function(require,module,exports){
module.exports = {
  item: require("./item"),
  list: require("./list"),
  popup: require("./popup"),
  droplist: require("./droplist"),
  actionlist: require("./actionlist"),
  hoverable: require("./hoverable"),
  sorter: require("./sorter"),
  tooltip: require("./tooltip"),
  mininote: require("./mininote"),
  miniWindow: require("./miniWindow"),
  toggler: require("./toggler"),
  touchableOpacity: require("./touchableOpacity"),
  pricable: require("./pricable"),
  hover: require("./hover"),
  click: require("./click"),
  clicked: require("./clicked"),
  touch: require("./touch"),
  loaded: require("./loaded"),
  contentful: require("../function/contentful").contentful
}
},{"../function/contentful":43,"./actionlist":17,"./click":18,"./clicked":19,"./droplist":21,"./hover":22,"./hoverable":23,"./item":24,"./list":25,"./loaded":26,"./miniWindow":27,"./mininote":28,"./popup":29,"./pricable":30,"./sorter":31,"./toggler":32,"./tooltip":33,"./touch":34,"./touchableOpacity":35}],21:[function(require,module,exports){
const { toString } = require("../function/toString")

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })
  
  return [{
    event: "click",
    actions: [
      `?():droplist.children().map():[style().pointerEvents.eq():none];():droplist.style().opacity.eq():0;():droplist.style().transform.eq():[scale(0.5)];():droplist.style().pointerEvents.eq():none;global().droplist-positioner.delete();break?():droplist.style().opacity=1;global().droplist-positioner=${id}`,
      `setStyle<<const.${controls.style}:droplist?${styles}`,
      `droplist:${id}?global().droplist-positioner=${id};():droplist.style().opacity.eq():0;():droplist.style().transform.eq():[scale(0.5)];():droplist.style().pointerEvents.eq():none;():droplist.children().map():[style().pointerEvents.eq():none]`,
      `setPosition:droplist?():droplist.children().map():[style().pointerEvents.eq():auto];():droplist.style().opacity=1;():droplist.style().transform=scale(1);():droplist.style().pointerEvents=auto;position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align}`
    ]
  }]
}

},{"../function/toString":124}],22:[function(require,module,exports){
module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var _id = controls.id || controls.controllerId || id
    
    local.hover.before = local.hover.before || {}
    local.hover.style &&
    Object.keys(local.hover.style).map(key => 
        local.hover.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )
    
    return [{
        "event": `loaded:${_id}?global().[().state]<<().state.is():[().hover.id]?().hover.mount`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().hover.style].else():[().mode.[global().mode].hover.style].else():_map"
    }, {
        "event": `mouseenter:${_id}??!().click.mount;!().hover.disable`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().hover.style].else():[().mode.[global().mode].hover.style].else():_map"
    }, {
        "event": `mouseleave:${_id}??!().click.mount;!().hover.disable`,
        "actions": "setStyle?style=().hover.before"
    }]
}
},{}],23:[function(require,module,exports){
const {toArray} = require("../function/toArray")

module.exports = ({ id, controls }) => {

  controls.id = toArray(controls.id || id)

  return [{
      event: "mouseenter",
      actions: `mountAfterStyles:[${controls.id}]`,
    }, {
      event: "mouseleave",
      actions: `resetStyles:[${controls.id}]??${controls.mountonload ? "!mountonload" : true}`,
    }]
}

},{"../function/toArray":109}],24:[function(require,module,exports){
module.exports = ({params}) => [
  "setData?data.value=().text",
  `resetStyles?():[global().${params.state}.0].mountonload=false??global().${params.state}`,
  `setState?global().${params.state}=[${params.id || "().id"},${
    params.id || "().id"
  }++-icon,${params.id || "().id"}++-text,${
    params.id || "().id"
  }++-chevron]`,
  `mountAfterStyles?().mountonload:global().${params.state}.0??global().${params.state}`,
];

},{}],25:[function(require,module,exports){
module.exports = ({ controls }) => {

  return [{
    event: "click",
    actions: [
      `setState?global().${controls.id}-mouseenter`,
      `mountAfterStyles:${controls.id}`,
      `setPosition?position.positioner=${controls.id};position.placement=${controls.placement || "right"};position.distance=${controls.distance || "15"}`,
    ],
  }, {
    event: "mouseleave",
    actions: [
      `resetStyles>>200:${controls.id}??!mouseenter;!mouseenter:${controls.id};!global().${controls.id}-mouseenter`,
      `setState?global().${controls.id}-mouseenter=false`,
    ]
  }]
}

},{}],26:[function(require,module,exports){
const { toArray } = require("../function/toArray")

module.exports = ({ controls, id }) => {

    var actions = Object.keys(controls.actions)
    id = toArray(controls.id || id)
    
    return [{
        "event": "loaded",
        "actions": id.map(id => `${actions}:${id}`)
    }]
}
},{"../function/toArray":109}],27:[function(require,module,exports){
const { generate } = require("../function/generate");

module.exports = ({ params }) => {

  var controls = params.controls
  var state = generate()

  return [{
    event: "click??!global().mini-window-close",
    actions: [
      `createView:mini-window-view?global().${state}=${controls.Data ? window.global[controls.Data] : '().data()'};():mini-window-view.Data.delete();():mini-window-view.Data=${state}<<().data();view=${controls.view}`,
      "setStyle:mini-window?style.display=flex;style.opacity=1>>25",
    ]
  }]
}

},{"../function/generate":68}],28:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `click?():mininote-text.text()=${text};global().mininote-timer.clearTimeout();():mininote.style().opacity=1;():mininote.style().transform=scale(1);global().mininote-timer=timer():[():mininote.style().opacity.equal():[0.str()].and():[():mininote.style().transform.equal():scale(0)]]:3000`,
    actions: "setPosition:mininote?position.positioner=mouse;position.placement=right"
  }]
}
},{}],29:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })

  return [{
    event: `click?():popup.style().zIndex=-1;():popup.style().opacity=0;():popup.style().pointerEvents=none;():popup.style().transform=scale(0.5);global().popup-positioner.delete();global().popup=${controls.id || id}`,
    actions: [
      `?break?global().popup-positioner=${id}`,
      `popup:${id}?global().popup-positioner=${id}`,
      `setStyle:popup?${styles}`,
      `setPosition:popup?():popup.style().zIndex=10;():popup.style().opacity=1;():popup.style().pointerEvents=auto;():popup.style().transform=scale(1);position.positioner=${controls.positioner || id};position.placement=${controls.placement || "left"};position.distance=${controls.distance}`
    ]
  }]
}

},{}],30:[function(require,module,exports){
module.exports = ({ id }) => {
    
    var input_id = window.value[id].type === 'Input' ? id : `${id}-input`
    return [{
        "event": `input:${input_id}?():${input_id}.data()=():${input_id}.element.value().toPrice().else().0;():${input_id}.element.value=():${input_id}.data().else().0`
    }]
}
},{}],31:[function(require,module,exports){
const { toArray } = require("../function/toArray");

module.exports = ({ id, controls }) => {
  
  controls.id = toArray(controls.id || id)

  return [{
    event: "click",
    actions: `await().update:${controls.id};async().sort?sort.path=${controls.path};sort.Data=${controls.Data}?global().${controls.Data}`
  }]
}

},{"../function/toArray":109}],32:[function(require,module,exports){
module.exports = ({ controls }) => {

  return [{
    event: `click??().view:${controls.id}!=${controls.view}`,
    actions: [
      `setStyle:${controls.id}?():${controls.id}.style().transition=transform .2s, opacity .2s;style.transform=translateY(-150%);style.opacity=0`,
      `setStyle>>400:${controls.id}?style.transform=translateY(0);style.opacity=1`,
      `createView>>250:${controls.id}?():${controls.id}.element.innerHTML='';():${controls.id}.Data=().data();view=${controls.view}`,
    ]
  }]
}

},{}],33:[function(require,module,exports){
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `mousemove?global().tooltip-timer=timer():[():tooltip.style().opacity.equal():1]:500<<!global().tooltip-timer;():tooltip-text.text()=${text};():tooltip-text.removeClass():ar;():tooltip-text.addClass():ar<<${arabic.test(text) && !english.test(text)}`,
    actions: `setPosition:tooltip?position.positioner=mouse;position.placement=${controls.placement || "left"};position.distance=${controls.distance}`
  }, {
    event: "mouseleave?global().tooltip-timer.clearTimeout();global().tooltip-timer.delete();():tooltip.style().opacity=0"
  }]
}
},{}],34:[function(require,module,exports){
const { toArray } = require("../function/toArray")

module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var idlist = toArray(controls.id || id)
    
    local.touch.before = local.touch.before || {}
    local.touch.style &&
    Object.keys(local.touch.style).map(key => 
        local.touch.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:[${idlist}].arr()?global().[().state]<<value().state=().touch.id?().touch.mount`,
        "actions": "setStyle?style=().touch.style.if().[global().mode.is():[global().default-mode]].else().[().mode.[global().mode].touch.style].else()._map"
    }, {
        "event": `touchstart:[${idlist}].arr()??!().touch.disable`,
        "actions": "setStyle?style=().touch.style.if().[global().mode.is():[global().default-mode]].else().[().mode.[global().mode].touch.style].else()._map"
    }, {
        "event": `touchend:[${idlist}].arr()??!().touch.freeze;!().touch.disable`,
        "actions": "setStyle?style=().touch.before?().touch.freeze.not()"
    }]
}
},{"../function/toArray":109}],35:[function(require,module,exports){
module.exports = ({ id }) => {

  if (window.value[id].element.style.transition) {
    window.value[id].element.style.transition += ", opacity .2s";
  } else window.value[id].element.style.transition = "opacity .2s";

  return [{
    event: `mousedown?():body.element.addClass().unselectable`,
    actions: "setStyle?style.opacity=.5",
  }, {
    event: `mouseup?():body.element.removeClass().unselectable`,
    actions: "setStyle?style.opacity=1",
  }, {
    event: "mouseleave",
    actions: "setStyle?style.opacity=1",
  }, {
    event: "mouseenter",
    actions: "setStyle?style.opacity=1?().mousedown",
  }]
}

},{}],36:[function(require,module,exports){
const axios = require('axios')
const { toAwait } = require("./toAwait")

module.exports = {
    searchArduino: async ({ id, search = {}, ...params }) => {
        
        var local = window.value[id]
        var { data } = await axios.get(`http://192.168.20.234/`)

        local.search = data
        
        console.log(data)

        // await params
        toAwait({ id, params })
    }
}
},{"./toAwait":110,"axios":132}],37:[function(require,module,exports){
const blur = ({ id }) => {

  var local = window.value[id]
  if (!local) return

  var isInput = local.type === "Input" || local.type === "Textarea"
  if (isInput) local.element.blur()
  else {
    if (local.element) {
      let childElements = local.element.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = local.element.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].blur()
      }
    }
  }
}

module.exports = {blur}

},{}],38:[function(require,module,exports){
const capitalize = (string, minimize) => {
  if (typeof string !== "string") return string

  if (minimize) return string
    .split(" ")
    .map((string) => string.charAt(0).toLowerCase() + string.slice(1))
    .join(" ")

  return string
      .split(" ")
      .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
      .join(" ")
}

module.exports = {capitalize}

},{}],39:[function(require,module,exports){
const {clone} = require("./clone");

const clearValues = (obj) => {
  let newObj = clone(obj);

  if (typeof obj === "undefined") return "";

  if (typeof obj === "string") return "";

  if (Array.isArray(obj)) {
    newObj = [];
    if (obj.length > 0) {
      obj.map((element, index) => {
        if (typeof element === "object") {
          newObj[index] = clearValues(element);
        } else newObj[index] = "";
      });
    }

    return newObj;
  }

  Object.entries(obj).map(([key, value]) => {
    if (Array.isArray(value)) {
      newObj[key] = [];
      if (value.length > 0) {
        value.map((element, index) => {
          if (typeof element === "object") {
            newObj[key][index] = clearValues(element);
          } else newObj[key][index] = "";
        });
      }
    } else if (typeof value === "object") newObj[key] = clearValues(value);
    else newObj[key] = "";
  });

  return newObj;
};

module.exports = {clearValues};

},{"./clone":40}],40:[function(require,module,exports){
const clone = (obj) => {

  /*if (typeof obj !== "object") return obj
  if (Array.isArray(obj)) return obj.map(obj => clone(obj))
  else { 
    var copy = {}
    Object.assign(copy, obj)
    return copy
  }*/

  var copy
  if (typeof obj !== "object") copy = obj
  else if (Array.isArray(obj)) copy = obj.map((obj) => clone(obj))
  else {
    var element

    if (obj.element) element = obj.element
    copy = JSON.parse(JSON.stringify(obj))

    if (element) copy.element = element
  }

  return copy
}

const isElement = (obj) => {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement
  } catch (e) {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have (works on IE7)
    return (
      typeof obj === "object" &&
      obj.nodeType === 1 &&
      typeof obj.style === "object" &&
      typeof obj.ownerDocument === "object"
    )
  }
}

module.exports = {clone}

},{}],41:[function(require,module,exports){
const close = ({ id }) => {

  var local = window.value[id]
  clearTimeout(local["note-timer"])
  local.element.style.transform = "translateY(-200%)"

}

module.exports = {close}

},{}],42:[function(require,module,exports){
module.exports = {
    compare: (value1, operator, value2) => {
        if (operator === "==") return value1 === value2
        else if (operator === ">") return parseFloat(value1) > parseFloat(value2)
        else if (operator === "<") return parseFloat(value1) < parseFloat(value2)
        else if (operator === ">=") return parseFloat(value1) >= parseFloat(value2)
        else if (operator === "<=") return parseFloat(value1) <= parseFloat(value2)
        else if (operator === "in") return value1.includes(value2)
    }
}
},{}],43:[function(require,module,exports){
module.exports = {
    contentful: ({ id }) => {
        var local = window.value[id]

        local.element.addEventListener("keydown", (e => {
            
            if (e.key === "Tab" || e.key === "Enter" || e.key === "{" || e.key === "[" || e.key === "(") {
                

                var start = e.target.selectionStart
                var end = e.target.selectionEnd
                var value = e.target.value

                var isEnter = e.key === "Enter"
                var isTab = e.key === "Tab"
                var isCurly = e.key === "{"
                var isSquare = e.key === "["
                var isRound = e.key === "("

                var innerValue = isTab ? "\t" 
                : isEnter ? "\n"
                : isCurly ? "{}"
                : isSquare ? "[]"
                : isRound ? "()"
                : ""
                
                if (isEnter) {
                    var after = value.substring(end).slice(0, 1)
                    after = after === "}" || after === "]" || after === ")"
                    if (after) innerValue += "\n"
                }
        
                // set textarea value to: text before caret + tab + text after caret
                e.target.value = value.substring(0, start) + innerValue + value.substring(end)
        
                // put caret at right position again (add one for the tab)
                e.target.selectionStart = e.target.selectionEnd = start + 1
        
                // prevent the focus lose
                e.preventDefault()

            }
        }))
    }
}
},{}],44:[function(require,module,exports){
const { toArray } = require("./toArray")

const controls = ({ _window, controls, id, req, res }) => {

  const { addEventListener } = require("./event")
  const { watch } = require("./watch")

  var local = _window ? _window.value[id] : window.value[id]

  // controls coming from toControls action
  controls = controls || local.controls
  
  controls && toArray(controls).map(controls => {
    // watch
    if (controls.watch) watch({ _window, controls, id, req, res })
    // event
    else if (controls.event) addEventListener({ _window, controls, id, req, res })
  })
}

const setControls = ({ id, params }) => {

  var local = window.value[id]
  if (!local) return

  local.controls = toArray(local.controls)
  local.controls.push(...toArray(params.controls))
}

module.exports = { controls, setControls }

},{"./event":59,"./toArray":109,"./watch":131}],45:[function(require,module,exports){
const setCookie = ({ name = "", value, expiry = 360 }) => {

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

const eraseCookie = ({ name }) => {   
  document.cookie = name +'=; Max-Age=-99999999;'  
}

module.exports = {setCookie, getCookie, eraseCookie}
},{}],46:[function(require,module,exports){
const control = require("../control/control")

const createActions = ({ params, id }) => {

  const {execute} = require("./execute")

  if (!params.type) return
  var actions = control[params.type]({ params, id })

  execute({ actions, id })
}

module.exports = {createActions}

},{"../control/control":20,"./execute":60}],47:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
// const { override } = require("./merge")

const component = require("../component/component")
const { toCode } = require("./toCode")

module.exports = {
  createComponent: ({ _window, id, req, res }) => {
    
    var value = _window ? _window.value : window.value
    var global = _window ? _window.global : window.global
    var local = value[id], parent = local.parent

    if (!component[local.type]) return
    value[id] = local = component[local.type](local)

    // destructure type, params, & conditions from type
    local.type = toCode({ _window, id, string: local.type })
    var type = local.type.split("?")[0]
    var params = local.type.split("?")[1]
    var conditions = local.type.split("?")[2]

    // type
    local.type = type
    local.parent = parent

    // approval
    var approved = toApproval({ _window, string: conditions, id, req, res })
    if (!approved) return

    // push destructured params from type to local
    if (params) {
      
      params = toParam({ _window, string: params, id, req, res, mount: true })
      // value[id] = local = override(local, params)

      if (params.id) {
        
        delete Object.assign(value, { [params.id]: value[id] })[id]
        id = params.id
      }
      
      if (params.data && (!local.Data || params.Data)) {

        local.Data = local.Data || generate()
        var state = local.Data
        global[state] = clone(local.data || global[state])
        global[`${state}-options`] = global[`${state}-options`] || {}
      }
    }

    // value[id] = local
  }
}

},{"../component/component":16,"./clone":40,"./generate":68,"./toApproval":108,"./toCode":113,"./toParam":120}],48:[function(require,module,exports){
const { createElement } = require("./createElement")
// const { toParam } = require("./toParam")
const { toArray } = require("./toArray")
const { controls } = require("./controls")
const { getJsonFiles } = require("./getJsonFiles")
const { toApproval } = require("./toApproval")
const { capitalize } = require("./capitalize")
const { toCode } = require("./toCode")
//
require('dotenv').config()

const createDocument = async ({ req, res, db }) => {

    // Create a cookies object
    var domain = req.headers["x-forwarded-host"]
    var host = req.headers["host"]
    
    // current page
    var currentPage = req.url.split("/")[1] || ""
    currentPage = currentPage || "main"
    
    var promises = [], user, page, view, css, js, project, editorAuth
    
    // get assets & views
    var global = {
        data: {
            user: {},
            view: {},
            page: {},
            editor: {},
            project: {}
        },
        codes: {},
        host,
        domain: domain || host,
        currentPage,
        path: req.url,
        cookies: req.cookies,
        device: req.device,
        headers: req.headers,
        public: getJsonFiles("public"),
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"]
    }
    
    var value = {
        body: { 
            id: "body" 
        },
        root: {
            id: "root",
            type: "View",
            parent: "body",
            style: { backgroundColor: "#fff" }
        },
        public: {
            id: "public",
            type: "View",
            parent: "body",
            children: Object.values(global.public)
        }
    }

    // get project data
    project = db
        .collection("project").where("domains", "array-contains", domain || host)
        .get().then(doc => {

            if (doc.docs[0] && doc.docs[0].exists) {
                global.data.project = doc.docs[0].data()
                global.data.project.id = doc.docs[0].id
            }
        })

    // get editor project data
    if (currentPage === "developer-editor") {

        var projectID = req.url.split("/")[2]
        
        editorAuth = db
            .collection("authentication").doc(projectID)
            .get().then(doc => {

                if (doc.exists) global.auth = doc.data().code
            })
    }

    promises.push(project)
    promises.push(editorAuth)
    await Promise.all(promises)

    // project not found
    if (Object.keys(global.data.project).length === 0) return res.send("Project not found!")

    // get user
    user = db
        .collection("user").where("project-id", "array-contains", global.data.project.id)
        .get().then(doc => { 
            
            if (doc.docs[0].exists) {
                global.data.user = doc.docs[0].data()
                global.data.user.id = doc.docs[0].id
            }
        })

    // get page
    page = db
        .collection(`page-${global.data.project.id}`)
        .get().then(q => q.forEach(doc => global.data.page[doc.id] = doc.data() ))

    // get view
    view = db
        .collection(`view-${global.data.project.id}`)
        .get().then(q => q.forEach(doc => global.data.view[doc.id] = doc.data()))

    promises.push(js)
    promises.push(css)
    promises.push(page)
    promises.push(view)
    promises.push(user)
    
    await Promise.all(promises)
    
    // user not found
    if (!global.data.user) return res.send("User not found")

    // page doesnot exist
    if (!global.data.page[currentPage]) return res.send(`${capitalize(currentPage)} page does not exist!`)

    // mount globals
    if (global.data.page[currentPage].global)
    Object.entries(global.data.page[currentPage].global).map(([key, value]) => global[key] = value)
    
    // controls & children
    value.root.controls = global.data.page[currentPage].controls
    value.root.children = global.data.page[currentPage]["view-id"].map(view => global.data.view[view])

    // forward
    if (global.data.page[currentPage].forward) {

        var forward = global.data.page[currentPage].forward
        forward = toCode({ _window, id, string: forward }).split("?")
        var params = forward[1]
        var conditions = forward[2]
        forward = forward[0]

        var approved = toApproval({ _window: { global, value }, string: conditions, id: "root", req, res })
        if (approved) {
            global.path = forward
            global.currentPage = currentPage = global.path.split("/")[1]
        }
    }

    // onloading
    if (global.data.page[currentPage].controls) {
        global.data.page[currentPage].controls = toArray(global.data.page[currentPage].controls)
        var loadingEventControls = global.data.page[currentPage].controls.find(controls => controls.event.split("?")[0].includes("loading"))
        if (loadingEventControls) controls({ _window: { global, value }, id: "root", req, res, controls: loadingEventControls })
    }

    // create html
    var innerHTML = ""
    innerHTML = createElement({ _window: { global, value }, id: "root", req, res })
    innerHTML += createElement({ _window: { global, value }, id: "public", req, res })

    // meta
    global.data.page[currentPage].meta = global.data.page[currentPage].meta || {}

    // viewport
    var viewport = global.data.page[currentPage].meta.viewport
    viewport = viewport !== undefined ? viewport : "width=device-width, initial-scale=1.0"

    // language
    var language = global.data.page[currentPage].language || "en"
    var direction = (language === "ar" || language === "fa") ? "rtl" : "ltr"
    
    res.send(`<!DOCTYPE html>
        <html lang="${language}" dir="${direction}" class="html">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="${viewport}">
            <meta name="keywords" content="${global.data.page[currentPage].meta.keywords}">
            <meta name="description" content="${global.data.page[currentPage].meta.description || ""}">
            <meta name="title" content="${global.data.page[currentPage].meta.title || ""}">
            <title>${global.data.page[currentPage].title}</title>
            <link rel="stylesheet" href="/index.css"/>
        </head>
        <body>
            ${innerHTML}
            <script id="value" type="application/json">${JSON.stringify(value)}</script>
            <script id="global" type="application/json">${JSON.stringify(global)}</script>
            <script src="/index.js"></script>
        </body>
        </html>`)
}

module.exports = { createDocument }

},{"./capitalize":38,"./controls":44,"./createElement":49,"./getJsonFiles":71,"./toApproval":108,"./toArray":109,"./toCode":113,"dotenv":161}],49:[function(require,module,exports){
const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { override } = require("./merge")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")

var createElement = ({ _window, id, req, res }) => {

  var value = _window ? _window.value : window.value
  var local = value[id]
  var global = _window ? _window.global : window.global
  var parent = value[local.parent]
  
  // html
  if (local.html) return local.html

  // view value
  if (local.view && global.data.view[local.view]) local = clone(global.data.view[local.view])

  // no value
  if (!local.type) return

  local.type = toCode({ _window, string: local.type })

  // destructure type, params, & conditions from type
  
  var type = local.type.split("?")[0]
  var params = local.type.split("?")[1]
  var conditions = local.type.split("?")[2]

  // [type]
  if (!local.duplicatedElement && type.includes("coded()")) local.mapType = true
  type = local.type = toValue({ _window, value: type, id, req, res})

  // parent
  local.parent = parent.id

  // style
  local.style = local.style || {}

  // id
  local.id = local.id || generate()
  id = local.id

  // class
  local.class = local.class || ""

  // Data
  local.Data = parent.Data

  // derivations
  local.derivations = local.derivations || [...(parent.derivations || [])]

  // controls
  local.controls = local.controls || []

  // status
  local.status = "Loading"

  // first mount of local
  value[id] = local

  // ///////////////// approval & params /////////////////////

  // approval
  var approved = toApproval({ _window, string: conditions, id, req, res })
  if (!approved) return

  // push destructured params from type to local
  if (params) {
    
    params = toParam({ _window, string: params, id, req, res, mount: true })
    // value[id] = local = override(local, params)
    
    if (params.id && params.id !== id) {

      delete Object.assign(value, { [params.id]: value[id] })[id]
      id = params.id
    }

    if (params.data !== undefined || params.Data || (local.data !== undefined && !local.Data)) {
      
      local.Data = local.Data || generate()
      global[local.Data] = clone(local.data !== undefined ? local.data : (global[local.Data] !== undefined ? global[local.Data] : {}))
      local.data = global[local.Data]
    }

    // view
    if (params.view) {

      var _local = clone(global.data.view[local.view])
      if (_local) {

        delete local.type
        delete local.view
        
        value[id] = override(_local, local)
        return createElement({ _window, id, req, res })
      }
    }
  }

  // duplicated element
  if (local.duplicatedElement) {

    delete local.path
    delete local.data
  }

  // path & derivations
  var path = (typeof local.path === "string" || typeof local.path === "number") ? local.path.toString().split(".") : []
      
  if (path.length > 0) {
    if (!local.Data) {

      local.Data = generate()
      global[local.Data] = local.data || {}
    }

    local.derivations.push(...path)
  }

  // data
  if (parent.unDeriveData || local.unDeriveData) {

    local.data = local.data || ""
    local.unDeriveData = true

  } else local.data = reducer({ _window, id, path: local.derivations, value: local.data, key: true, object: global[local.Data], req, res })
  
  return createTags({ _window, id, req, res })
}

module.exports = { createElement }

},{"./clone":40,"./createTags":50,"./generate":68,"./merge":81,"./reducer":89,"./toApproval":108,"./toCode":113,"./toParam":120,"./toValue":126}],50:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { toHtml } = require("./toHtml")
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")

const createTags = ({ _window, id, req, res }) => {

  var value = _window ? _window.value : window.value
  var local = value[id]
  if (!local) return

  local.length = 1
  
  // data mapType
  var data = Array.isArray(local.data) ? local.data : typeof local.data === "object" ? Object.keys(local.data) : []
  var isObject = !Array.isArray(local.data)
  local.length = data.length || 1
  
  if (local.mapType) {
    if (data.length > 0) {

      data = arrange({ data, arrange: local.arrange, id, _window })
      delete value[id]
      
      return data.map((_data, index) => {

        var id = generate()
        var _local = clone(local)

        value[id] = _local

        _local.id = id
        _local.mapIndex = index
        _local.data = isObject ? _local.data[_data] : _data
        _local.derivations = isObject ? [..._local.derivations, _data] : [..._local.derivations, index]

        // check approval again for last time
        var conditions = value[local.parent].children[local.index]
        var approved = toApproval({ _window, string: conditions, id, req, res })
        if (!approved) return

        return createTag({ _window, id, req, res })

      }).join("")

    } else {

      local.mapIndex = 0
      local.data = null
      local.derivations = isObject ? [...local.derivations, ""] : [...local.derivations, 0]
      
      // check approval again for last time
      var conditions = value[local.parent].children[local.index].type.split("?")[2]
      var approved = toApproval({ _window, string: conditions, id, req, res })
      if (!approved) return
      
      return createTag({ _window, id, req, res })
    }
  }
/*
  if (local.originalKeys) {

    var keys = Object.keys(clone(local.data || {})).filter(key => !local.originalKeys.includes(key))

    if (keys.length > 0) {

      local.length = keys.length
      delete value[id]

      return keys
      .map((key, index) => {

        var id = langs.length === 1 ? local.id : generate()
        var _local = clone(local)

        _local.id = id
        _local.key = key
        _local.mapIndex = index
        value[id] = _local

        return createTag({ _window, id, req, res })

      }).join("")
    }
  }

  if (local.lang && !local.templated && !local.duplicated) {

    var langs = Object.keys(clone(local.data || {}))

    if (langs.length > 0) {

      local.length = langs.length
      delete value[id]

      return langs
      .map((lang, index) => {

        var id = langs.length === 1 ? local.id : generate()
        var _local = clone(local)

        _local.id = id
        _local.lang = lang
        _local.mapIndex = index

        value[id] = _local

        return createTag({ _window, id, req, res })
        
      }).join("")
    }
  }

  if (local.currency && !local.templated && !local.duplicated) {
    
    var currencies = Object.keys(clone(local.data || {}))

    if (currencies.length > 0) {

      local.length = currencies.length
      delete value[id]

      return currencies
      .map((currency, index) => {

        var id = currencies.length === 1 ? local.id : generate()
        var _local = clone(local)

        _local.id = id
        _local.currency = currency
        _local.mapIndex = index

        value[id] = _local

        return createTag({ _window, id, req, res })

      }).join("")
    }
  }
*/
  return createTag({ _window, id, req, res })
}

const createTag = ({ _window, id, req, res }) => {

  const {execute} = require("./execute")

  var local = _window ? _window.value[id] : window.value[id]
  
  // components
  componentModifier({ _window, id })
  createComponent({ _window, id, req, res })

  // flicker for inputs
  if (local.flicker) {
    
    local.flicker = { opacity: local.style.opacity || "1" }
    local.style.opacity = "0"
  }

  if (local.actions) execute({ _window, actions: local.actions, id, req, res })
  return toHtml({ _window, id, req, res })
}

const componentModifier = ({ _window, id }) => {

  var local = _window ? _window.value[id] : window.value[id]

  // icon
  if (local.type === "Icon") {

    local.icon = local.icon || {}
    local.icon.name = local.name || local.icon.name || ""
    if (local.icon.google) local.google = true

    if (local.icon.outlined || local.icon.type === "outlined") {
      local.outlined = true
    } else if (local.icon.filled || local.icon.type === "filled") {
      local.filled = true
    } else if (local.icon.rounded || local.icon.type === "rounded") {
      local.rounded = true
    } else if (local.icon.sharp || local.icon.type === "sharp") {
      local.sharp = true
    } else if (local.icon.twoTone || local.icon.type === "twoTone") {
      local.twoTone = true
    }
  }

  // textarea
  else if (local.textarea && !local.templated) {

    local.style = local.style || {}
    local.input = local.input || {}
    local.input.style = local.input.style || {}
    local.input.style.height = "fit-content"
  }

  // input
  else if (local.type === "Input") {

    local.input = local.input || {}
    if (local.value) local.input.value = local.input.value || local.value
    if (local.checked !== undefined) local.input.checked = local.checked
    if (local.max !== undefined) local.input.max = local.max
    if (local.min !== undefined) local.input.min = local.min
    if (local.name !== undefined) local.input.name = local.name
    if (local.input.placeholder) local.placeholder = local.input.placeholder
    
  } else if (local.type === "Item") {

    var parent = _window ? _window.value[local.parent] : window.value[local.parent]

    if (local.index === 0) {

      local.state = generate()
      parent.state = local.state
      
    } else local.state = parent.state
  }
}

const arrange = ({ data, arrange, id, _window }) => {

  var value = _window ? _window.value : window.value
  var local = value[id], index = 0

  if (local) {
    if (local.arrange) toArray(arrange).map(el => {

      var _index = data.findIndex(_el => _el == el)
      if (_index > -1) {

        var _el = data[index]
        data[index] = el
        data[_index] = _el
        index += 1
      }
    })
    
    if (local.sort) {
      
      var _sorted = data.slice(index).sort()
      data = data.slice(0, index)
      data.push(..._sorted)
    }
  }
  return data
}

module.exports = { createTags }

},{"./clone":40,"./createComponent":47,"./execute":60,"./generate":68,"./toApproval":108,"./toArray":109,"./toHtml":117}],51:[function(require,module,exports){
const {update} = require("./update")
const {toArray} = require("./toArray")
const {clone} = require("./clone")

const createView = ({ view, id }) => {

  var local = window.value[id]
  var global = window.global

  if (!view) return
  
  local.children = toArray(clone(global.data.view[view]))

  // update
  update({ id })
}

module.exports = {createView}

},{"./clone":40,"./toArray":109,"./update":128}],52:[function(require,module,exports){
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { setContent } = require("./setContent")
const { setData } = require("./setData")

const createData = ({ data, id }) => {

  var local = window.value[id]
  var global = window.global[id]

  local.derivations.reduce((o, k, i) => {

    if (i === local.derivations.length - 1) return o[k] = data
    return o[k]

  }, global[local.Data])
}

const clearData = ({ id, e, clear = {} }) => {

  var local = window.value[id]
  var global = window.global

  if (!global[local.Data]) return
  
  var path = clear.path
  path = path ? path.split(".") : clone(local.derivations)
  path.push('delete()')
  
  reducer({ id, e, path, object: global[local.Data] })

  setContent({ id })
  console.log("data removed", global[local.Data])
}

module.exports = { createData, setData, clearData }

},{"./clone":40,"./reducer":89,"./setContent":97,"./setData":98}],53:[function(require,module,exports){
const decode = ({ _window, string }) => {

  if (typeof string !== "string") return string
  
  var global = _window ? _window.global : window.global
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

  return string
}

module.exports = {decode}

},{}],54:[function(require,module,exports){
const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")
// const { generate } = require("./generate")

const defaultInputHandler = ({ id }) => {

  var local = window.value[id]
  var global = window.global

  if (!local) return
  if (local.type !== "Input") return

  // checkbox input
  if (local.input && local.input.type === "checkbox") {

    if (local.data === true) local.element.checked = true

    var myFn = (e) => {

      // local doesnot exist
      if (!window.value[id]) return e.target.removeEventListener("change", myFn)

      var data = e.target.checked
      local.data = data

      if (global[local.Data] && local.derivations[0] !== "") {

        // reset Data
        setData({ id, data })
      }
    }

    return local.element.addEventListener("change", myFn)
  }

  if (local.input && local.input.type === "number")
  local.element.addEventListener("mousewheel", (e) => e.target.blur())

  // readonly
  if (local.readonly) return

  local.element.addEventListener("keydown", (e) => {
    if (e.keyCode == 13 && !e.shiftKey) e.preventDefault()
  })
  
  var myFn = async (e) => {
    
    e.preventDefault()
    var value = e.target.value

    // VAR[id] doesnot exist
    if (!window.value[id]) return e.target.removeEventListener("input", myFn)
    
    if (!local["preventDefault"]) {
      
      // for number inputs, strings are rejected
      if (local.input && local.input.type === "number") {

        value = parseFloat(value)

        if (isNaN(value) || local.data === "free") return local.input.value = value.slice(0, -1)
        if (local.input.min > value) value = local.input.min
        else if (local.input.max < value) value = local.input.max

        local.input.value = value
      }

      // for uploads
      if (local.input.type === "file") return global.upload = e.target.files
      /* if (local.input.type === "file") {

        global.upload = local.upload = {}

        value = e.target.files
        if (value.length === 0) return

        // add files to global for saving
        const readFile = (file) => {
          return new Promise(res => {

            let myReader = new FileReader()
            myReader.onloadend = () => res(myReader.result)
            myReader.readAsDataURL(file)
          })
        }

        var file = await readFile(value[0])
        var fileName = `${local.input.title || Date.now()}-${generate()}`
        var fileType = file.substring(file.indexOf("/") + 1, file.indexOf("base64"))

        return global.upload = local.upload = { file, fileName, src: value[0], fileType }
      } */

      // rating input
      // if (local.class.includes("rating__input")) value = local.element.getAttribute("defaultValue")
      
      if (local.Data && (local.input ? !local.input.preventDefault : true)) setData({ id, data: { value } })
    }

    // resize
    resize({ id })

    // arabic values
    isArabic({ id, value })
    
    console.log(value, global[local.Data], local.derivations)
  }

  local.element.addEventListener("input", myFn)
}

module.exports = { defaultInputHandler }
},{"./data":52,"./isArabic":76,"./resize":93}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")

const droplist = ({ id, e }) => {

  var value = window.value
  var local = window.value[id]

  var dropList = value["droplist"]
  var isButton = local.isButton
  
  // items
  var items = clone(local.droplist.items) || []
  dropList.derivations = clone(local.derivations)
  dropList.Data = local.Data
  
  // path & derivations
  if (local.droplist.path)
  dropList.derivations.push(...local.droplist.path.split("."))

  // input id
  var input_id = local.type === "Input" ? local.id : ""
  if (!input_id) {
    
    input_id = local.element.getElementsByTagName("INPUT")[0]
    if (input_id) input_id = input_id.id
  }
  
  // items
  if (typeof items === "string")
  items = toValue({ id, e, value: items })
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children = clone(items).map(item => {

      return {
        type: `Item?${toString(local.droplist.item)};caller=${id};text.text=${item}`,
        controls: [...(local.droplist.controls || []), {
          event: `click?():${isButton ? `${id}-text` : id}.val()=${item}<<!${local.droplist.disabled};action.resize:${id};().data()=${item}<<${isButton}?():${id}.droplist.readonly.not();!().readonly;global().droplist-positioner=${id}`,
          actions: [
            `?().data()=${item}?!():${id}.lang;!():${id}.currency;!():${id}.day;!():${id}.duration;${!local.droplist.isMap}`,
            // for lang & currency droplists
            `?().data().${item}=():${input_id}.data();():${input_id}.data().delete();():${input_id}.derivations=():${input_id}.derivations.pull():[().derivations.length().subs():1].push():${item}?const.${input_id};():${id}.lang||():${id}.currency||():${id}.duration||():${id}.day;():${input_id}.derivations.lastIndex()!=${item}`,
            `focus:${input_id};click:${input_id}??${input_id}.isdefined()`,
            `update:[():${id}.parent().parent().id]?global().opened-maps.push():[():${id}.derivations.join():-]<<${item}.is():array.or():[${item}.is():map];():${id}.data()=if():[${item}.is():controls.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:event:_string]].elif():[${item}.is():controls]:[_map:event:_string].elif():[${item}.is():children.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:type:_string]].elif():[${item}.is():children]:[_map:type:_string].elif():[${item}.is():string]:_string.elif():[${item}.is():timestamp]:[today().getTime().num()].elif():[${item}.is():number]:0.elif():[${item}.is():boolean]:[true.bool()].elif():[${item}.is():array]:_array.elif():[${item}.is():map]:[_map:_string:_string];():droplist.style().opacity.eq():0;():droplist.style().transform.eq():[scale(0.5)];():droplist.style().pointerEvents.eq():none;():droplist.children().map():[style().pointerEvents.eq():none];global().droplist-positioner.delete();timer():[():droplist.val().eq():_string]:200?${item}.isnot():[():${id}.data().type()]`
          ]
        }]
      }
    })
    
  } else dropList.children = []

  dropList.positioner = dropList.caller = id
  dropList.unDeriveData = true

  update({ id: "droplist" })
}

module.exports = { droplist }

},{"./clone":40,"./toString":124,"./toValue":126,"./update":128}],57:[function(require,module,exports){
const { clearValues } = require("./clearValues")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { removeDuplicates } = require("./removeDuplicates")
const { generate } = require("./generate")
const { focus } = require("./focus")

var duplicate = ({ duplicate = {}, id }) => {
  
  const { createElement} = require("./createElement")
  const { starter} = require("./starter")
  const { setElement} = require("./setElement")

  var local = window.value[id]
  var global = window.global

  var localID = id, path = [], language, currency

  if (global[local.Data]) {
    
    var keys = clone(local.derivations)

    if (!Array.isArray(path))
    keys = duplicate.path ? duplicate.path.split(".") : keys

    // last index refers to data index => must be poped
    if (!isNaN(keys[keys.length - 1])) {

      index = keys[keys.length - 1]
      keys.pop()
    }

    keys.reduce((o, k, i) => {

      if (i === keys.length - 1) {

        if (local.currency) {

          var currencies = []
          Object.entries(o[k]).map(([k, v]) => {
            currencies.push(k)
          })

          var random = []
          global.asset.currency.options.map((currency) => {

            if (!currencies.includes(currency.name.en)) {
              random.push(currency.name.en)
            }
          })

          currency = random[0]
          o[k][currency] = ""

        } else if (local.lang) {

          var langs = []
          Object.entries(o[k]).map(([k, v]) => {
            langs.push(k)
          })

          var random = []
          global.asset.language.options.map((lang) => {
            if (!langs.includes(lang.name.en)) random.push(lang.name.en)
          })

          language = random[0]
          o[k][language] = ""

        } else if (local.key) {

          o[k][local.key] = ""

        } else {

          o[k] = toArray(o[k])
          i = o[k].length - 1

          if (isNaN(local.derivations[local.derivations.length - 1])) {

            if (path.length > 0) path.push(0)
            else local.derivations.push(0)

            var index = local.derivations.length - 1
            var children = [...local.element.children]

            // update length
            children.map((child) => window.value[child.id].derivations.splice(index, 0, 0))
          }

          o[k].push(clone(local.pushData || o[k][i] || ""))
          var index = o[k].length - 1
          o[k][index] = removeDuplicates(clearValues(o[k][index]))
        }
      }

      return o[k]
    }, global[local.Data])
  }

  var length = local.length !== undefined ? local.length : 1
  var id = generate()
  var value = window.value

  value[local.parent].children = toArray(value[local.parent].children)
  value[id] = clone(value[local.parent].children[local.index])
  value[id].id = id
  value[id].parent = local.parent
  value[id].duplicatedElement = true
  value[id].index = local.index
  value[id].derivations = (duplicate.path) ? duplicate.path.split('.') : [...local.derivations]

  var local = value[id]
  local.duplicated = true

  if (value[localID].currency) {

    var type = local.type.split("currency=")[0]
    type += local.type.split("currency=")[1].slice(2)
    type += `;currency=${currency}`
    local.type = type

  } else if (value[localID].lang) {

    var type = local.type.split("lang=")[0]
    type += local.type.split("lang=")[1].slice(2)
    type += `;lang=${language}`
    local.type = type

  } else if (value[localID].originalKeys || local.type.includes("originalKeys=")) {

    // remove originalKeys=[]
    var type = local.type.split("originalKeys=")[0]
    if (local.type.split("originalKeys=")[1]) {
      type += local.type
          .split("originalKeys=")[1]
          .split(";")
          .slice(1)
          .join(";")
    }

    local.type = type

  } else if (value[localID].key) {
    // local.key
  } else {

    var lastIndex = local.derivations.length - 1
    if (!isNaN(local.derivations[lastIndex])) local.derivations[lastIndex] = length
    else local.derivations.push(length)

  }

  // [type]
  if (local.type.slice(0, 1) === "[") {

    local.type = local.type.slice(1)
    var type = local.type.split("]")
    local.type = type[0] + local.type.split("]").slice(1).join(']')

  }

  // path
  if (local.type.includes("path=")) {

    var type = local.type.split("path=")
    local.type = type[0]
    type = type[1].split(";").slice(1)
    local.type += type.join(";")

  }
  
  // create element => append child
  var newcontent = document.createElement("div")
  newcontent.innerHTML = createElement({ id })

  while (newcontent.firstChild) {

    id = newcontent.firstChild.id
    value[local.parent].element.appendChild(newcontent.firstChild)

    // starter
    setElement({ id })
    starter({ id })
  }

  // update length
  [...value[local.parent].element.children].map((child) => {

    var id = child.id
    value[id].length = length + 1
  })

  // focus
  focus({ id })
}

var duplicates = ({ data, id }) => {}

module.exports = {duplicate, duplicates}

},{"./clearValues":39,"./clone":40,"./createElement":49,"./focus":66,"./generate":68,"./removeDuplicates":92,"./setElement":99,"./starter":102,"./toArray":109}],58:[function(require,module,exports){
const axios = require("axios");
const { toString } = require("./toString")
const { toAwait } = require("./toAwait")

const erase = async ({ id, e, erase = {}, ...params }) => {

  var local = window.value[id]
  var collection = erase.collection = erase.collection || erase.path

  // no id
  if (!erase.id && !erase.doc) return
  erase.doc = erase.doc || erase.id
  
  var { data } = await axios.delete(`https://us-central1-bracketjs.cloudfunctions.net/app/api/${collection}?${toString({ erase })}`)
  
  local.erase = data

  console.log(data)

  toAwait({ id, e, params })
}

module.exports = { erase }

/*
const { toAwait } = require("./toAwait")

module.exports = {
  erase: async ({ erase = {}, id, e, ...params }) => {
        
    var local = window.value[id]
    var global = window.global

    var collection = erase.path
    var ref = global.db.collection(collection)

    if (!erase.id) return
    
    ref.doc(erase.id).delete().then(async () => {

      local.erase = {
        success: true,
        message: `Data erased successfuly!`,
      }
      
      if (erase.type === 'file') await global.storage.child(`images/${erase.id}`).delete()
            
      console.log(local.erase)
                  
      // await params
      toAwait({ id, e, params })

    }).catch(error => {

      local.erase = {
          success: false,
          message: error,
      }
      
      console.log(local.erase)
    })
  }
}
*/
},{"./toAwait":110,"./toString":124,"axios":132}],59:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const events = [
  "click",
  "mouseenter",
  "mouseleave",
  "mousedown",
  "mouseup",
  "touchstart",
  "touchend"
]

const addEventListener = ({ _window, controls, id, req, res }) => {
  
  const { execute } = require("./execute")

  var local = _window ? _window.value[id] : window.value[id]
  var mainID = id

  var events = toCode({ _window, id, string: controls.event }).split("?")
  var _idList = toValue({ id, value: events[3] || id })

  // droplist
  var droplist = (events[1] || "").split(";").find(param => param === "droplist()")
  if (droplist) {
    
    local.droplist.controls = local.droplist.controls || []
    return local.droplist.controls.push({
      event: events.join("?").replace("droplist()", ""),
      actions: controls.actions
    })
  }

  // actionlist
  var actionlist = (events[1] || "").split(";").find(param => param === "actionlist()")
  if (actionlist) {
    
    local.actionlist.controls = local.actionlist.controls || []
    return local.actionlist.controls.push({
      event: events.join("?").replace("actionlist()", ""),
      actions: controls.actions
    })
  }

  // popup
  var popup = (events[1] || "").split(";").find(param => param === "popup()")
  if (popup) {
    
    local.popup = typeof local.popup === "object" ? local.popup : {}
    local.popup.controls = local.popup.controls || []

    return local.popup.controls.push({
      event: events.join("?").replace("popup()", ""),
      actions: controls.actions
    })
  }

  events[0].split(";").map(event => {
    
    var timer = 0, idList
    var once = events[1] && events[1].includes('once')

    // action:id
    var eventid = event.split(":")[1]
    if (eventid) idList = toValue({ _window, req, res, id, value: eventid })
    else idList = clone(_idList)

    // timer
    timer = event.split(":")[2] || 0
    
    // event
    event = event.split(":")[0]

    if (!event || !local) return
    clearTimeout(local[`${event}-timer`])

    // add event listener
    toArray(idList).map(id => {

      var _local = _window ? _window.value[id] : window.value[id]
      if (!_local) return

      var myFn = async (e) => {

        // body
        if (id === "body") id = mainID
        var __local = _window ? _window.value[id] : window.value[id]
        
        // VALUE[id] doesnot exist
        if (!__local) return e.target.removeEventListener(event, myFn)
        
        // approval
        var approved = toApproval({ _window, req, res, string: events[2], e, id: mainID })
        if (!approved) return

        // once
        if (once) e.target.removeEventListener(event, myFn)
        
        // params
        toParam({ _window, req, res, string: events[1], e, id: mainID, mount: true })

        // break
        if (local.break) return
        
        // execute
        if (controls.actions) await execute({ _window, req, res, controls, e, id: mainID })

        // awaiters
        if (local.await && local.await.length > 0) 
        toParam({ _window, req, res, id, e, string: local.await.join(";"), mount: true })
      }
      
      // onload event
      if (event === "loaded" || event === "loading" || event === "beforeLoading") return myFn({ target: _local.element })

      var myFn1 = (e) => {
        
        local[`${event}-timer`] = setTimeout(async () => {

          // body
          if (id === "body") id = mainID
          var __local = _window ? _window.value[id] : window.value[id]

          if (once) e.target.removeEventListener(event, myFn)

          // VALUE[id] doesnot exist
          if (!__local) return e.target.removeEventListener(event, myFn)
          
          // approval
          var approved = toApproval({ string: events[2], e, id: mainID })
          if (!approved) return

          // params
          toParam({ string: events[1], e, id: mainID, mount: true })
          
          if (controls.actions) await execute({ controls, e, id: mainID })

          // await params
          if (local.await && local.await.length > 0)
          toParam({ id, e, string: local.await.join(";"), mount: true })

        }, timer)
      }

      // elements
      _local.element.addEventListener(event, myFn1)
    })
  })
}

const defaultEventHandler = ({ id }) => {

  var local = window.value[id]
  var global = window.global

  local.touchstart = false
  local.mouseenter = false
  local.mousedown = false

  if (local.link) local.element.addEventListener("click", (e) => e.preventDefault())

  events.map((event) => {

    var setEventType = (e) => {

      if (!window.value[id]) return e.target.removeEventListener(event, setEventType)

      if (event === "mouseenter") local.mouseenter = true
      else if (event === "mouseleave") local.mouseenter = false
      else if (event === "mousedown") {
        
        local.mousedown = true
        window.value["tooltip"].element.style.opacity = "0"
        clearTimeout(global["tooltip-timer"])
        delete global["tooltip-timer"]

      } else if (event === "mouseup") local.mousedown = false
      else if (event === "touchstart") local.touchstart = true
      else if (event === "touchend") local.touchstart = false
    }

    local.element.addEventListener(event, setEventType)
  })
}

module.exports = { addEventListener, defaultEventHandler }

},{"./clone":40,"./execute":60,"./toApproval":108,"./toArray":109,"./toCode":113,"./toParam":120,"./toValue":126}],60:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const _method = require("./function")
const { toCode } = require("./toCode")

const execute = ({ _window, controls, actions, e, id, params }) => {

  var local = (_window ? _window.value[id] : window.value[id]) || {}
  var _params = params, localId = id

  if (controls) actions = controls.actions
  if (local) local.break = false

  // execute actions
  toArray(actions).map(_action => {
    _action = toCode({ _window, string: _action, e })
    
    var awaiter = []
    
    // stop after actions
    if (local && local.break) return

    var approved = true
    var actions = _action.split("?")
    var params = actions[1]
    var conditions = actions[2]
    var idList = actions[3] || localId

    // id list
    idList = toValue({ _window, id, value: idList, e })
    
    actions = actions[0].split(";")

    // approval
    if (conditions) approved = toApproval({ _window, string: conditions, params, id: localId, e })
    if (!approved) return

    // params
    params = toParam({ _window, string: params, e, id: localId })
    if (_params) params = {..._params, ...params}

    // break
    local.break = params.break
    delete params.break

    // action does not exist
    actions.map(action => {

      // action === name:id:timer<<condition
      var caseCondition = action.split('<<')[1]
      var name = action.split('<<')[0]
      var actionid = name.split(":")[1]
      var timer = name.split(":")[2]
      if (timer) timer = parseInt(timer)
      name = name.split(':')[0]

      // action:id
      if (actionid) actionid = toValue({ _window, value: actionid, params, id: localId, e })
      
      const myFn = () => {
        var approved = true

        // asyncer & awaiter
        var keys = name.split("."), isAwaiter, isAsyncer
        if (keys.length > 1) keys.map(k => {
  
          if (k === "async()") isAsyncer = true
          else if (k === "await()") {
            isAwaiter = true
            awaiter.push(action.split("await().")[1])
          }
        })

        if (isAwaiter || isAsyncer) name = name.split(".")[1]
        if (isAwaiter) return

        // case condition approval
        if (caseCondition) approved = toApproval({ _window, string: caseCondition, params, id: localId, e })
        if (!approved) return
        
        if (_method[name]) toArray(actionid ? actionid : idList).map(async id => {
          
          if (typeof id !== "string") return

          // id = value.path
          if (id.indexOf(".") > -1) id = toValue({ _window, value: id, e, id: localId })
          
          // component does not exist
          if (!id || !window.value[id]) return

          if (isAsyncer) {
            params.awaiter = awaiter
            params.asyncer = isAsyncer
          }
          
          await _method[name]({ _window, ...params, e, id })
        })
      }

      if (timer !== undefined) {

        if (local) {

          var _name = name.split('.')[1] || name.split('.')[0]
          if (params["setInterval()"]) local[`${_name}-interval`] = setInterval(myFn, timer)
          else local[`${_name}-timer`] = setTimeout(myFn, timer)

        } else {

          if (params["setInterval()"]) setInterval(myFn, timer)
          else setTimeout(myFn, timer)
        }

      } else myFn()
    })
  })
}

module.exports = { execute }

},{"./function":67,"./toApproval":108,"./toArray":109,"./toCode":113,"./toParam":120,"./toValue":126}],61:[function(require,module,exports){
module.exports = {
    exportJson: ({ data, filename }) => {
        
        var dataStr = JSON.stringify(data, null, 2)
        var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

        var exportFileDefaultName = `${filename || `exported-data-${(new Date()).getTime()}`}.json`

        var linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
        // linkElement.delete()
    }
}
},{}],62:[function(require,module,exports){
const { toValue } = require("./function")

module.exports = {
    fileReader : ({ read: { file, reduce }, id }) => {

        var reader = new FileReader()
        reader.onload = e => toValue({ id, value: reduce, e })
        reader.readAsDataURL(file)
    }
}
},{"./function":67}],63:[function(require,module,exports){
module.exports = {
  fill: ({ id }) => {
    
  }
}

},{}],64:[function(require,module,exports){
const { isEqual } = require("./isEqual")
const { toArray } = require("./toArray")
const { toAwait } = require("./toAwait")
const { compare } = require("./compare")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { clone } = require("./clone")

const filter = ({ filter = {}, id, e, ...params }) => {

  var local = window.value[id]
  var global = window.global
  if (!local) return

  var Data = filter.Data || local.Data
  var options = global[`${Data}-options`]
  if (!options) options = global[`${Data}-options`] = {}

  var path = toArray(filter.path)
  path = path.map(path => path.split("."))

  var backup = filter.backup
  var value = filter.value

  if (!value || isEqual(options.filter, value)) {

    options.filter = clone(value)
    data = backup

  } else {

    // reset backup filter options
    options.filter = clone(value)
    
      // remove spaces
    Object.entries(value).map(([k, v]) => value[k] = v.toString().split(" ").join("").toLowerCase())
    
    var data = []
    data.push(
      ...backup.filter(data => {
        return !Object.entries(value).map(([o, v]) => 
        compare(path
        .map(path => (path
        .reduce((o, k) => o[k], data) || '')
        .toString()
        .toLowerCase()
        .split(" ")
        .join("")
        )
        .join(""),
        toFirebaseOperator(o), v))
        .join("")
        .includes("false")
      })
    )
  }
  
  global[Data] = data
  local.filter = { success: true, data }

  // await params
  toAwait({ id, e, params })
}

module.exports = {filter}

},{"./clone":40,"./compare":42,"./isEqual":77,"./toArray":109,"./toAwait":110,"./toFirebaseOperator":116}],65:[function(require,module,exports){
require('dotenv').config()
//var config = JSON.parse(process.env.FIREBASE_CONFIG)
//var firebase = require("firebase-admin").initializeApp(config)

module.exports = {}//firebase
},{"dotenv":161}],66:[function(require,module,exports){
const focus = ({ id }) => {

  var local = window.value[id]
  if (!local) return

  var isInput = local.type === "Input" || local.type === "Textarea"
  if (isInput) local.element.focus()
  else {
    if (local.element) {
      let childElements = local.element.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = local.element.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].focus()

        var _local = window.value[childElements[0].id]
        // focus to the end of input
        var value = _local.element.value
        _local.element.value = ""
        _local.element.value = value

        return
      }
    }
  }

  // focus to the end of input
  var value = local.element.value
  local.element.value = ""
  local.element.value = value
}

module.exports = {focus}

},{}],67:[function(require,module,exports){
const {clearValues} = require("./clearValues")
const {clone} = require("./clone")
const {derive} = require("./derive")
const {duplicate, duplicates} = require("./duplicate")
const {getParam} = require("./getParam")
const {isArabic} = require("./isArabic")
const {isEqual} = require("./isEqual")
const {merge} = require("./merge")
const {overflow} = require("./overflow")
const {toApproval} = require("./toApproval")
const {toComponent} = require("./toComponent")
const {toId} = require("./toId")
const {toParam} = require("./toParam")
const {toString} = require("./toString")
const {update, removeChildren} = require("./update")
const {createDocument} = require("./createDocument")
const {toControls} = require("./toControls")
const {toArray} = require("./toArray")
const {generate} = require("./generate")
const {createElement} = require("./createElement")
const {addEventListener} = require("./event")
const {execute} = require("./execute")
const {controls} = require("./controls")
const {setContent} = require("./setContent")
const {starter} = require("./starter")
const {setState} = require("./state")
const {setPosition} = require("./setPosition")
const {droplist} = require("./droplist")
const {createView} = require("./createView")
const {filter} = require("./filter")
const {remove} = require("./remove")
const {focus} = require("./focus")
const {sort} = require("./sort")
const {log} = require("./log")
const {search} = require("./search")
const {textarea} = require("./textarea")
const {save} = require("./save")
const {erase} = require("./erase")
const {toValue} = require("./toValue")
const {toPath} = require("./toPath")
const {reducer} = require("./reducer")
const {toStyle} = require("./toStyle")
const {preventDefault} = require("./preventDefault")
const {createComponent} = require("./createComponent")
const {getJsonFiles} = require("./getJsonFiles")
const {toHtml} = require("./toHtml")
const {setData} = require("./setData")
const {defaultInputHandler} = require("./defaultInputHandler")
const {createActions} = require("./createActions")
const {blur} = require("./blur")
const {fill} = require("./fill")
const {toAwait} = require("./toAwait")
const {close} = require("./close")
const {pause} = require("./pause")
const {play} = require("./play")
const {note} = require("./note")
const {toCode} = require("./toCode")
const {isPath} = require("./isPath")
const {toNumber} = require("./toNumber")
const {capitalize} = require("./capitalize")
const {setElement} = require("./setElement")
const {toFirebaseOperator} = require("./toFirebaseOperator")
const {popup} = require("./popup")
const {keys} = require("./keys")
const {values} = require("./values")
const {toggleView} = require("./toggleView")
const {upload} = require("./upload")
const {compare} = require("./compare")
const {toCSV} = require("./toCSV")
const {decode} = require("./decode")
const {route} = require("./route")
const {contentful} = require("./contentful")
const {importJson} = require("./importJson")
const firebase = require("./firebase")
const {getDateTime} = require("./getDateTime")
const {insert} = require("./insert")
const {exportJson} = require("./exportJson")
const {switchMode} = require("./switchMode")
const {setCookie, getCookie} = require("./cookie")
const {getDaysInMonth} = require("./getDaysInMonth")
const {reload} = require("./reload")
const {fileReader} = require("./fileReader")
const {position, getPadding} = require("./position")
const {searchArduino} = require("./arduino")
const {
  setStyle,
  resetStyles,
  toggleStyles,
  mountAfterStyles,
} = require("./style")
const {resize, dimensions, converter} = require("./resize")
const {createData, clearData} = require("./data")

module.exports = {
  searchArduino,
  switchMode,
  getDaysInMonth,
  importJson,
  converter,
  getCookie,
  setCookie,
  position,
  getPadding,
  route,
  decode,
  contentful,
  firebase,
  reload,
  toCSV,
  compare,
  setElement,
  clearValues,
  clone,
  derive,
  duplicate,
  duplicates,
  getJsonFiles,
  search,
  getParam,
  isArabic,
  isEqual,
  merge,
  overflow,
  addEventListener,
  setState,
  toApproval,
  toComponent,
  toId,
  toParam,
  fileReader,
  toString,
  update,
  execute,
  removeChildren,
  createDocument,
  toArray,
  generate,
  createElement,
  controls,
  textarea,
  setStyle,
  resetStyles,
  toggleStyles,
  mountAfterStyles,
  resize,
  dimensions,
  createData,
  setData,
  clearData,
  setContent,
  starter,
  createComponent,
  setPosition,
  droplist,
  filter,
  createView,
  createActions,
  blur,
  toAwait,
  exportJson,
  toControls,
  remove,
  defaultInputHandler,
  focus,
  sort,
  log,
  save,
  erase,
  toCode,
  toPath,
  toValue,
  reducer,
  preventDefault,
  toStyle,
  toHtml,
  capitalize,
  fill,
  note,
  pause,
  play,
  close,
  isPath,
  toNumber,
  popup,
  getDateTime,
  keys,
  values,
  toFirebaseOperator,
  upload,
  toggleView,
  insert
}
},{"./arduino":36,"./blur":37,"./capitalize":38,"./clearValues":39,"./clone":40,"./close":41,"./compare":42,"./contentful":43,"./controls":44,"./cookie":45,"./createActions":46,"./createComponent":47,"./createDocument":48,"./createElement":49,"./createView":51,"./data":52,"./decode":53,"./defaultInputHandler":54,"./derive":55,"./droplist":56,"./duplicate":57,"./erase":58,"./event":59,"./execute":60,"./exportJson":61,"./fileReader":62,"./fill":63,"./filter":64,"./firebase":65,"./focus":66,"./generate":68,"./getDateTime":69,"./getDaysInMonth":70,"./getJsonFiles":71,"./getParam":72,"./importJson":74,"./insert":75,"./isArabic":76,"./isEqual":77,"./isPath":78,"./keys":79,"./log":80,"./merge":81,"./note":82,"./overflow":83,"./pause":84,"./play":85,"./popup":86,"./position":87,"./preventDefault":88,"./reducer":89,"./reload":90,"./remove":91,"./resize":93,"./route":94,"./save":95,"./search":96,"./setContent":97,"./setData":98,"./setElement":99,"./setPosition":100,"./sort":101,"./starter":102,"./state":103,"./style":104,"./switchMode":105,"./textarea":107,"./toApproval":108,"./toArray":109,"./toAwait":110,"./toCSV":111,"./toCode":113,"./toComponent":114,"./toControls":115,"./toFirebaseOperator":116,"./toHtml":117,"./toId":118,"./toNumber":119,"./toParam":120,"./toPath":121,"./toString":124,"./toStyle":125,"./toValue":126,"./toggleView":127,"./update":128,"./upload":129,"./values":130}],68:[function(require,module,exports){
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

const generate = (length) => {

  var result = ""
  if (!length) length = 5

  var charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  
  return result
}

module.exports = {generate}

},{}],69:[function(require,module,exports){
module.exports = {
    getDateTime: (time) => {
        
        var sec = parseInt(time.getSeconds())
        var min = parseInt(time.getMinutes())
        var hrs = parseInt(time.getHours())
        var day = parseInt(time.getDate())
        var month = parseInt(time.getMonth()) + 1
        var year = parseInt(time.getFullYear())
        
        if (sec < 10) sec = "0" + sec
        if (min < 10) min = "0" + min
        if (hrs < 10) hrs = "0" + hrs
        if (day < 10) day = "0" + day
        if (month < 10) month = "0" + month
        if (year < 10) year = "0" + year
        
        return `${year}-${month}-${day}T${hrs}:${min}:${sec}`
    }
}
},{}],70:[function(require,module,exports){
module.exports = {
    getDaysInMonth: (stampTime) => {
        return new Date(stampTime.getFullYear(), stampTime.getMonth() + 1, 0).getDate()
    }
}
},{}],71:[function(require,module,exports){
(function (process){(function (){
const path = require("path");
const fs = require("fs");

const getJsonFiles = (folder, fileName, params = {}) => {
  
  let data = {};
  const folderPath = path.join(process.cwd(), folder);

  if (fileName) {
    data = JSON.parse(fs.readFileSync(path.join(folderPath, fileName)));
  } else {
    fs.readdirSync(folderPath).forEach((fileName) => {
      const file = fs.readFileSync(path.join(folderPath, fileName));
      fileName = fileName.split(".json")[0];
      data[fileName] = JSON.parse(file);
    });
  }

  if (params.id) {
    data = data.filter((data) => params.id.find((id) => id === data.id));
  }

  return data;
};

module.exports = {getJsonFiles};

}).call(this)}).call(this,require('_process'))
},{"_process":4,"fs":1,"path":3}],72:[function(require,module,exports){
const { toParam } = require("./toParam")

const getParam = ({ string, param, defValue }) => {

  if (!string) return defValue
  if (!string.includes("?")) return defValue

  string = string.split("/?").join("_question")
  string = string.split("?")[1]
  if (!string) return defValue

  string = string.split(";")
  string = string.find((el) => el.includes(param))
  if (!string) return defValue

  let params = toParam({ string })
  if (params[param]) value = params[param]

  return value
}

module.exports = {getParam}

},{"./toParam":120}],73:[function(require,module,exports){
module.exports = {
    getType: (value) => {
        if (typeof value === "string") {
            
            if (value.length >= 10 && value.length <=13 && !isNaN(value) && value.slice(0, 2) !== "00") return "timestamp"
            return "string"
        }
        if (typeof value === "number") {
            
            if ((value + "").length >= 10 && (value + "").length <= 13 && (value + "").slice(0, 2) !== "00") return "timestamp"
            return "number"
        }
        if (typeof value === "object" && Array.isArray(value)) return "array"
        if (typeof value === "object") return "map"
        if (typeof value === "boolean") return "boolean"
        if (typeof value === "function") return "function"
    }
}
},{}],74:[function(require,module,exports){
const { toAwait } = require("./toAwait")

const getJson = (url) => {

    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", url, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

const importJson = ({ id, e, ...params }) => {
    
    var global = window.global
    global.import = {}
    var inputEl = document.createElement('input')
    inputEl.style.position = "absolute"
    inputEl.style.top = "-1000px"
    inputEl.style.left = "-1000px"
    inputEl.type = "file"
    inputEl.accept = "application/JSON"
    document.body.appendChild(inputEl)
    setTimeout(() => {

        inputEl.addEventListener("change", (e) => {
            
            var reader = new FileReader()
            reader.onload = (e) => {
                
                global.import.data = JSON.parse(e.target.result)
                toAwait({ id, e, params })
            }
            reader.readAsText(e.target.files[0])
        })

        inputEl.click()
    }, 200)
}

module.exports = {importJson, getJson}
},{"./toAwait":110}],75:[function(require,module,exports){
const { clone } = require("./clone")
const { createElement } = require("./createElement")
const { removeChildren } = require("./update")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toAwait } = require("./toAwait")
const { toParam } = require("./toParam")

module.exports = {
  insert: ({ id, insert, ...params }) => {
    
    var { index, value = {}, el, elementId, component, replace, path, data } = insert
    var local = window.value[id], lDiv
    
    if (index === undefined) index = local.element.children.length
    
    if (component || replace) {

      var _local = clone(component || replace)
      if (data) _local.data = data
      if (path) _local.derivations = (Array.isArray(path) ? path : path.split(".")) || []

      var innerHTML = toArray(_local)
      .map((child, index) => {

        var id = child.id || generate()
        window.value[id] = child
        window.value[id].id = id
        window.value[id].index = index
        window.value[id].parent = local.id
        window.value[id].style = window.value[id].style || {}
        window.value[id].reservedStyles = toParam({ id, string: window.value[id].type.split("?")[1] || "" }).style || {}
        window.value[id].style.transition = null
        window.value[id].style.opacity = "0"
        
        return createElement({ id })

      }).join("")
      
      lDiv = document.createElement("div")
      document.body.appendChild(lDiv)
      lDiv.style.position = "absolute"
      lDiv.style.opacity = "0"
      lDiv.style.left = -1000
      lDiv.style.top = -1000
      lDiv.innerHTML = innerHTML

      el = lDiv.children[0]
      window.value[el.id].parent = local.id

    } else {
      
      elementId = elementId || value.id || el && el.id
      el = el || value.el || window.value[elementId].el
    }

    if (replace) {

      var _id = replace.id
      removeChildren({ id: _id })
      replace.element.remove()
      delete window.value[_id]
    }

    if (index >= local.element.children.length) local.element.appendChild(el)
    else local.element.insertBefore(el, local.element.children[index])

    setElement({ id: el.id })
    setTimeout(() => {
      starter({ id: el.id })

      window.value[el.id].style.transition = window.value[el.id].element.style.transition = window.value[el.id].reservedStyles.transition || null
      window.value[el.id].style.opacity = window.value[el.id].element.style.opacity = window.value[el.id].reservedStyles.opacity || "1"
      delete window.value[el.id].reservedStyles
    }, 0)
  
    // await params
    toAwait({ id, params })
    
    if (lDiv) {
      document.body.removeChild(lDiv)
      lDiv = null
    }
  }
}
},{"./clone":40,"./createElement":49,"./generate":68,"./setElement":99,"./starter":102,"./toArray":109,"./toAwait":110,"./toParam":120,"./update":128}],76:[function(require,module,exports){
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[A-Za-z]/

const isArabic = ({ id, value }) => {

  var local = window.value[id]
  var text = value || local.element.value || local.element.innerHTML
  if (!text) return

  var isarabic = arabic.test(text)
  var isenglish = english.test(text)

  if (isarabic && !isenglish) {

    local.element.classList.add("arabic")
    local.element.style.textAlign = "right"
    if (local["placeholder-ar"]) local.element.placeholder = local["placeholder-ar"]

  } else {

    if (local.element.className.includes("arabic")) local.element.style.textAlign = "left"
    local.element.classList.remove("arabic")
    if (local["placeholder"]) local.element.placeholder = local["placeholder"]

  }

  return isarabic && !isenglish
}

module.exports = { isArabic }

},{}],77:[function(require,module,exports){
const isEqual = function(value, other) {
  // if (value === undefined || other === undefined) return false

  // string || boolean || number
  if (typeof value !== "object" && typeof other !== "object") {
    return value == other;
  }

  // html elements
  if (value && other) {
    if (
      value.nodeType === Node.ELEMENT_NODE &&
      other.nodeType === Node.ELEMENT_NODE
    ) {
      return (
        value.isSameNode(other) ||
        value.contains(other) ||
        other.contains(value)
      );
    } else if (
      (value.nodeType !== Node.ELEMENT_NODE &&
        other.nodeType === Node.ELEMENT_NODE) ||
      (value.nodeType === Node.ELEMENT_NODE &&
        other.nodeType !== Node.ELEMENT_NODE)
    ) {
      return false;
    }
  }

  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  const valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  const otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  const compare = function(item1, item2) {
    // Get the object type
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === "[object Function]") {
        if (item1.toString() != item2.toString()) return false;
      } else {
        if (item1 != item2) return false;
      }
    }
  };

  // Compare properties
  if (type === "[object Array]") {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};

module.exports = {isEqual};

},{}],78:[function(require,module,exports){
module.exports = {
  isPath: ({ path }) => {
    path = path.split(".")

    if (path.length === 1 || path.length === 0) return false;
    else if (
      /\d/.test(path[0]) ||
      /\s/.test(path[0]) ||
      (path[1] && (path[1].includes("rem") || path[1].includes("px")))
    ) {
      return false;
    }
    return true;
  },
};

},{}],79:[function(require,module,exports){
module.exports = {
    keys: (object) => {
        return Object.keys(object)
    }
}
},{}],80:[function(require,module,exports){
const log = ({ log }) => {
  console.log( log || 'here')
}

module.exports = {log}

},{}],81:[function(require,module,exports){
const { toArray } = require("./toArray")
const { clone } = require("./clone")

const merge = (objects) => {

  objects = clone(objects)
  if (typeof objects !== "object") return objects

  var merged = toArray(objects[0]).flat()

  objects.shift()

  objects.map((obj) => {
    merged.push(...toArray(obj).flat())

    if (!Array.isArray(obj) && typeof obj === "object") {
      Object.entries(obj).map(([key, value]) => {

        if (merged[key]) {

          if (typeof value === "string" || typeof value === "number") {

            merged[key] = toArray(merged[key])
            merged[key].push(value)

          } else if (Array.isArray(value)) {

            merged[key].push(...value)

          } else if (typeof value === "object") {

            merged[key] = merge([value, merged[key]])

          }

        } else merged[key] = value
      })
    }
  })

  return merged
}

const override = (obj1, obj2) => {
  obj1 = obj1 || {}

  Object.entries(obj2).map(([key, value]) => {

    if (obj1[key]) {
      if (!Array.isArray(value) && typeof value === "object") {

        obj1[key] = override(obj1[key], value)

      } else obj1[key] = value

    } else obj1[key] = value

  })

  return obj1
}

module.exports = { merge, override }

},{"./clone":40,"./toArray":109}],82:[function(require,module,exports){
const note = ({ note: _note }) => {

  var value = window.value
  var note = value["action-note"]
  var type = _note.type || "success"
  var noteText = value["action-note-text"]
  var backgroundColor = type === "success" 
  ? "#2FB886" : type === "danger" 
  ? "#F66358" : type === "info"
  ? "#47A8F5" : type === "warning"
  && "#FFA92B"
  
  if (!_note) return

  clearTimeout(note["note-timer"])

  noteText.element.innerHTML = _note.text

  var width = note.element.offsetWidth
  note.element.style.backgroundColor = backgroundColor
  note.element.style.left = `calc(50% - ${width/2}px)`
  note.element.style.transition = "transform .2s"
  note.element.style.transform = "translateY(0)"

  const myFn = () => note.element.style.transform = "translateY(-200%)"

  note["note-timer"] = setTimeout(myFn, 5000)
}

module.exports = { note }

},{}],83:[function(require,module,exports){
const overflow = ({ id }) => {

  var local = window.value[id]

  var width = local.element.clientWidth
  var height = local.element.clientHeight
  var text

  if (local.type === "Input" || local.type === "Textarea") {
    text = local.element.value
  } else if (
    local.type === "Text" ||
    local.type === "Label" ||
    local.type === "Header"
  ) {
    text = local.element.innerHTML
  } else if (local.type === "UploadInput") text = local.element.value

  // create a test div
  let lDiv = document.createElement("div")

  document.body.appendChild(lDiv)

  var pStyle = local.element.style
  var pText = local.data || local.input.value || ""
  var pFontSize = pStyle.fontSize

  if (pStyle != null) {
    lDiv.style = pStyle
  }

  lDiv.style.fontSize = pFontSize
  lDiv.style.position = "absolute"
  lDiv.style.left = -1000
  lDiv.style.top = -1000
  lDiv.style.padding = pStyle.padding

  lDiv.innerHTML = pText

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight,
  }

  document.body.removeChild(lDiv)
  lDiv = null

  var overflowX, overflowY
  
  if (width < lResult.width) overflowX = true
  if (height < lResult.height) overflowY = true

  return [overflowX, overflowY]
}

module.exports = {overflow}

},{}],84:[function(require,module,exports){
const pause = ({ id }) => {

  var local = window.value[id]
  clearTimeout(local["note-timer"])
}

module.exports = {pause}

},{}],85:[function(require,module,exports){
const play = ({ id }) => {

  var local = window.value[id]
  var myFn = () => {
    local.element.style.transform = "translateY(-200%)"
  }

  local["note-timer"] = setTimeout(myFn, 5000)
}

module.exports = {play}

},{}],86:[function(require,module,exports){
const {controls} = require("./controls")
const {update} = require("./update")

const popup = ({ id }) => {
  
  var local = window.value[id]
  var popup = window.value["popup"]
  var popUp = local.popup
  var _controls = popUp.controls
  popup.positioner = id

  /*
  popup.Data = local.Data
  popup.derivations = local.derivations
  popup.unDeriveData = true
  */

  update({ id: "popup" })
  
  // eraser
  if (popUp.type === "eraser") {

    _controls = {
      event: "click",
      actions: `resetStyles:popup;await().note;await().setStyle:mini-window;await().remove:[():mini-window-view.element.children.0.id]:220${popUp.update ? `;await().update:${popUp.update}` : ""};async().erase?note.text=${popUp.note || "Data removed successfully"};()::200.style.display=none;style.opacity=0;erase.path=${popUp.path};erase.id=${popUp.id || "().data().id"};await().global().[().Data]=().Data()._filterById().[${popUp.id ? `any.${popUp.id}` : "().data().id"}.not().[_.id]]`,
    }
  }


  setTimeout(() => {

    // caller
    popup.caller = id
    // window.value["popup-text"].caller = id
    window.value["popup-confirm"].caller = id
    window.value["popup-cancel"].caller = id

    if (popUp.text) window.value["popup-text"].element.innerHTML = popUp.text
    controls({ controls: _controls, id: "popup-confirm" })

  }, 50)
}

module.exports = {popup}

},{"./controls":44,"./update":128}],87:[function(require,module,exports){
const { converter } = require("./resize")

const getPadding = (el) => {
    
    var padding = el.style.padding.split(" ")
    if (padding.length === 1) {
        return padding = {
            top: converter(padding[0]),
            right: converter(padding[0]),
            bottom: converter(padding[0]),
            left: converter(padding[0])
        }
    } else if (padding.length === 2) {
        return padding = {
            top: converter(padding[0]),
            right: converter(padding[1]),
            bottom: converter(padding[0]),
            left: converter(padding[1])
        }
    } else if (padding.length === 4) {
        return padding = {
            top: converter(padding[0]),
            right: converter(padding[1]),
            bottom: converter(padding[2]),
            left: converter(padding[3])
        }
    }
}

const position = (el1, el2) => {

    elPos1 = el1.getBoundingClientRect()
    elPos2 = el2.getBoundingClientRect()

    var el2padding = getPadding(el2)

    var top  = elPos1.top - elPos2.top - el2padding.top
    var left = elPos1.left - elPos2.left - el2padding.left
    
    return { top: Math.round(top), left: Math.round(left) }
}

module.exports = {
    position,
    getPadding
}
},{"./resize":93}],88:[function(require,module,exports){
const preventDefault = ({e}) => {
  e.preventDefault();
};

module.exports = {preventDefault};

},{}],89:[function(require,module,exports){
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { isEqual } = require("./isEqual")
const { capitalize } = require("./capitalize")
const { clone } = require("./clone")
const { toNumber } = require("./toNumber")
const { toPrice } = require("./toPrice")
const { getDateTime } = require("./getDateTime")
const { getDaysInMonth } = require("./getDaysInMonth")
const { getType } = require("./getType")
const { position } = require("./position")
const { decode } = require("./decode")
const { exportJson } = require("./exportJson")
const { importJson } = require("./importJson")
const { toId } = require("./toId")
const { setCookie, getCookie, eraseCookie } = require("./cookie")
const { override } = require("./merge")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")
const { toClock } = require("./toClock")

const reducer = ({ _window, id, path, value, key, params, object, index = 0, _, e, req, res }) => {
    
    const { remove } = require("./remove")
    const { toValue } = require("./toValue")
    const { execute } = require("./execute")

    var local = _window ? _window.value[id] : window.value[id], breakRequest, coded, mainId = id
    var global = _window ? _window.global : window.global

    // path[0] = path0:args
    var path0 = path[0] ? path[0].toString().split(":")[0] : ""

    // codeds
    if (path0.slice(0, 7) === "coded()" && path.length === 1) {

        coded = true
        return toValue({ req, res, _window, object, id, value: global.codes[path[0]], params, _, e })
    }

    // reload
    if (path0 === "reload()") document.location.reload(true)
    
    // if
    if (path0 === "if()") {
        
        var args = path[0].split(":")
        var approved = toValue({ req, res, _window, id, value: args[1], params, index, _, e, object })
    
        if (!approved) {
            
            if (path[1] && path[1].includes("else()")) return toValue({ req, res, _window, id, value: path[1].split(":")[1], index, params, _, e, object })

            if (path[1] && (path[1].includes("elseif()") || path[1].includes("elif()"))) {

                var _path = path.slice(2)
                _path.unshift(`if():${path[1].split(":").slice(1).join(":")}`)
                var _ds = reducer({ _window, id, value, key, index, path: _path, params, object, params, _, e, req, res })
                return _ds

            } else return 

        } else {

            object = toValue({ req, res, _window, id, value: args[2], params, index, _, e, object })
            path.shift()
            while (path[0] && (path[0].includes("else()") || path[0].includes("elseif()") || path[0].includes("elif()"))) {
                path.shift()
            }
            path0 = path[0] || ""
        }
    }
    
    // ():id || ():id.once()
    if (path0.slice(0, 2) === "()") {

        var args = path[0].split(":")

        if (args[2]) {
            var _timer = parseInt(args[2])
            path[0] = `${args.slice(0, -1).join(":")}`
            return setTimeout(() => reducer({ _window, id, path, value, key, params, object, index, _, e, req, res }), _timer)
        }

        var _id = toValue({ req, res, _window, id, e, value: args[1], params, _, object })
        if (_id) local = _window ? _window.value[_id] : window.value[_id]

        var _once = path[1] === "once()"
        if (_once) path = path.slice(1)
        else if (_id) id = _id
        
        // path = path.slice(1)
        path[0] = "()"
    }
    
    if (path && (path.includes("equal()") || path.includes("equals()") || path.includes("eq()") || path.includes("=()"))) {
        
        var _index = path.findIndex(k => k && (k.includes("equal()") || k.includes("equals()") || k.includes("eq()") || path.includes("=()")))
        if (_index !== -1 && _index === path.length - 2) {
            
            key = true
            var args = path[_index].split(":")

            if (path[_index][0] === "_")
            _ = reducer({ req, res, _window, id, path: path.slice(0, _index).join("."), params, object, _, e })

            value = toValue({ req, res, _window, id, _, e, value: args[1], params, object })
            path = path.slice(0, _index)
        }
    }

    if (path0 === "while()") {
            
        var args = path[0].split(":")
        while (toValue({ req, res, _window, id, value: args[1], params, _, e, object })) {
            toValue({ req, res, _window, id, value: args[2], params, _, e, object })
        }
        path = path.slice(1)
    }

    if (path0 === "timer()") {
            
        var args = path[0].split(":")
        var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
        var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
        return object = setTimeout(myFn, _timer)
    }

    if (path0 === "setInterval()") {
            
        var args = path[0].split(":")
        // var _actions = toValue({ req, res, _window, id, value: args[1], params, _, e })
        var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
        // var myFn = () => execute({ id, actions: _actions, e })
        var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
        return setInterval(myFn, _timer)
    }
    
    if (!object && object !== 0 && object !== false) {

        object = path0 === "()" ? local
        : path0 === "index()" ? index
        : path0 === "global()" ? _window ? _window.global : window.global
        : (path0 === "e()" || path0 === "event()") ? e
        : path0 === "undefined" ? undefined
        : path0 === "false" ? false
        : path0 === "true" ? true
        : path0 === "_" ? _
        : path0 === "params()" ? params
        : path0 === "params" ? params
        : path0 === "document()" ? document
        : path0 === "window()" ? _window || window
        : path0 === "history()" ? history
        : false
        
        if (!object && path[0]) {
            
            if (path0 === "generate()") return generate()
            if (path0 === "desktop()") return global.device.type === "desktop"
            if (path0 === "tablet()") return global.device.type === "tablet"
            if (path0 === "mobile()" || path0 === "phone()") return global.device.type === "phone"

            if (path0 === "log()") {

                var args = path[0].split(":").slice(1)
                return args.map(arg => {

                    var _log = toValue({ req, res, _window, id, value: arg, params, _, e })
                    console.log(_log)
                })
            }

            if (path0.includes("coded()")) {

                coded = true
                object = toValue({ req, res, _window, object, id, value: global.codes[path0], params, _, e })
            }

            else if (path0 === "getCookie()") {

                // getCookie():name
                var _name, args = path[0].split(":")
                if (args[1]) _name = toValue({ req, res, _window, id, e, _, params, value: args[1] })

                object = getCookie({ name: _name, req, res })
                if (!object) return 
                
            } else if (path0 === "eraseCookie()") {

                // eraseCookie():name
                var _name, args = path[0].split(":")
                if (args[1]) _name = toValue({ req, res, _window, id, e, _, params, value: args[1] })

                return eraseCookie({ name: _name })
                
            } else if (path0 === "setCookie()") {
    
                var cname, cvalue, exdays, args = path[0].split(":")
                // setCookie():value:name:expiry-date
                if (args[1]) cvalue = toValue({ req, res, _window, id, e, _, params, value: args[1] })
                else cvalue = o

                if (args[2]) cname = toValue({ req, res, _window, id, e, _, params, value: args[2] })
                if (args[3]) exdays = toValue({ req, res, _window, id, e, _, params, value: args[3] })
    
                return setCookie({ name: cname, value: cvalue, expiry: exdays, req, res })
    
            } else if (path0 === "action()") {

                var args = path[0].split(":")
                var actions = toValue({ req, res, _window, id, value: args[1], params, _, e })
                return execute({ _window, id, actions, params, e })

            }
            
            else if (path0 === "today()") object = new Date()
            else if (path0 === "" || path0 === "_dots") object = "..."
            else if (path0 === "" || path0 === "_string") object = ""
            else if (path0 === "'" || path0 === "_quotation") object = "'"
            else if (path0 === `"` || path0 === "_quotations") object = `"`
            else if (path0 === ` ` || path0 === "_space") object = " "
            else if (path0 === "_number") object = 0
            else if (path0 === "_index") object = index
            else if (path0 === "_boolearn") object = true
            else if (path0 === "_array" || path0 === "_list") {

                object = []
                var args = path[0].split(":").slice(1)
                args.map((el, i) => {
                    el = toValue({ req, res, _window, id, _, e, value: el, params })
                    object.push(el)
                })
                
            } else if (path0 === "{}" || path0 === "_map" || path0 === "_object") {

                object = {}
                var args = path[0].split(":").slice(1)
                args.map((arg, i) => {

                    if (i % 2) return
                    var f = toValue({ req, res, _window, id, _, e, value: arg, params })
                    var v = toValue({ req, res, _window, id, _, e, value: args[i + 1], params })
                    object[f] = v

                })
                
            } else if (path0 === "[{}]") object = [{}]
        }

        if (object || object === "" || object === 0 || coded) path = path.slice(1)
        else {

            if (path[1] && path[1].includes("()")) {
                
                object = path[0]
                path = path.slice(1)

            } else return decode({ _window, string: path.join(".") })
        }
    }
    
    var lastIndex = path.length - 1, k0
    
    var answer = path.length === 0 ? object : path.reduce((o, k, i) => {
        
        k = k.toString()
        k0 = k.split(":")[0]
        
        // fake lastIndex
        if (lastIndex !== path.length - 1) {
            if (key === true) key = false
            lastIndex = path.length - 1
        }
                    
        // break
        if (breakRequest === true || breakRequest >= i) return o
        
        // equal
        if ((path[i + 1] + "") && ((path[i + 1] + "").includes("equal()") || (path[i + 1] + "").includes("equals()") || (path[i + 1] + "").includes("=()") || (path[i + 1] + "").includes("eq()"))) {
            
            key = true
            var args = path[i + 1].split(":")
            if (path[i + 1][0] === "_")
                _ = reducer({ req, res, _window, id, path: [k], params, object: o, _, e })
            value = toValue({ req, res, _window, id, _, e, value: args[1], params })
            breakRequest = i + 1
            lastIndex = i
        }
        
        if (k0 === "else()" || k0 === "or()") {
            
            var args = k.split(":").slice(1)
            if (o || o === 0 || o === "") answer = o
            else if (args[0]) {
                args.map(arg => {
                    if (!answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, e })
                })
            }
            return answer
        }
        
        // if():conds:ans.else():ans || if():conds:ans.elif():conds:ans
        if (k0 === "if()") {
        
            var args = k.split(":")
            var approved = toValue({ req, res, _window, id, value: args[1], params, index, _, e })
        
            if (!approved) {
                
                if (path[i + 1] && path[i + 1].includes("else()")) 
                    return answer = toValue({ req, res, _window, id, value: path[i + 1].split(":")[1], index, params, _, e })
    
                if (path[i + 1] && (path[i + 1].includes("elseif()") || path[i + 1].includes("elif()"))) {
    
                    breakRequest = i + 1
                    var _path = path.slice(i + 2)
                    _path.unshift(`if():${path[i + 1].split(":").slice(1).join(":")}`)
                    return answer = reducer({ _window, id, path: _path, value, key, params, object: o, index, _, e, req, res })
    
                } else return
    
            } else {
    
                answer = toValue({ req, res, _window, id, value: args[2], params, index, _, e })
                breakRequest = i
                while (path[breakRequest + 1] && (path[breakRequest + 1].includes("else()") || path[breakRequest + 1].includes("elseif()") || path[breakRequest + 1].includes("elif()"))) {
                    breakRequest = breakRequest + 1
                }
            }
        }

        if (k0 === "_quotation" || k0 === "'") {
            
            answer = "'"

        } else if (k0 === "_quotations" || k0 === `"`) {
            
            answer = `"`

        } else if (k0 === "_string" || k0 === "''") {
            
            answer = ""

        } else if (k0 === "_dots" || k0 === "...") {
            
            answer = "..."

        } else if (k0 === "_dot") {
            
            answer = "."

        }
        
        if (k === "undefined()" || k === "isundefined()" || k === "isUndefined()") return answer = o === undefined
        
        // isEmpty
        if (k === "isEmpty()") return answer = o === "" ? true : false

        // isnotEmpty
        if (k === "isnotEmpty()") return (answer = o !== "" && typeof o === "string") ? true : false
        
        // notExist
        if (k === "notexist()" || k === "doesnotexist()" || k === "doesnotExist()" || k === "notExist()" || (k === "not()" && (!path[i + 1] || (path[i + 1].includes("()") && !path[i + 1].includes("coded()"))))) 
        return answer = !o ? true : false

        // log
        if (k0.includes("log()")) {

            var args = k.split(":"), __
            if (k0[0] === "_") __ = o
            var _log = toValue({ req, res, _window, id, e, _: __ ? __ : _, value: args[1], params })
            if (_log === undefined) _log = o !== undefined ? o : "here"
            console.log(_log)
            return o
        }

        if (o === undefined) return o

        else if (k !== "data()" && k !== "Data()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {
            
            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, id, e, _, value: k, params })
            if (Array.isArray(o)) o.splice(el, 1)
            else delete o[el]
            return
            
        } else if (k === "while()") {
            
            var args = k.split(":")
            while (toValue({ req, res, _window, id, value: args[1], params, _, e })) {
                toValue({ req, res, _window, id, value: args[2], params, _, e })
            }
            
        } else if (k0 === "_()") {

            var args = k.split(":").slice(1)
            args.map(arg => {
                answer = toValue({ req, res, _window, id, e, value: arg, params, _: o })
            })
            
        } else if (k0 === "_") {

            answer = _

        } else if (k0 === "global()") {

            answer = global

        } else if (k0.includes("coded()")) {
            
            var newValue = toValue({ req, res, _window, id, e, value: global.codes[k], params, _ })
            newValue = newValue !== undefined ? [ newValue.toString(), ...path.slice(i + 1)] : path.slice(i + 1)
            answer = reducer({ req, res, _window, id, e, value, key, path: newValue, object: o, params, _ })
            
        } else if (k0 === "data()") {
            
            breakRequest = true
            answer = reducer({ req, res, _window, id, e, value, key, path: [...(o.derivations || []), ...path.slice(i + 1)], object: global[o.Data], params, _ })

            delete local["data()"]

        } else if (k0 === "Data()") {

            answer = global[local.Data]

        } else if (k0 === "removeAttribute()") {

            var args = k.split(":")
            var removed = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.removeAttribute(removed)

        } else if (k0 === "parent()") {

            var _parent, _o

            if (local.status === "Mounted") _parent = o.element.parentNode.id
            else _parent = o.parent
            _parent = _window ? _window.value[_parent] : window.value[_parent]

            if (o.templated || o.link) {
                _parent = _parent.element.parentNode.id
                _parent = _window ? _window.value[_parent] : window.value[_parent]
                _o = _window ? _window.value[_parent] : window.value[_parent]
            }

            answer = _parent
            
        } else if (k0 === "siblings()") {
            
            var _parent = _window ? _window.value[o.element.id] : window.value[o.element.id]
            answer = [..._parent.element.children].map(el => {
                
                var _id = el.id
                if ((_window ? _window.value[_id] : window.value[_id]).component === "Input") {

                    _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
                    return _window ? _window.value[_id] : window.value[_id]

                } else return _window ? _window.value[_id] : window.value[_id]
            })

            answer = answer.filter(_o => _o.id !== o.id)

        } else if (k0 === "next()" || k0 === "nextSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element

            var nextSibling = element.nextSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "nextSiblings()") {

            var nextSiblings = [], nextSibling
            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element

            var nextSibling = element.nextSibling
            while (nextSibling) {
                var _id = nextSibling.id
                nextSiblings.push(_window ? _window.value[_id] : window.value[_id])
                nextSibling = (_window ? _window.value[_id] : window.value[_id]).element.nextSibling
            }
            answer = nextSiblings

        } else if (k0 === "last()" || k0 === "lastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var lastSibling = element.parentNode.children[element.parentNode.children.length - 1]
            var _id = lastSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "2ndlast()" || k0 === "2ndLast()" || k0 === "2ndLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var seclastSibling = element.parentNode.children[element.parentNode.children.length - 2]
            var _id = seclastSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "3rdlast()" || k0 === "3rdLast()" || k0 === "3rdLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var thirdlastSibling = element.parentNode.children[element.parentNode.children.length - 3]
            var _id = thirdlastSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "1st()" || k0 === "first()" || k0 === "firstSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var firstSibling = element.parentNode.children[0]
            var _id = firstSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "2nd()" || k0 === "second()" || k0 === "secondSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var secondSibling = element.parentNode.children[1]
            var _id = secondSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "prev()" || k0 === "prevSibling()") {

            var element, _el = o.element
            if (o.templated || o.link) _el = _window ? _window.value[o.parent] : window.value[o.parent]

            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) element = _el
            else if (_el) element = _el.element
            else return
            
            var previousSibling = element.previousSibling
            if (!previousSibling) return
            var _id = previousSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "1stChild()") {
            
            if (!o.element) return
            if (!o.element.children[0]) return undefined
            var _id = o.element.children[0].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input") 
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]
            
        } else if (k0 === "2ndChild()") {
            
            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[1] || o.element.children[0]).id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input") 
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "3rdChild()") {

            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[2] || o.element.children[1] || o.element.children[0]).id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "3rdlastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 3].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "2ndlastChild()" || k0 === "2ndLastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 2].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "lastChild()") {

            if (!o.element) return
            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 1].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "children()") {
            
            if (!o.element) return
            answer = [...o.element.children].map(el => {
                
                var _id = el.id, _local = _window ? _window.value[_id] : window.value[_id]
                if (!_local) return
                if (_local.component === "Input") {

                    _id = (_local).element.getElementsByTagName("INPUT")[0].id
                    return _local

                } else return _local
            })
            answer = answer.filter(comp => comp && comp.id)
            
        } else if (k0 === "style()") {
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.style
            else if (typeof o === "object") answer = o.element.style
            
        } else if (k0 === "getTagElements()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)
            else answer = o.element && o.element.getElementsByTagName(_tag_name)

        } else if (k0 === "getTagElement()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)[0]
            else answer = o.element && o.element.getElementsByTagName(_tag_name)[0]

        } else if (k0 === "getTags()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)
            else answer = o.element && o.element.getElementsByTagName(_tag_name)

            answer = [...answer].map(o => window.value[o.id])

        } else if (k0 === "getTag()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)[0]
            else answer = o.element && o.element.getElementsByTagName(_tag_name)[0]
            answer = window.value[answer.id]

        } else if (k0 === "getInputs()") {
            
            var _input, _textarea
            if (o.nodeType === Node.ELEMENT_NODE) {
                _input = o.getElementsByTagName("INPUT")
                _textarea = o.getElementsByTagName("TEXTAREA")
            } else {
                _input = o.element && o.element.getElementsByTagName("INPUT")
                _textarea = o.element && o.element.getElementsByTagName("TEXTAREA")
            }
            
            answer = [..._input, ..._textarea].map(o => window.value[o.id])

        } else if (k0 === "getInput()") {
            
            var _value = _window ? _window.value : window.value
            if (o.nodeType === Node.ELEMENT_NODE) {
                if (_value[o.id].type === "Input") answer = o
                else answer = o.getElementsByTagName("INPUT")[0]
            } else {
                if (o.type === "Input") answer = o
                else answer = o.element && o.element.getElementsByTagName("INPUT")[0]
            }
            answer = _value[answer.id]

        } else if (k0 === "position()") {

            var args = k.split(":")
            var relativeTo = _window ? _window.value["root"].element : window.value["root"].element
            if (args[1]) 
                relativeTo = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "relativePosition()") {

            var args = k.split(":")
            var relativeTo = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "getChildrenByClassName()") {

            var args = k.split(":")
            var className = toValue({ req, res, _window, id, e, _, value: args[1], params })
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

            answer = answer.map(o => window.value[o.id])

        } else if (k0 === "getElementsByClassName()") {

            var args = k.split(":")
            var className = toValue({ req, res, _window, id, e, _, value: args[1], params })
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

        } else if (k0 === "getElementsByTagName()") {

            var args = k.split(":")
            var tagName = toValue({ req, res, _window, id, e, _, value: args[1], params })
            if (tagName) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByTagName(tagName)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByTagName(tagName)]
            } else answer = []

        } else if (k0 === "toInteger()") {

            answer = Math.round(toNumber(o))

        } else if (k0 === "click()") {

            if (o.nodeType === Node.ELEMENT_NODE) o.click()
            else if (typeof o === "object" && o.element) o.element.click()

        } else if (k0 === "focus()") {

            focus({ id: o.id })

        } else if (k0 === "mouseenter()") {

            var mouseenterEvent = new Event("mouseenter")

            if (o.nodeType === Node.ELEMENT_NODE) o.dispatchEvent(mouseenterEvent)
            else if (typeof o === "object" && o.element) o.element.dispatchEvent(mouseenterEvent)

        } else if (k0 === "mouseleave()") {

            var mouseleaveEvent = new Event("mouseleave")

            if (o.nodeType === Node.ELEMENT_NODE) o.dispatchEvent(mouseleaveEvent)
            else if (typeof o === "object" && o.element) o.element.dispatchEvent(mouseleaveEvent)

        } else if (k0 === "device()") {

            answer = global.device.type

        } else if (k0 === "mobile()" || k0 === "phone()") {

            answer = global.device.type === "phone"

        } else if (k0 === "desktop()") {

            answer = global.device.type === "desktop"

        } else if (k0 === "tablet()") {

            answer = global.device.type === "tablet"

        } else if (k0 === "child()") {

            var args = k.split(":")
            var child = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.child(child)
            
        } else if (k0 === "clearTimeout()") {
            
            answer = clearTimeout(o)
            
        } else if (k0 === "clearInterval()") {
            
            answer = clearInterval(o)
            
        } else if (k0 === "setInterval()") {
            
            var args = k.split(":")
            var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
            var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = setInterval(myFn, _timer)

        } else if (k0 === "timer()" || k0 === "setTimeout()") {
            
            var args = k.split(":")
            var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
            var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = setTimeout(myFn, _timer)

        } else if (k0 === "path()") {

            var args = k.split(":")
            var _path = toValue({ req, res, _window, id, value: args[1], params, _, e })
            if (typeof _path === "string") _path = _path.split(".")
            _path = [..._path, ...path.slice(i + 1)]
            answer = reducer({ req, res, _window, id, path: _path, value, key, params, object: o, _, e })
            
        } else if (k0 === "pop()") {

            o.pop()
            answer = o
            
        } else if (k0 === "shift()") {

            answer = o.shift()

        } else if (k0 === "slice()") {

            // slice():start:end
            var args = k.split(":")
            var _start = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            var _end = toValue({ req, res, _window, id, e, value: args[2], params, _ })
            if (_end !== undefined) answer = o.slice(_start, _end)
            else answer = o.slice(_start)
            
        } else if (k0 === "replaceState()") {

            // replaceState():url:title
            var args = k.split(":")
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _ }) || global.data.page[global.currentPage].title
            answer = o.replaceState(null, title, _url)

        } else if (k0 === "pushState()") {

            // pushState():url:title
            var args = k.split(":")
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _ }) || global.data.page[global.currentPage].title
            answer = o.pushState(null, title, _url)

        } else if (k0 === "_index") {
            
            answer = index

        } else if (k0 === "_array" || k0 === "_list") {
            
            answer = []
            var args = k.split(":").slice(1)
            args.map(el => {
                el = toValue({ req, res, _window, id, _, e, value: el, params })
                answer.push(el)
            })

        } else if (k0 === "_object" || k0 === "_map" || k0 === "{}") {
            
            answer = {}
            var args = k.split(":").slice(1)
            args.map((el, i) => {

                if (i % 2) return
                var f = toValue({ req, res, _window, id, _, e, value: el, params })
                var v = toValue({ req, res, _window, id, _, e, value: args[i + 1], params })
                answer[f] = v
            })

        } else if (k0 === "_semi" || k0 === ";") {
  
            answer = o + ";"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_quest" || k0 === "?") {
            
            answer = o + "?"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_dot" || k0 === ".") {

            answer = o + "."
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_space" || k0 === " ") {

            answer = o = o + " "
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_equal" || k0 === "=") {
            
            answer = o + "="
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_comma" || k0 === ",") {
            
            answer = o + ","
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "return()") {

            var args = k.split(":")
            answer = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            
        } else if (k0 === "reload()") {

            document.location.reload(true)
            
        } else if (k0 === "isSameNode()" || k0 === "isSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.isSameNode(o)
            
        } else if (k0 === "isnotSameNode()" || k0 === "isnotSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e }) || {}
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.isSameNode(o)
            
        } else if (k0 === "inOrSame()" || k0 === "insideOrSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o) || _next.isSameNode(o)
            
        } else if (k0 === "contains()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = o.contains(_next)
            
        } else if (k0 === "in()" || k0 === "inside()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o)
            
        } else if (k0 === "out()" || k0 === "outside()" || k0 === "isout()" || k0 === "isoutside()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.contains(o) && !_next.isSameNode(o)
            
        } else if (k0 === "doesnotContain()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !o.contains(_next)
            
        } else if (k0 === "then()") {

            var args = k.split(":").slice(1)
            
            if (args[0]) {
                args.map(arg => {
                    toValue({ req, res, _window, id: mainId, value: arg, params, _, e })
                })
            }
            
        } else if (k0 === "and()") {
            
            if (!o) {
                answer = false
            } else {
                var args = k.split(":").slice(1)
                if (args[0]) {
                    args.map(arg => {
                        if (answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, e })
                    })
                }
            }
            
        } else if (k0 === "isEqual()" || k0 === "is()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = isEqual(o, b)
            
        } else if (k0 === "greater()" || k0 === "isgreater()" || k0 === "isgreaterthan()" || k0 === "isGreaterThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = parseFloat(o) > parseFloat(b)
            
        } else if (k0 === "less()" || k0 === "isless()" || k0 === "islessthan()" || k0 === "isLessThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = parseFloat(o) < parseFloat(b)
            
        } else if (k0 === "isNot()" || k0 === "isNotEqual()" || k0 === "not()" || k0 === "isnot()") {
            
            var args = k.split(":")
            var isNot = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = !isEqual(o, isNot)
            
        } else if (k0 === "true()" || k0 === "istrue()" || k0 === "isTrue()") {

            answer = o === true

        } else if (k0 === "false()" || k0 === "falsy()" || k0 === "isfalse()" || k0 === "isFalse()") {

            answer = o === false
            
        } else if (k0 === "notundefined()" || k0 === "isdefined()") {

            answer = o !== undefined

        } else if (k0 === "opposite()" || k0 === "opp()") {

            if (typeof o === "number") answer = -1 * o
            else if (typeof o === "boolean") answer = !o
            else if (typeof o === "string" && o === "true" || o === "false") {
                if (o === "true") answer = false
                else answer = true
            }

        } else if (k0 === "negative()" || k0 === "neg()") {

            answer = o < 0 ? o : -o

        } else if (k0 === "positive()" || k0 === "pos()") {

            answer = o > 0 ? o : o < 0 ? -o : o

        } else if (k0 === "abs()") {
            
            o = o.toString()

            var isPrice
            if (o.includes(",")) isPrice = true
            o = toNumber(o)

            answer = Math.abs(o)
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "dividedBy()" || k0 === "divide()" || k0 === "divided()" || k0 === "divideBy()" || k0 === "/()") {
            
            var args = k.split(":").slice(1)
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, e })
                
                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
                
                var isPrice
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)

                answer = answer % b === 0 ? answer / b : answer * 1.0 / b
            })
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "times()" || k0 === "multiplyBy()" || k0 === "multiply()" || k0 === "mult()" || k0 === "x()" || k0 === "*()") {
            
            var args = k.split(":").slice(1)
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, e })
                
                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
                
                var isPrice
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)

                answer = answer * b
            })
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "add()" || k0 === "plus()" || k0 === "+()") {
            
            var args = k.split(":").slice(1)
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, e })
                
                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
                var space = answer.slice(-1) === " " || b.slice(-1) === " "
                
                var isPrice
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)

                answer = space ? answer + " " + b : answer + b
            })
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "subs()" || k0 === "minus()" || k0 === "-()") {
            
            var args = k.split(":").slice(1)
            answer = o
            args.map(arg => {

                var b = toValue({ req, res, _window, id, value: arg, params, e, _ })
            
                answer = answer.toString()
                b = b.toString()
                
                var isPrice
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)
                
                if (!isNaN(o) && !isNaN(b)) answer = answer - b
                else answer = answer.split(b)[0] - answer.split(b)[1]
            })

            if (isPrice) answer = answer.toLocaleString()

        } else if (k0 === "mod()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            
            o = o === 0 ? o : (o || "")
            b = b === 0 ? b : (b || "")
            o = o.toString()
            b = b.toString()
            
            var isPrice
            if (o.includes(",") || b.includes(",")) isPrice = true
            
            b = toNumber(b)
            o = toNumber(o)

            answer = o % b
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "sum()") {
            
            answer = o.reduce((o, k) => o + k, 0)

        } else if (k0 === "src()") {
            
            if (o.element) {

                if (key && value !== undefined) answer = o.element.src = value
                else answer = o.element.src

            } else if (o.nodeType === Node.ELEMENT_NODE) answer = o.src = value

        } else if (k0 === "FileReader()" || k0 === "fileReader()") {
            
            // fileReader():file:function
            var args = k.split(":")
            var _file = toValue({ req, res, _window, id, value: args[1], params, _, e })

            var reader = new FileReader()
            reader.onload = (e) => toValue({ req, res, _window, id, value: args[2], params, _, e })
            reader.readAsDataURL(_file)

        } else if (k0 === "toArray()" || k0 === "arr()") {
            
            answer = toArray(o)

        } else if (k0 === "json") {
            
            answer = o + ".json"

        } else if (k0 === "exists()") {
            
            answer = o !== undefined ? true : false

        } else if (k0 === "clone()") {
            
            answer = clone(o)

        } else if (k0 === "override()") {
            
            var args = k.split(":")
            var _override = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = override(o, _override)

        } else if (k0 === "text()" || k0 === "val()") {
            
            var el
            if (o.nodeType === Node.ELEMENT_NODE) el = o
            else if (o.element) el = o.element
            
            if (window.value[el.id].type === "Input") {

                answer = el.value
                if (i === lastIndex && key && value !== undefined) el.value = value

            } else {

                answer = el.innerHTML
                if (i === lastIndex && key && value !== undefined) el.innerHTML = value
            }
 
        } else if (k0 === "field()") {
            
            var fields = k.split(":").slice(1)
            fields.map((field, i) => {
                if (i % 2) return
                var f = toValue({ req, res, _window, id, value: field, params, _, e })
                var v = toValue({ req, res, _window, id, value: fields[i + 1], params, _, e })
                o[f] = v
            })
            answer = o
            
        } else if (k0 === "object()" || k0 === "{}") {
            
            answer = {}
            var args = k.split(":")
            if (args[1]) {

                var fv = args.slice(1)
                fv.map((_fv, _i) => {

                    var isValue = _i % 2
                    if (isValue) return

                    var f = toValue({ req, res, _window, id, value: _fv, params, _, e })
                    var v = toValue({ req, res, _window, id, value: fv[_i + 1], params, _, e })
                    answer[f] = v
                })
            }
            
        } else if (k0 === "unshift()") {
            
            o.unshift()
            answer = o
            
        } else if (k0 === "push()") {
            
            var args = k.split(":")
            var _push = toValue({ req, res, _window, id, value: args[1], params, _ ,e })
            o.push(_push)
            answer = o
            
        } else if (k0 === "pull()") {

            // if no index, it pulls the last element
            var args = k.split(":")
            var _pull = args[1] !== undefined ? toValue({ req, res, _window, id, value: args[1], params, _ ,e }) : o.length - 1
            if (_pull === undefined) return undefined
            o.splice(_pull,1)
            answer = o
            
        } else if (k0 === "pullLastElement()" || k0 === "pullLast()") {

            // if no index, it pulls the last element
            o.splice(o.length - 1, 1)
            answer = o
            
        } else if (k0 === "splice()") {

            // push at a specific index / splice():value:index
            var args = k.split(":")
            var _value = toValue({ req, res, _window, id, value: args[1], params,_ ,e })
            var _index = toValue({ req, res, _window, id, value: args[2], params,_ ,e })
            if (_index === undefined) _index = o.length - 1
            o.splice(_index, 0, _value)
            answer = o
            
        } else if (k0 === "remove()") {

            var _id = typeof o === "string" ? o : o.id
            var _value = _window ? _window.value : window.value
            if (!_value[_id]) return console.log("Element doesnot exist!")
            remove({ id: o.id })

        } else if (k0 === "charAt()") {

            var args = k.split(":")
            var _index = toValue({ req, res, _window, e, id, value: args[1], _, params })
            answer = o.charAt(0)

        } else if (k0 === "keys()") {
            
            answer = Object.keys(o)
            
        } else if (k0 === "key()") {
            
            if (i === lastIndex && value !== undefined && key) answer = Object.keys(o)[0] = value
            else answer = Object.keys(o)[0]
            
        } else if (k0 === "values()") { // values in an object
            
            if (Array.isArray(o)) answer = o
            else answer = Object.values(o)
            
        } else if (k0 === "value()") { // value 0 in an object
            
            if (i === lastIndex && value !== undefined && key) answer = o[Object.keys(o)[0]] = value
            else answer = Object.values(o)[0]
            
        } else if (k0 === "entries()") {
            
            answer = Object.entries(o).map(([k, v]) => ({ [k]: v }))

        } else if (k0 === "toLowerCase()") {
            
            answer = o.toLowerCase()

        } else if (k0 === "toId()") {
            
            var args = k.split(":")
            var checklist = toValue({ req, res, _window, id, e, _, value: args[1], params }) || []
            answer = toId({ string: o, checklist })

        } else if (k0 === "generate()") {
            
            answer = generate()

        } else if (k0 === "includes()") {
            
            var args = k.split(":")
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.includes(_include)
            
        } else if (k0 === "notInclude()" || k0 === "doesnotInclude()") {
            
            var args = k.split(":")
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = !o.includes(_include)
            
        } else if (k0 === "capitalize()") {
            
            answer = capitalize(o)
            
        } else if (k0 === "uncapitalize()") {
            
            answer = capitalize(o, true)
            
        } else if (k0 === "uppercase()" || k0 === "toUpperCase()") {
            
            answer = o.toUpperCase()
            
        } else if (k0 === "lowercase()" || k0 === "toLowerCase()") {
            
            answer = o.toLowerCase()
            
        } else if (k0 === "length()") {
            
            if (Array.isArray(o)) answer = o.length
            else if (typeof o === "string") answer = o.split("").length
            else if (typeof o === "object") answer = Object.keys(o).length
            
        } else if (k0 === "today()") {
            
            answer = new Date()

        } else if (k0 === "toClock()") {
            
            answer = toClock({ timestamp: o })

        } else if (k0 === "toSimplifiedDateAr()") {
            
            answer = toSimplifiedDate({ timestamp: o, lang: "ar" })

        } else if (k0 === "toSimplifiedDate()" || k0 === "toSimplifiedDateEn()") {
            
            answer = toSimplifiedDate({ timestamp: o, lang: "en" })

        } else if (k0 === "ar()" || k0 === "arabic()") {
            //
            answer = o.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])

        } else if (k0 === "date()" || k0 === "toDate()") {

            if (!isNaN(o) && typeof o === "string") o = parseInt(o)
            answer = new Date(o)

        } else if (k0 === "toUTCString()") {
            
            if (!isNaN(o) && (parseFloat(o) + "").length === 13) o = new Date(parseFloat(o))
            answer = o.toUTCString()
            
        } else if (k0 === "setTime()") {
            
            answer = new Date().setTime(o)
            
        } else if (k0 === "getTime()" || k0 === "timestamp()") {
            
            answer = o.getTime()
            
        } else if (k0 === "getDateTime()") {
            
            answer = getDateTime(o)

        } else if (k0 === "getDaysInMonth()") {
            
            answer = getDaysInMonth(o)

        } else if (k0 === "getDayBeginning()" || k0 === "getDayStart()") {
            
            answer = o.setHours(0,0,0,0)
            
        } else if (k0 === "getDayEnd()" || k0 === "getDayEnding()") {
            
            answer = o.setHours(23,59,59,999)
            
        } else if (k0 === "getNextMonth()" || k0 === "get1MonthLater()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get2ndNextMonth()" || k0 === "get2MonthLater()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get3rdNextMonth()" || k0 === "get3MonthLater()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "getPrevMonth()" || k0 === "get1MonthEarlier") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get2ndPrevMonth()" || k0 === "get2MonthEarlier") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get3rdPrevMonth()" || k0 === "get3MonthEarlier") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "getMonthBeginning()" || k0 === "getMonthStart()") {
            
            answer = new Date(o.setMonth(o.getMonth(), 1)).setHours(0,0,0,0)

        } else if (k0 === "getMonthEnding()" || k0 === "getMonthEnd()") {
            
            answer = new Date(o.setMonth(o.getMonth(), getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "getNextMonthBeginning()" || k0 === "getNextMonthStart()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)
            
        } else if (k0 === "getNextMonthEnding()" || k0 === "getNextMonthEnd()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "get2ndNextMonthBeginning()" || k0 === "get2ndNextMonthStart()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)

        } else if (k0 === "get2ndNextMonthEnding()" || k0 === "get2ndNextMonthEnd()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "getPrevMonthBeginning()" || k0 === "getPrevMonthStart()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)

        } else if (k0 === "getPrevMonthEnding()" || k0 === "getPrevMonthEnd()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "get2ndPrevMonthBeginning()" || k0 === "get2ndPrevMonthStart()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)

        } else if (k0 === "get2ndPrevMonthEnding()" || k0 === "get2ndPrevMonthEnd()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "getYearBeginning()" || k0 === "getYearStart()") {
            
            answer = new Date(o.setMonth(0, 1)).setHours(0,0,0,0)

        } else if (k0 === "getYearEnding()" || k0 === "getYearEnd()") {
            
            answer = new Date(o.setMonth(0, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "doesnotHasNestedArray()") {
            
            answer = !hasNestedArray(o) || false

        } else if (k0 === "hasNestedArray()") {
            
            answer = hasNestedArray(o) || false
            
        } else if (k0 === "doesnotHasEmptyField()") {
            
            answer = !hasEmptyField(o) || false
            
        } else if (k0 === "hasEmptyField()") {
            
            answer = hasEmptyField(o) || false
            
        } else if (k0 === "exist()" || k0 === "exists()") {
            
            answer = o !== undefined ? true : false
            
        } else if (k0 === "removeMapping()") {
            
            if (o.type.slice(0, 1) === "[") {
                var _type = o.type.slice(1).split("]")[0]
                o.type = _type + o.type.split("]").slice(1).join("]")
            }
            answer = o
            
        } else if (k0 === "replace()") { // replaces a word in a string
            
            var args = k.split(":") //replace():prev:new
            var rec0 = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var rec1 = toValue({ req, res, _window, id, e, _, value: args[2], params })
            if (rec1) answer = o.replace(rec0, rec1)
            else answer = o.replace(rec0)
            
        } else if (k0 === "importJson()") {
        
            answer = importJson()
        
        } else if (k0 === "exportJson()") {
            
            var args = k.split(":")
            var _name = toValue({ req, res, _window, id, e, _, value: args[1], params })
            exportJson({ data: o, filename: _name})
            
        } else if (k0 === "flat()") {
            
            answer = Array.isArray(o) ? o.flat() : o
            
        } else if (k0 === "deep()" || k0 === "getDeepChildrenId()") {
            
            answer = getDeepChildrenId({ _window, id: o.id })
            
        } else if (k0 === "deepChildren()" || k0 === "getDeepChildren()") {
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0.includes("filter()")) {
            
            var args = k.split(":").slice(1)
            args.map(arg => {

                if (k[0] === "_") {

                    var _path = global.codes[arg] ? global.codes[arg].split(".") : [arg]
                    answer = toArray(o).filter((o, index) => reducer({ req, res, _window, id, path: _path, value, key, object: o, params, index, _: o, e }) )
            
                } else {

                    var _path = global.codes[arg] ? global.codes[arg].split(".") : [arg]
                    answer = toArray(o).filter((o, index) => reducer({ req, res, _window, id, path: _path, object: o, value, key, params, index, _, e }) )
                }
            })
            
        } else if (k0.includes("filterById()")) {

            var args = k.split(":")
            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, id, e, _: o, value: args[1], params }))
            } else {
                var _id = toArray(toValue({ req, res, _window, id, e, _, value: args[1], params }))
                answer = o.filter(o => _id.includes(o.id))
            }

        } else if (k0.includes("find()")) {
            
            var args = k.split(":")
            if (k[0] === "_") answer = o.find(o => toValue({ req, res, _window, id, e,  _: o, value: args[1], params }))
            else answer = o.find(o => reducer({ req, res, _window, id, path: [args[1]], value, key, params, index, _, e, object: o }))
            
        } else if (k0.includes("findIndex()")) {

            var args = k.split(":")
            if (k[0] === "_") answer = o.findIndex(o => toValue({ req, res, _window, id, e,  _: o, value: args[1], params }))
            else answer = o.findIndex(o => reducer({ req, res, _window, id, path: [args[1]], value, key, params, index, _, e, object: o }))
            
        } else if (k0.includes("map()")) {
            
            var args = k.split(":").slice(1)
            args.map(arg => {

                if (k[0] === "_") {

                    var _path = global.codes[arg] ? global.codes[arg].split(".") : [arg]
                    answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: _path, value, key, object: o, params, index, _: o, e }) )
            
                } else {

                    var _path = global.codes[arg] ? global.codes[arg].split(".") : [arg]
                    answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: _path, object: o, value, key, params, index, _, e }) )
                }
            })

        } else if (k0 === "index()") {
            
            var element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            if (!element) answer = o.mapIndex
            else { 
                var children = [...element.children]
                var index = children.findIndex(child => child.id === o.id)
                if (index > -1) answer = index
                else answer = 0
            }
            
        } else if (k0 === "typeof()" || k0 === "type()") {

            answer = getType(o)

        } else if (k0 === "action()") {
            
            answer = execute({ _window, id, actions: path[i - 1], params, e })
            
        } else if (k0 === "toPrice()" || k0 === "price()") {
            
            answer = o = toPrice(toNumber(o))
            
        } else if (k0 === "toBoolean()" || k0 === "boolean()" || k0 === "bool()") {

            answer = true ? o === "true" : false
            
        } else if (k0 === "toNumber()" || k0 === "number()" || k0 === "num()") {

            answer = toNumber(o)
            
        } else if (k0 === "toString()" || k0 === "string()" || k0 === "str()") {
            
            answer = o + ""
            
        } else if (k0 === "1stIndex()" || k0 === "firstIndex()" || k0 === "1stElement()" || k0 === "1stEl()") {
            
            if (value !== undefined && key) answer = o[0] = value
            answer = o[0]
            
        } else if (k0 === "2ndIndex()" || k0 === "secondIndex()" || k0 === "2ndElement()" || k0 === "2ndEl()") {
            
            if (value !== undefined && key) answer = o[1] = value
            answer = o[1]

        } else if (k0 === "3rdIndex()" || k0 === "thirdIndex()" || k0 === "3rdElement()" || k0 === "3rdEl()") {
            
            if (value !== undefined && key) answer = o[2] = value
            answer = o[2]

        } else if (k0 === "3rdLastIndex()" || k0 === "3rdlastIndex()" || k0 === "3rdLastElement()" || k0 === "3rdLastEl()") {

            if (value !== undefined && key) answer = o[o.length - 3] = value
            answer = o[o.length - 3]
            
        } else if (k0 === "2ndLastIndex()" || k0 === "2ndlastIndex()" || k0 === "2ndLastElement()" || k0 === "2ndLastEl()") {

            if (value !== undefined && key) answer = o[o.length - 2] = value
            answer = o[o.length - 2]
            
        } else if (k0 === "lastIndex()" || k0 === "lastElement()" || k0 === "lastEl()") {

            if (value !== undefined && key) answer = o[o.length - 1] = value
            answer = o[o.length - 1]
            
        } else if (k0 === "parseFloat()") {
            
            answer = parseFloat(o)

        } else if (k0 === "parseInt()") {
            
            answer = parseInt(o)

        } else if (k0 === "stringify()") {
            
            answer = JSON.stringify(o)

        } else if (k0 === "parse()") {
            
            answer = JSON.parse(o)

        } else if (k0 === "getCookie()") {

            var args = k.split(":")
            var cname = toValue({ req, res, _window, id, e, _, params, value: args[1] })
            answer = getCookie({ name: cname, req, res })
        
        } else if (k0 === "eraseCookie()") {

            // eraseCookie():name
            var _name, args = k.split(":")
            if (args[1]) _name = toValue({ req, res, _window, id, e, _, params, value: args[1] })

            eraseCookie({ name: _name })
            return o
            
        } else if (k0 === "setCookie()") {

            // setCookie:name:expdays
            var args = k.split(":")
            var cvalue = o
            var cname = toValue({ req, res, _window, id, e, _, params, value: args[1] })
            var exdays = toValue({ req, res, _window, id, e, _, params, value: args[2] })

            setCookie({ name: cname, value: cvalue, expiry: exdays })

        } else if (k0 === "split()") {
            
            var args = k.split(":")
            var splited = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = o.split(splited)

        } else if (k0 === "join()") {
            
            var args = k.split(":")
            var joiner = toValue({ req, res, _window, id, e, value: args[1] || "", params, _ })
            answer = o.join(joiner)

        } else if (k0 === "clean()") {
            
            answer = o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")
            
        } else if (k0 === "preventDefault()") {
            
            answer = o.preventDefault()

        } else if (k0 === "isChildOf()") {
            
            var args = k.split(":")
            var el = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            answer = isEqual(el, o)

        } else if (k0 === "isChildOfId()") {
            
            var args = k.split(":")
            var _id = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)

        } else if (k0 === "isnotChildOfId()") {
            
            var args = k.split(":")
            var _id = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)
            answer = answer ? false : true

        } else if (k0 === "allChildren()" || k0 === "deepChildren()") { 
            // all values of local element and children elements in object formula
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0 === "addClass()") {
            
            var args = k.split(":")
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.add(_class)
            else answer = o.classList.add(_class)

        } else if (k0 === "removeClass()") {
            
            var args = k.split(":")
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.remove(_class)
            else answer = o.classList.remove(_class)

        } else if (k0 === "element" && local && local.status === "Loading") {

            breakRequest = true
            local.controls = toArray(local.controls) || []
            if (value !== undefined) return local.controls.push({
                event: `loaded?${key}=${value}`
            })
            
        } else if (k0 === "length" && !local.length && i === 0) {
            
            var _parent = _window ? _window.value[local.parent] : window.value[local.parent]
            answer = _parent.element.children.length

        } else if (key && value !== undefined && i === lastIndex) {

            answer = o[k] = value
            if (k0 === "display" && local && local.status === "Element Loaded" && local.element.style.display !== "none" && local.style && (local.style.width === "available-width" || local.style.maxWidth === "available-width")) {
                setTimeout(() => {

                    var _idlistParent = getDeepParentId({ _window, id })
                    var padding = ""

                    _idlistParent.map(id => {

                        var _local = _window ? _window.value[id] : window.value[id]
                        if (_local.element && _local.element.style.padding) {

                            var _padding = _local.element.style.padding.split(" ")
                            if (_padding.length === 1) padding += ` - ${_padding[0]}`
                            else if (_padding.length === 2) padding += ` - ${_padding[1]}`
                            else if (_padding.length === 4) padding += ` - ${_padding[1]}`
                        }
                    })
                        
                    var left = local.element.getBoundingClientRect().left
                    var windowWidth = window.innerWidth
                    var setWidth = (windowWidth - left) + "px"
                    local.element.style.maxWidth = `calc(${setWidth}${padding})`
                }, 0)
            }

        } else if (key && o[k] === undefined && i !== lastIndex) {

            if (!isNaN(path[i + 1])) answer = o[k] = []
            else answer = o[k] = {}

        } else if (k0 === "target" && !o[k] && i === 0) {
    
            answer = o["currentTarget"]
    
        } else answer = o[k]
        
        return answer

    }, object)
    
    return answer
}

const getDeepChildren = ({ _window, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
    var all = [local]
    if (!local) return []
    
    if ([...local.element.children].length > 0) 
    ([...local.element.children]).map(el => {

        var _local = _window ? _window.value[el.id] : window.value[el.id]

        if ([..._local.element.children].length > 0) 
            all.push(...getDeepChildren({ id: el.id }))

        else all.push(_local)
    })

    return all
}

const getDeepChildrenId = ({ _window, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
    var all = [id]
    if (!local) return []
    
    if ([...local.element.children].length > 0) 
    ([...local.element.children]).map(el => {
        
        var _local = _window ? _window.value[el.id] : window.value[el.id]

        if ([..._local.element.children].length > 0) 
            all.push(...getDeepChildrenId({ id: el.id }))

        else all.push(el.id)
    })

    return all
}

const getDeepParentId = ({ _window, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
    if (!local.element.parentNode || local.element.parentNode.nodeName === "BODY") return []

    var parentId = local.element.parentNode.id
    var all = [parentId]
    
    all.push(...getDeepParentId({ _window, id: parentId }))

    return all
}

const hasNestedArray = (o) => {
    
    var _nested = false
    if (Array.isArray(o)) {

        o.map(o => {

            if (_nested) return
            if (Array.isArray(o)) _nested = true
            else hasNestedArray(o)
        })

    } else if (typeof o === "object") {

        Object.values(o).map(o => hasNestedArray(o))
    }

    return _nested
}

const hasEmptyField = (o) => {
    
    var _hasEmptyField = false
    if (Array.isArray(o)) {

        o.map(o => hasEmptyField(o))

    } else if (typeof o === "object") {

        Object.entries(o).map(([k, o]) => {

            if (_hasEmptyField) return
            if (k === "") _hasEmptyField = true
            else hasEmptyField(o)
        })
    }
    
    return _hasEmptyField
}

module.exports = { reducer, getDeepChildren, getDeepChildrenId }
},{"./capitalize":38,"./clone":40,"./cookie":45,"./decode":53,"./execute":60,"./exportJson":61,"./focus":66,"./generate":68,"./getDateTime":69,"./getDaysInMonth":70,"./getType":73,"./importJson":74,"./isEqual":77,"./merge":81,"./position":87,"./remove":91,"./toArray":109,"./toClock":112,"./toId":118,"./toNumber":119,"./toPrice":122,"./toSimplifiedDate":123,"./toValue":126}],90:[function(require,module,exports){
module.exports = {
    reload: () => {
        document.location.reload(true)
    }
}
},{}],91:[function(require,module,exports){
const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")

const remove = ({ remove: _remove, id }) => {

  var local = window.value[id]
  var global = window.global

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(local.derivations) || []
  
  if (keys.length > 0 && !_remove.keepData) {

    keys.unshift(local.Data)
    keys.unshift("global()")
    keys.push("delete()")

    reducer({ id, path: keys })
  }

  removeChildren({ id })

  if (keys.length === 0) {

    local.element.remove()
    delete window.value[id]
    return
  }

  // reset length and derivations
  var nextSibling = false
  var children = [...window.value[local.parent].element.children]
  var index = local.derivations.length - 1

  children.map((child) => {

    var id = child.id
    window.value[id].length -= 1

    // derivation in array of next siblings must decrease by 1
    if (nextSibling) resetDerivations({ id, index })

    if (id === local.id) {
      nextSibling = true
      local.element.remove()
      delete window.value[id]
    }
  })
}

const resetDerivations = ({ id, index }) => {

  var value = window.value
  var local = value[id]

  if (!local) return
  if (isNaN(local.derivations[index])) return

  local.derivations[index] -= 1

  var children = [...local.element.children]
  children.map((child) => resetDerivations({ id: child.id, index }) )
}

module.exports = { remove }

},{"./clone":40,"./reducer":89,"./update":128}],92:[function(require,module,exports){
const removeDuplicates = (object) => {
  
  if (typeof object === "string" || typeof object === "number" || !object) {
    return object;
  }

  if (Array.isArray(object)) {
    if (object.length === 0) return [];
    return (object = [removeDuplicates(object[0])]);
  }

  if (typeof object === "object") {
    Object.entries(object).map(([key, value]) => {
      object[key] = removeDuplicates(value);
    });

    return object;
  }
};

module.exports = {removeDuplicates};

},{}],93:[function(require,module,exports){
const resize = ({ id }) => {

  var local = window.value[id]
  if (!local) return
  
  if (local.type !== "Input") return

  var results = dimensions({ id })
  
  // for width
  var width = local.style.width
  if (width === "fit-content" && local.element) {
    local.element.style.width = results.width + "px"
    local.element.style.minWidth = results.width + "px"
  }

  // for height
  var height = local.style.height
  if (height === "fit-content" && local.element) {
    local.element.style.height = results.height + "px"
    local.element.style.minHeight = results.height + "px"
  }
}

const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const dimensions = ({ id, text }) => {

  var local = window.value[id]
  if (!local) return

  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)

  var pStyle = local.style
  var pText = text || (local.type === "Input" && local.element && local.element.value) || "A"
  if (pText.includes("<") || pText.includes(">")) pText = pText.split("<").join("&lt;").split(">").join("&gt;")
  
  if (pStyle != null) lDiv.style = pStyle

  pText = pText.split(" ").join("-")
  if (arabic.test(pText) && !english.test(pText)) {
    lDiv.style.fontFamily = "Tajawal, sans-serif"
    lDiv.style.textAlign = "right"
    lDiv.classList.add("arabic")
  }
  lDiv.style.fontSize = pStyle.fontSize || "initial"
  lDiv.style.fontWeight = pStyle.fontWeight || "initial"
  lDiv.style.padding = pStyle.padding || "initial"
  lDiv.style.maxWidth = pStyle.maxWidth || "initial"
  lDiv.style.minWidth = pStyle.minWidth || "initial"
  lDiv.style.width = pStyle.width || "initial"
  lDiv.style.height = pStyle.height || "initial"
  lDiv.style.maxHeight = pStyle.maxHeight || "initial"
  lDiv.style.minHeight = pStyle.minHeight || "initial"
  lDiv.style.transform = pStyle.transform || "initial"
  lDiv.style.whiteSpace = pStyle.whiteSpace || "nowrap"
  lDiv.style.flexWrap = pStyle.flexWrap || "initial"
  lDiv.style.display = "flex"
  lDiv.style.position = "absolute"
  lDiv.style.left = "-1000px"
  lDiv.style.top = "-1000px"
  lDiv.style.opacity = "0"

  lDiv.innerHTML = pText

  if (pStyle.width === "100%")
  lDiv.style.width = (local.element ? local.element.clientWidth : lDiv.style.width) + "px"
  
  lDiv.style.width = lDiv.clientWidth + 2 + "px"

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight
  }
  
  document.body.removeChild(lDiv)
  lDiv = null

  return lResult
}

var converter = (dimension) => {
  
  if (!dimension) return 0
  if (dimension.includes("rem")) return parseFloat(dimension) * 10
  if (dimension.includes("px")) return parseFloat(dimension)
}

module.exports = {resize, dimensions, converter}

},{}],94:[function(require,module,exports){
const { update } = require("./update")

module.exports = {
    route: ({ route = {} }) => {

        var global = window.global
        var path = route.path || global.path
        var currentPage = route.page || path.split("/")[1].split("?")[0] || "main"
        var title = route.title || global.data.page[currentPage].title
        
        if (!global.data.page[currentPage]) return
        global.data.page[currentPage]["view-id"] = global.data.page[currentPage]["view-id"] || []
        global.currentPage = currentPage
        global.path = path.split("?").join("/")
        
        history.pushState(null, title, global.path)
        document.title = title
        
        update({ id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0
    }
}
},{"./update":128}],95:[function(require,module,exports){
const axios = require("axios")
const { clone } = require("./clone")
const { toAwait } = require("./toAwait")

const save = async ({ id, e, save = {}, ...params }) => {
        
  var local = window.value[id]
  var collection = save.collection = save.collection || save.path
  var _data = clone(save.data)
  delete save.data

  if (!save.doc && !save.id && (!_data || (_data && !_data.id))) return
  save.doc = save.doc || save.id || _data.id

  var { data } = await axios.post(`https://us-central1-bracketjs.cloudfunctions.net/app/api/${collection}`, { data:_data, save })

  local.save = data

  console.log(data)

  // await params
  toAwait({ id, e, params })
}

module.exports = { save }
/*
const { capitalize } = require("./capitalize")
const { toAwait } = require("./toAwait")
const { toArray } = require("./toArray")
const { clone } = require("./clone")

module.exports = {
  save: async ({ save = {}, id, e, ...params }) => {
        
    var local = window.value[id]
    var global = window.global

    if (!save.id && (!save.data || (save.data && !save.data.id))) return
    
    var collection = save.path
    var ref = global.db.collection(collection)
    
    toArray(save.data).map(data => {

      ref.doc(save.id || data.id).set(data).then(() => {
        var _params = clone(params)

        local.save = {
          data,
          success: true,
          message: `${capitalize(collection)} saved successfuly!`,
        }
              
        console.log(local.save)
                    
        // await params
        toAwait({ id, e, params: _params })
      })
      .catch(error => {

        local.save = {
            success: false,
            message: error,
        }
        
        console.log(local.save)
      })
    })
  }
}
*/
},{"./clone":40,"./toAwait":110,"axios":132}],96:[function(require,module,exports){
const axios = require('axios')
const { toString } = require('./toString')
const { toAwait } = require('./toAwait')
const { clone } = require('./clone')

module.exports = {
    search: async ({ id, e, search, ...params }) => {
        
        var local = window.value[id]
        var collection = search.collection = search.collection || search.path
        
        var { data } = await axios.get(`https://us-central1-bracketjs.cloudfunctions.net/app/api/${collection}?${toString({ search })}`)

        local.search = clone(data)
        
        console.log(data)
        
        // await params
        toAwait({ id, e, params })
    }
}

/*
const { capitalize } = require("./capitalize")
const { keys } = require("./keys")
const { toFirebaseOperator } = require("./toFirebaseOperator")

module.exports = {
    search: async ({ id, e, search, ...params }) => {
        
        var local = window.value[id]
        var global = window.global

        var collection = search.path
        var ref = global.db.collection(collection)

        if (collection !== 'admin') {

            search.limit = !search.limit ? 25 : search.limit
            search.orderBy = !search.orderBy ? "creation-date" : search.orderBy
            if (search.orderBy === "creation-date")
            search.startAfter = !search.startAfter ? 0 : search.startAfter
        }
        
        // search field
        if (search.field)
        Object.entries(search.field).map(([key, value]) => {
    
            var operator = keys(value)[0]
            ref = ref.where(key, toFirebaseOperator(operator), value[operator])
        })
        
        if (search.orderBy) ref = ref.orderBy(search.orderBy)
        if (search.limit) ref = ref.limit(search.limit)
        if (search.offset) ref = ref.endAt(search.offset)
        if (search.limitToLast) ref = ref.limitToLast(search.limitToLast)
    
        if (search.startAt) ref = ref.startAt(search.startAt)
        if (search.startAfter) ref = ref.startAfter(search.startAfter)
    
        if (search.endAt) ref = ref.endAt(search.endAt)
        if (search.endBefore) ref = ref.endBefore(search.endBefore)

        // push options to global
        global[`${local.Data}-options`] = global[`${local.Data}-options`] || {}
        global[`${local.Data}-options`].search = search
    
        // retrieve data
        // var data = []
        var data = {}
        var snapshot = ref.get()
        
        snapshot.then(query => {
            
            query.forEach(doc => data[doc.id] = doc.data())
            // query.forEach(doc => data.push(doc.data()))
        
            local.search = {
                data,
                success: true,
                message: `${capitalize(search.path)} mounted successfuly!`
            }
            
            console.log(local.search)
                        
            // await params
            toAwait({ id, e, params })
        })
        .catch(error => {
    
            local.search = {
                success: false,
                message: error,
            }
            
            console.log(local.search)
        })
    }
}
*/
},{"./clone":40,"./toAwait":110,"./toString":124,"axios":132}],97:[function(require,module,exports){
const { isArabic } = require("./isArabic")

const setContent = ({ id, content = {} }) => {

  var local = window.value[id]
  var value = content.value || ""

  if (typeof value !== "string" && typeof value !== "number") return

  // not loaded yet
  if (!local.element) return

  if (local.input && local.input.type === "radio" && value) local.element.checked = "checked"
  else if (local.type === "Input" || local.type === "Textarea") local.element.value = value || ""
  else if (local.type === "UploadInput") local.element.value = value || null
  else if (local.type === "Text" || local.type === "Label" || local.type === "Header" ) local.element.innerHTML = value || ""

  isArabic({ id, value })
}

module.exports = {setContent}

},{"./isArabic":76}],98:[function(require,module,exports){
const {clone} = require("./clone")
const {reducer} = require("./reducer")
const {setContent} = require("./setContent")

const setData = ({ id, data }) => {

  var local = window.value[id]
  var global = window.global

  if (!global[local.Data]) return

  // defualt value
  var defValue = data.value
  if (defValue === undefined) defValue = ""

  // path
  var path = data.path
  if (path) path = path.split(".")
  else path = []

  // convert string numbers paths to num
  path = path.map((k) => {
    if (!isNaN(k)) k = parseFloat(k)
    return k
  })

  // keys
  var derivations = clone(local.derivations)
  var keys = [...derivations, ...path]

  // set value
  var value = reducer({ id, object: global[local.Data], path: keys, value: defValue, key: true })

  local.data = value
  if (local.input && local.input.type === "file") return

  // setContent
  var content = data.content || value
  setContent({ id, content: { value: content } })
}

module.exports = { setData }

},{"./clone":40,"./reducer":89,"./setContent":97}],99:[function(require,module,exports){
const { controls } = require("./controls")
// const { starter } = require("./starter")
const { toArray } = require("./toArray")

const setElement = ({ id }) => {

    var toReturn
    var local = window.value[id]
    var global = window.global
    if (!local) return delete window.value[id]

    // before loading event
    var beforeLoadingControls = local.controls && toArray(local.controls)
        .filter(control => control.event && control.event.split("?")[0].includes("beforeLoading"))
    if (beforeLoadingControls) {

        var currentPage = global.currentPage
        controls({ controls: beforeLoadingControls, id })
        local.controls = toArray(local.controls).filter(controls => controls.event ? !controls.event.includes("beforeLoading") : true)

        // page routed
        if (currentPage !== global.currentPage) return true
    }

    // status
    local.status = "Mounting Element"
    
    local.element = document.getElementById(id)
    if (!local.element) return delete window.value[id]

    // run starter for children
    var children = [...local.element.children]
    
    children.map(el => {

        if (toReturn) return
        var id = el.id
        if (!id) return
        toReturn = setElement({ id })
    })

    // status
    local.status = "Element Loaded"
    return toReturn
}
    
module.exports = { setElement }
},{"./controls":44,"./toArray":109}],100:[function(require,module,exports){
const setPosition = ({ position, id, e }) => {

  var value = window.value
  var leftDeviation = position.left
  var align = position.align
  var topDeviation = position.top
  var element = value[id].element
  var mousePos = position.positioner === "mouse"
  var fin = element.getElementsByClassName("fin")[0]

  if (!value[position.positioner] && !mousePos) return

  var positioner, topPos, bottomPos, rightPos, leftPos, heightPos, widthPos

  if (mousePos) {

    topPos = e.clientY + window.scrollY
    bottomPos = e.clientY + window.scrollY
    rightPos = e.clientX + window.scrollX
    leftPos = e.clientX + window.scrollX
    heightPos = 0
    widthPos = 0
    
  } else {

    positioner = value[position.positioner].element
    topPos = positioner.getBoundingClientRect().top
    bottomPos = positioner.getBoundingClientRect().bottom
    rightPos = positioner.getBoundingClientRect().right
    leftPos = positioner.getBoundingClientRect().left
    heightPos = positioner.clientHeight
    widthPos = positioner.clientWidth

    // set height to fit content
    element.style.height = value[element.id].style.height
  }

  var top 
  var left 
  var bottom 
  var distance 
  var placement
  var height = element.offsetHeight
  var width = element.offsetWidth
  
  placement = element.placement || position.placement || "right"
  distance = parseFloat(element.distance || position.distance || 10)
  
  if (placement === "right") {

    left = rightPos + distance
    top = topPos + heightPos / 2 - height / 2
      
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "-0.5rem"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0 0 0.4rem"
    }

  } else if (placement === "left") {
    
    left = leftPos - distance - width
    top = topPos + heightPos / 2 - height / 2
      
    if (fin) {
      fin.style.right = "-0.5rem"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }

  } else if (placement === "top") {

    top = topPos - height - distance
    left = leftPos + widthPos / 2 - width / 2

    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "-0.5rem"
      fin.style.borderRadius = "0 0 0.4rem 0"
    }

  } else if (placement === "bottom") {

    top = topPos + heightPos + 10
    left = leftPos + widthPos / 2 - width / 2

    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "-0.5rem"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }
  }
  
  // deviation
  if (topDeviation) top = top + topDeviation
  if (leftDeviation) left = left + leftDeviation

  // fix height overflow
  bottom = top + height
  if (mousePos && window.scrollY) bottom = top - window.scrollY

  if (top - 10 < 0) {

    if (fin) fin.style.top = height / 2 - 5 - 10 + top + "px"
    
    element.style.top = 10 + 'px'
    
    if (20 + height >= window.innerHeight)
    element.style.height = window.innerHeight - 20 + "px"

  } else if (bottom + 10 > window.innerHeight) {

    if (fin) fin.style.top = height / 2 - (fin ? 5 : 0) + 10 + bottom - window.innerHeight + "px"
    
    element.style.top = (window.innerHeight - 10 - height) + 'px'
    
    if (window.innerHeight - 20 - height <= 0) {
      element.style.top = 10 + "px"
      element.style.height = window.innerHeight - 20 + "px"
    }

  } else element.style.top = top + 'px'

  // fix width overflow
  right = left + width
  var windowWidth = window.innerWidth
  var bodyHeight = document.body.offsetHeight
  if (bodyHeight > window.innerHeight) windowWidth -= 12

  if (mousePos && window.scrollX) right = left - window.scrollX
  
  if (left - 10 < 0) {

    if (fin) fin.style.left = width / 2 - 5 - 10 + left + "px"

    element.style.left = 10 + 'px'
    
    if (20 + width >= windowWidth)
    element.style.width = windowWidth - 20 + "px"

  } else if (right + 10 > windowWidth) {

    if (fin) fin.style.left = width / 2 - (fin ? 5 : 0) + 10 + right - windowWidth + "px"
    
    element.style.left = windowWidth - 10 - width + 'px'
    
    if (windowWidth - 20 - width <= 0) {
      element.style.left = 10 + "px"
      element.style.width = windowWidth - 20 + "px"
    }

  } else element.style.left = left + 'px'

  // align
  if (align === "left") element.style.left = leftPos + "px"
  if (align === "top") element.style.top = topPos - height + heightPos + "px"
  if (align === "bottom") element.style.bottom = bottomPos + "px"
  if (align === "right") element.style.left = leftPos - width + widthPos + "px"

  if (fin) fin.style.left = "unset"
}

module.exports = {setPosition}

},{}],101:[function(require,module,exports){
const { reducer } = require("./reducer")
const { toAwait } = require("./toAwait")
const { toNumber } = require("./toNumber")

const sort = ({ sort = {}, id, e, ...params}) => {

  var global = window.global
  var local = window.value[id]
  if (!local) return

  var sort = params.sort || {}
  var Data = sort.Data || local.Data
  var options = global[`${Data}-options`]
  var data = sort.data || global[Data]

  options.sort = options.sort === "ascending" ? "descending" : "ascending"
  var path = (sort.path || "").split(".")
  let isDate = false

  data.sort((a, b) => {

    a = reducer({ id, path, object: a }) || "!"
    if (a !== undefined) {
      a = a.toString()

      // date
      if (a.split("-")[2] && !isNaN(a.split("-")[2].split("T")[0])) {
        var year = parseInt(a.split("-")[2].split("T")[0])
        var month = parseInt(a.split("-")[1])
        var day = parseInt(a.split("-")[0])
        a = {year, month, day}
        isDate = true
      }

      // number
      else a = toNumber(a)
    }

    b = reducer({ id, path, object: b }) || "!"
    if (b !== undefined) {
      b = b.toString()

      // date
      if (b.split("-")[2] && !isNaN(b.split("-")[2].split("T")[0])) {
        var year = parseInt(b.split("-")[2].split("T")[0])
        var month = parseInt(b.split("-")[1])
        var day = parseInt(b.split("-")[0])
        b = {year, month, day}
        isDate = true
      }

      // number
      else b = toNumber(b)
    }

    if ((!isNaN(a) && b === "!") || (!isNaN(b) && a === "!")) {
      if (a === "!") a = 0
      else if (b === "!") b = 0
    }

    if ((!isNaN(a) && isNaN(b)) || (!isNaN(b) && isNaN(a))) {
      a = a.toString()
      b = b.toString()
    }

    if (options.sort === "ascending") {
      if (isDate) {
        if (b.year === a.year) {
          if (b.month === a.month) {
            if (a.day === b.day) return 0
            else if (a.day > b.day) return 1
            else return -1
          } else {
            if (a.month > b.month) return 1
            else return -1
          }
        } else {
          if (a.year > b.year) return 1
          else return -1
        }
      }

      if (!isNaN(a) && !isNaN(b)) return b - a

      if (a < b) return -1
      return a > b ? 1 : 0
    } else {
      if (isDate) {
        if (b.year === a.year) {
          if (b.month === a.month) {
            if (a.day === b.day) return 0
            else if (a.day < b.day) return 1
            else return -1
          } else {
            if (a.month < b.month) return 1
            else return -1
          }
        } else {
          if (a.year < b.year) return 1
          else return -1
        }
      }

      if (!isNaN(a) && !isNaN(b)) return a - b

      if (b < a) return -1
      return b > a ? 1 : 0
    }
  })

  global[Data] = data

  // await params
  toAwait({ id, e, params })
}

module.exports = {sort}
},{"./reducer":89,"./toAwait":110,"./toNumber":119}],102:[function(require,module,exports){
const control = require("../control/control")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const { isArabic } = require("./isArabic")
const { resize } = require("./resize")

const starter = ({ id, once }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")
  const { defaultInputHandler } = require("./defaultInputHandler")

  var local = window.value[id]

  // status
  local.status = "Mounting Functions"

  /* Defaults must start before controls */
  
  // arabic text
  isArabic({ id })
  
  // input handlers
  defaultInputHandler({ id })

  // mouseenter, click, mouseover...
  defaultEventHandler({ id })
  
  // on loaded image
  if (local.type === 'Image') local.element.src = local.src

  /* End of default handlers */

  // element awaiters
  if (local.await) {

    var params = toParam({ id, string: local.await.join(';'), mount: true })
    
    if (params.id) {

      delete Object.assign(window.value, {[params.id]: window.value[id]})[id]
      id = params.id
      local = window.value[id]
    }

    delete local.await
  }

  // resize
  if (local.type === "Input") resize({ id })

  // setStyles
  // if (local.style) setStyle({ id, style: local.style })

  // run starter for children
  var children = [...local.element.children]

  if (!once) children.map(child => {

    var id = child.id
    if (!id) return
    starter({ id })
  })

  // lunch auto controls
  Object.entries(control).map(([type, control]) => {

    if (local[type]) {
      
      local.controls = toArray(local.controls)
      var _controls = control({ id, controls: local[type] })
      _controls && local.controls.push(..._controls)
    }
  })
  
  // execute controls
  if (local.controls) controls({ id })

  local.status = "Mounted"
}

module.exports = { starter }

},{"../control/control":20,"./controls":44,"./defaultInputHandler":54,"./event":59,"./isArabic":76,"./resize":93,"./toArray":109,"./toParam":120}],103:[function(require,module,exports){
const setState = ({}) => {}

module.exports = {setState};

},{}],104:[function(require,module,exports){
const { resize } = require("./resize")
const { toArray } = require("./toArray")

const setStyle = ({ id, style = {} }) => {

  var local = window.value[id]
  local.style = local.style || {}
  
  Object.entries(style).map(([key, value]) => {

    if (key === "after") return
    var timer = 0
    if (value || value === 0) value = value + ""

    if (value && value.includes(">>")) {
      timer = value.split(">>")[1]
      value = value.split(">>")[0]
    }

    const style = () => {
      // value = width || height
      if (value) {

        if (value === "available-width") {
          var left = local.element.getBoundingClientRect().left
          var tWidth = window.innerWidth
          if (left) {
            value = (tWidth - left) + "px"
          } else {
            key = "flex"
            value = "1"
          }
          
        } else if (value === "width" || value.includes("width/")) {

          var divide = value.split("/")[1]
          value = local.element.clientWidth
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (value === "height" || value.includes("height/")) {

          var divide = value.split("/")[1]
          value = local.element.clientHeight
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (key === "left" && value === "center") {

          var width = local.element.offsetWidth
          var parentWidth = window.value[local.parent].element.clientWidth

          value = parentWidth / 2 - width / 2 + "px"
        }
      }

      if (local.element) local.element.style[key] = value
      else local.style[key] = value
    }

    if (timer) local[`${key}-timer`] = setTimeout(style, timer)
    else style()

    // resize
    if (key === "width") setTimeout(() => resize({ id }), 0)
  })
}

const resetStyles = ({ id, style = {} }) => {

  var local = window.value[id]
  local.afterStylesMounted = false

  Object.entries({...local.style.after, ...(local.hover && local.hover.style || {})}).map(([key]) => {
    if (local.style[key] !== undefined) style[key] = local.style[key]
    else style[key] = null
  })
  
  setStyle({ id, style })
}

const toggleStyles = ({ id }) => {

  var local = window.value[id]
  if (local.afterStylesMounted) resetStyles({ id, style })
  else mountAfterStyles({ id })
}

const mountAfterStyles = ({ id }) => {

  var local = window.value[id]
  if (!local.style || !local.style.after) return

  local.afterStylesMounted = true

  Object.entries(local.style.after).map(([key, value]) => {

    var timer = 0
    value = value + ""
    if (value.includes(">>")) {
      timer = value.split(">>")[1]
      value = value.split(">>")[0]
    }

    var myFn = () => local.element.style[key] = value

    if (timer) local[`${key}-timer`] = setTimeout(myFn, timer)
    else {

      if (local.element) myFn()
      else {
        local.controls = toArray(local.controls)
        local.controls.push({
          event: `loaded?().element.style.${key}=${value}`
        })
      }
    }
  })
}

module.exports = { setStyle, resetStyles, toggleStyles, mountAfterStyles }

},{"./resize":93,"./toArray":109}],105:[function(require,module,exports){
const { setStyle } = require("./style")
const { capitalize } = require("./capitalize")
const { clone } = require("./clone")

const switchMode = ({ mode, _id = "body" }) => {

    var value = window.value
    var children = [...value[_id].element.children]

    mode = mode.toLowerCase()
    if (mode === window.global.mode.toLowerCase()) return

    children.map(el => {
        
        var local = value[el.id], style = {}
        if (!local) return
            
        if (local.mode) {
            
            if (mode === window.global["default-mode"].toLowerCase()) {

                style = clone(local.mode[mode] ? (local.mode[mode].style || {}) : {})
                Object.keys(local.mode).map(_mode => {
                    if (_mode.toLowerCase() !== mode) {
                        Object.entries(local.mode[_mode].style).map(([k, v]) => {
                            style[k] = style[k] || local.style[k] || null
                        })
                    }
                })
                
            } else if (local.mode[mode]) style = local.mode[mode].style

            setStyle({ id: el.id, style })

            // hover
            local.hover && local.hover.style && Object.keys(local.hover.style).map(key => 
                local.hover.before[key] = style[key] !== undefined ? style[key] : null 
            )

            // clicked
            local.clicked && local.clicked.style && Object.keys(local.clicked.style).map(key => 
                local.clicked.before[key] = style[key] !== undefined ? style[key] : null 
            )

            // click
            local.click && local.click.style && Object.keys(local.click.style).map(key => 
                local.click.before[key] = style[key] !== undefined ? style[key] : null 
            )

            // touch
            local.touch && local.touch.style && Object.keys(local.touch.style).map(key => 
                local.touch.before[key] = style[key] !== undefined ? style[key] : null 
            )
        }
        
        switchMode({ _id: el.id, mode })
    })

    // set global mode value
    if (_id === "body") window.global.mode = capitalize(mode)
}

module.exports = {switchMode}
},{"./capitalize":38,"./clone":40,"./style":104}],106:[function(require,module,exports){
const { capitalize } = require("./capitalize")

const formats = [
    "_quest", "_question", "_semi", "_equal", "_excl", "_comma",
    "bold().", "italic().", "highlight().", "thin().", "linethrough().", "strike().", "underline().", 
    "lowercase().", "uppercase().", "capitalize().", "subscript().", "superscript().", "link().", "red()."
]

const textFormating = ({ _window, text, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
    var style = local.style || {}
    var global = _window ? _window.global : window.global
    var _text = text, newText = _text
    var color = style.color
    color = color ? `color:${color}` : ""
    
    formats.map(format => {

        _text.toString().split(format).map((__text, i) => {

        if (i === 0) return
        if (i > 0) newText = newText.split(format).slice(0, i)

        // marks
        if (format === "_comma") return newText += ","
        if (format === "_quest") return newText += "?"
        if (format === "_semi") return newText += ";"
        if (format === "_equal") return newText += "="
        if (format === "_excl") return newText += "!"

        if (format === "bold().") newText += `<strong style="${color}">`
        if (format === "thin().") newText += `<small style="${color}">`
        if (format === "italic().") newText += `<em style="${color}">`
        if (format === "highlight().") newText += `<mark style="${color}">`
        if (format === "strike()." || format === "linethrough().") newText += `<del style="${color}">`
        if (format === "underline().") newText += `<ins style="${color}">`
        if (format === "subscript().") newText += `<sub style="${color}">`
        if (format === "superscript().") newText += `<sup style="${color}">`
        if (format === "red().") newText += `<span style="color:red">`
        if (format === "blue().") newText += `<span style="color:blue">`

        var code = global.codes[__text.slice(0, 12)]
        if (format === "lowercase().") newText += code.toLowerCase()
        else if (format === "uppercase().") newText += code.toLowerCase()
        else if (format === "capitalize().") newText += capitalize(code)
        else if (code) newText += textFormating({ _window, text: code, id })

        if (format === "bold().") newText += "</strong>"
        if (format === "thin().") newText += "</small>"
        if (format === "italic().") newText += "</em>"
        if (format === "highlight().") newText += "</mark>"
        if (format === "strike()." || format === "linethrough().") newText += "</del>"
        if (format === "underline().") newText += "</ins>"
        if (format === "subscript().") newText += "</sub>"
        if (format === "superscript().") newText += "</sup>"
        if (format === "red()." || format === "blue().") newText += "</span>"

        newText += __text.slice(12)
        })
    })

    return newText
}

module.exports = { textFormating }
},{"./capitalize":38}],107:[function(require,module,exports){
const textarea = ({id}) => {}

module.exports = {textarea}

},{}],108:[function(require,module,exports){
const { isEqual } = require("./isEqual")
const { generate } = require("./generate")
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")

const toApproval = ({ _window, e, string, id, _, req, res }) => {

  // no string
  if (!string || typeof string !== "string") return true

  var global = _window ? _window.global : window.global
  var mainId = id, approval = true

  string.split(";").map(condition => {

    // no condition
    if (condition === "") return true
    if (!approval) return false

    id = mainId
    var local = _window ? _window.value[id] : window.value[id]

    if (condition.includes("#()")) {
      local["#"] = toArray(local["#"])
      return local["#"].push(condition.slice(4))
    }

    condition = condition.split("=")
    var key = condition[0]
    var value = condition[1]
    var notEqual

    if (key && key.includes('coded()') && key.length === 12) key = global.codes[key]

    // operator has !
    if (key.includes("!")) {
      if (key.split("!")[0]) {

        if (value) notEqual = true
        if (notEqual) key = key.split("!")[0]

      } else {

        // !key => study key without value
        value = undefined
        key = key.split("!")[1]
        notEqual = true
      }
    }

    // /////////////////// value /////////////////////

    if (value && value !== "undefined" && value !== "false") value = toValue({ _window, id: mainId, value, e, _, req, res })

    // /////////////////// key /////////////////////

    id = mainId

    // id
    /*if (key.slice(0, 3) === "():") {
      
      var _id = key.split(":")[1]
      key = key.split(":")[0]

      // id
      _id = toValue({ _window, id, value: newId, e, _, req, res })
      if (_id) id = _id
    }*/

    var keygen = generate()
    var local = _window ? _window.value[id] : window.value[id]

    if (!local) return approval = false
    
    // to path
    var path = typeof key === "string" ? key.split(".") : []
    
    // const
    if (key === "false" || key === "undefined") local[keygen] = false
    else if (key === "true") local[keygen] = true
    else if (key === "mobile()" || key === "phone()") local[keygen] = global.device.type === "phone"
    else if (key === "desktop()") local[keygen] = global.device.type === "desktop"
    else if (key === "tablet()") local[keygen] = global.device.type === "tablet"
    else if (path[1] || path[0].includes("()")) local[keygen] = reducer({ _window, id, path, value, e, _, req, res })
    else local[keygen] = key
    
    if (value === undefined) {
      approval = notEqual ? !local[keygen] : (local[keygen] === 0 ? true : local[keygen])

    } else {

      if (value === "undefined") value = undefined
      if (value === "false") value = false
      if (value === "true") value = true
      approval = notEqual ? !isEqual(local[keygen], value) : isEqual(local[keygen], value)
    }

    delete local[keygen]

  })

  return approval
}

module.exports = { toApproval }

},{"./generate":68,"./isEqual":77,"./reducer":89,"./toValue":126}],109:[function(require,module,exports){
const toArray = (data) => {
  return data !== undefined ? (Array.isArray(data) ? [...data] : [data]) : [];
}

module.exports = {toArray}

},{}],110:[function(require,module,exports){
const { clone } = require("./clone")
const { override } = require("./merge")

module.exports = {
  toAwait: ({ id, e, params = {} }) => {

    const { execute } = require("./execute")
    const { toParam } = require("./toParam")

    if (!params.asyncer) return
    
    var awaiter = clone(params.awaiter), awaits = clone(params.await), _params

    delete params.asyncer
    delete params.awaiter
    delete params.await
    
    // get params
    if (awaits && awaits.length > 0) _params = toParam({ id, e, string: awaits.join(";"), mount: true })
    if (_params && _params.break) return

    // override params
    if (_params) params = override(params, _params)


    if (awaiter) execute({ id, e, actions: awaiter, params })
  }
}

},{"./clone":40,"./execute":60,"./merge":81,"./toParam":120}],111:[function(require,module,exports){
module.exports = {
    toCSV: ({ file = {} }) => {

        var data = file.data
        var fileName = file.name

        var CSV = ''
        //Set Report title in first row or line

        CSV += fileName + '\r\n\n'

        //This condition will generate the Label/Header
        var row = ""
        var keys = file.fields || []

        // get all keys
        if (keys.length === 0)
        data.slice(0, 5).map(data => {
            Object.keys(data).map(key => {
                if (!keys.includes(key)) keys.push(key)
            })
        })

        //This loop will extract the label from 1st index of on array
        keys.map(key => row += key + ',')

        row = row.slice(0, -1)

        // line break
        CSV += row + '\r\n'

        //1st loop is to extract each row
        data.map(d => {
            var row = ""

            //2nd loop will extract each column and convert it in string comma-seprated
            keys.map(k => row += '"' + d[k] + '",')

            row = row.slice(0, -1)

            //add a line break after each row
            CSV += row + '\r\n'
        })

        if (CSV == '') {
            alert("Invalid data")
            return
        }

        var blob = new Blob([CSV], { type: 'text/csv;charset=utf-8;' })

        if (navigator.msSaveBlob) { // IE 10+

            navigator.msSaveBlob(blob, fileName)

        } else {

            var link = document.createElement("a")
            if (link.download !== undefined) { // feature detection

                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob)
                link.setAttribute("href", url)
                link.style = "visibility:hidden"
                link.download = fileName + ".csv"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

            }
        }
    }
}
},{}],112:[function(require,module,exports){
module.exports = {
    toClock: ({ timestamp }) => {

        if (!timestamp) return "00:00"
        var days = Math.floor(timestamp / 86400000) + ""
        var _days = timestamp % 86400000
        var hrs = Math.floor(_days / 3600000) + ""
        var _hrs = _days % 3600000
        var mins = Math.floor(_hrs / 60000) + ""
        var _mins = _hrs % 60000
        var secs = Math.floor(_mins / 1000) + ""

        if (days.length === 1) days = "0" + days
        if (hrs.length === 1) hrs = "0" + hrs
        if (mins.length === 1) mins = "0" + mins
        if (secs.length === 1) secs = "0" + secs

        return days + " : " + hrs + " : " + mins + " : " + secs
    }
}
},{}],113:[function(require,module,exports){
const { generate } = require("./generate")

const toCode = ({ _window, string, e, codes }) => {

  if (typeof string !== "string") return string

  var global = {}
  if (!codes) global = _window ? _window.global : window.global
  var keys = string.split('[')
  
  if (keys.length === 1) return string

  if (keys[1] !== undefined) {

    var key = `coded()${generate()}`
    var subKey = keys[1].split(']')

    // ex. [ [ [] [] ] ]
    while (subKey[0] === keys[1] && keys[2] !== undefined) {
      keys[1] += `${'['}${keys[2]}`
      if (keys[1].includes(']') && keys[2]) keys[1] = toCode({ _window, string: keys[1], e })
      keys.splice(2, 1)
      subKey = keys[1].split(']')
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) 
    return keys.join('[')

    if (codes) codes[key] = subKey[0]
    else global.codes[key] = subKey[0]
    var value = key

    var before = keys[0]
    subKey = subKey.slice(1)
    keys = keys.slice(2)
    var after = keys.join('[') ? `${'['}${keys.join('[')}` : ""

    string = `${before}${value}${subKey.join(']')}${after}`
  }

  if (string.split('[')[1] !== undefined && string.split("[").slice(1).join("[").length > 0)
  string = toCode({ _window, string, e })

  return string
}

module.exports = { toCode }

},{"./generate":68}],114:[function(require,module,exports){
const {generate} = require("./generate")
const {toArray} = require("./toArray")

const toComponent = (obj) => {
  // class
  obj.class = obj.class || ""

  // id
  obj.id = obj.id || generate()

  // style
  obj.style = obj.style || {}
  obj.style.after = obj.style.after || {}

  // controls
  obj.controls = toArray(obj.controls)

  // children
  obj.children = toArray(obj.children)

  // model
  obj.featured = obj.featured && "featured"
  obj.model = obj.model || obj.featured || "classic"

  // component
  obj.component = true

  return obj
}

module.exports = {toComponent}

},{"./generate":68,"./toArray":109}],115:[function(require,module,exports){
const toControls = ({ id }) => {}

module.exports = {toControls}

},{}],116:[function(require,module,exports){
module.exports = {
    toFirebaseOperator: (string) => {
        if (!string || string === 'equal' || string === 'equals' || string === 'equalsTo' || string === 'equalTo' || string === 'is') return '=='
        if (string === 'notEqual' || string === 'different' || string === 'isnot') return '!='
        if (string === 'greaterOrEqual' || string === 'greaterorequal') return '>='
        if (string === 'lessOrEqual' || string === 'lessorequal') return '<='
        if (string === 'less' || string === 'lessthan' || string === 'lessThan') return '<'
        if (string === 'greater' || string === 'greaterthan' || string === 'greaterThan') return '>'
        if (string === 'contains' || string === 'contain') return 'array-contains'
        if (string === '!contains' || string === 'doesnotContain' || string === 'doesnotcontain') return 'array-contains-any'
        if (string === 'includes' || string === 'include') return 'in'
        if (string === '!includes' || string === 'doesnotInclude' || string === 'doesnotinclude') return 'not-in'
        else return string
    }
}
},{}],117:[function(require,module,exports){
const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { clone } = require("./clone")
const { textFormating } = require("./textFormating")

module.exports = {
  toHtml: ({ _window, id, req, res }) => {

    var { createElement } = require("./createElement")

    var local = _window ? _window.value[id] : window.value[id]
    var global = _window ? _window.global : window.global
    
    // innerHTML
    var text = (local.text !== undefined && local.text.toString()) || (typeof local.data !== "object" && local.data) || ''
    var innerHTML = local.type !== "View" ? text : ""
    var checked = local.input && local.input.type === "radio" && parseFloat(local.data) === parseFloat(local.input.defaultValue)
    
    // value
    var value = _window ? _window.value : window.value

    // format
    // if (text && typeof text === "string") text = textFormating({ _window, text, id })
    
    innerHTML = toArray(local.children).map((child, index) => {

      if (!child || !child.type) return ""

      var id = child.id || generate()
      value[id] = clone(child)
      value[id].id = id
      value[id].index = index
      value[id].parent = local.id

      return createElement({ _window, id, req, res })
      
    }).join("")
    
    var value = (local.input && local.input.value) !== undefined ?
        local.input.value : local.data !== undefined ? local.data : ""

    var tag, style = toStyle({ _window, id })
        
    if (typeof value === 'object') value = ''

    // src
    if (local.type === "Image" && (local.src || local.data)) local.src = textFormating({ _window, text: local.src || local.data || "", id })

    if (local.type === "View") {
      tag = `<div class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</div>`
    } else if (local.type === "Image") {
      tag = `<img class='${local.class}' alt='${local.alt || ''}' id='${local.id}' style='${style}'>${innerHTML}</img>`
    } else if (local.type === "Table") {
      tag = `<table class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</table>`
    } else if (local.type === "Row") {
      tag = `<tr class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</tr>`
    } else if (local.type === "Header") {
      tag = `<th class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</th>`
    } else if (local.type === "Cell") {
      tag = `<td class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</td>`
    } else if (local.type === "Label") {
      tag = `<label class='${local.class}' id='${local.id}' style='${style}' ${local["aria-label"] ? `aria-label="${local["aria-label"]}"` : ""} ${local.for ? `for="${local.for}"` : ""}>${innerHTML}</label>`
    } else if (local.type === "Span") {
      tag = `<span class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</span>`
    } else if (local.type === "Text") {
      if (local.label) {
        tag = `<label class='${local.class}' id='${local.id}' style='${style}' ${local["aria-label"] ? `aria-label="${local["aria-label"]}"` : ""} ${local.for ? `for="${local.for}"` : ""}>${innerHTML}</label>`
      } else if (local.h1) {
        tag = `<h1 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h1>`
      } else if (local.h2) {
        tag = `<h2 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h2>`
      } else if (local.h3) {
        tag = `<h3 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h3>`
      } else if (local.h4) {
        tag = `<h4 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h4>`
      } else if (local.h5) {
        tag = `<h5 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h5>`
      } else if (local.h6) {
        tag = `<h6 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h6>`
      } else if (local.span) {
        tag = `<span class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</span>`
      } else {
        tag = `<p class='${local.class}' id='${local.id}' style='${style}'>${text}</p>`
      }
    } else if (local.type === "Icon") {
      tag = `<i class='${local.outlined ? "material-icons-outlined" : local.rounded ? "material-icons-round" : local.sharp ? "material-icons-sharp" : local.filled ? "material-icons" : local.twoTone ? "material-icons-two-tone" : ""} ${local.class || ""} ${local.icon.name}' id='${local.id}' style='${style}'>${local.google ? local.icon.name : ""}</i>`
    } else if (local.type === "Textarea") {
      tag = `<textarea class='${local.class}' id='${local.id}' style='${style}' placeholder='${local.placeholder || ""}' ${local.readonly ? "readonly" : ""} ${local.maxlength || ""}>${local.data || local.input.value || ""}</textarea>`
    } else if (local.type === "Input") {
      if (local.textarea) {
        tag = `<textarea spellcheck='false' class='${local.class}' id='${local.id}' style='${style}' placeholder='${local.placeholder || ""}' ${local.readonly ? "readonly" : ""} ${local.maxlength || ""}>${value}</textarea>`
      } else {
        tag = `<input ${local["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${local.class}' id='${local.id}' style='${style}' ${local.input.name ? `name="${local.input.name}"` : ""} ${local.input.accept ? `accept="${local.input.accept}/*"` : ""} type='${local.input.type || "text"}' ${local.placeholder ? `placeholder="${local.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${local.readonly ? "readonly" : ""} ${local.input.min ? `min="${local.input.min}"` : ""} ${local.input.max ? `max="${local.input.max}"` : ""} ${local.input.defaultValue ? `defaultValue="${local.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${local.disabled ? "disabled" : ''}/>`
      }
    } else if (local.type === "Paragraph") {
      tag = `<textarea class='${local.class}' id='${local.id}' style='${style}' placeholder='${local.placeholder || ""}'>${text}</textarea>`
    }

    // linkable
    if (local.link) {

      var id = generate(), style = ''
      if (_window) _window.value[id] = {}
      else window.value[id] = {}

      var _local = _window ? _window.value[id] : window.value[id]

      _local = { id, parent: local.id }
      _local.style = local.link.style
      if (_local.style) style = toStyle({ _window, id })

      tag = `<a id=${id} href=${local.link.path || global.host} style='${style}'>${tag}</a>`
    }

    return tag
  }
}
},{"./clone":40,"./createElement":49,"./generate":68,"./textFormating":106,"./toArray":109,"./toStyle":125}],118:[function(require,module,exports){
const { generate } = require("./generate")

const toId = ({ string, checklist = [] }) => {
    
    var newId
    string = string.split(" ").join("-").toLowerCase()
    var candidates = [
        string, string.split("-").join(""), string.split("-").slice(1).join("-") + string.split("-")[0],
        string + "1", string + "2", string + "3", string + "4", string + "5", string + "6", string + "7",
        string + "8", string + "9", string + "10", string + "11", string + "12", string + "13", string + "14",
        string + "15", string + "16", string + "17", string + "18", string + "19", string + "20", string + "21"
    ]
    
    candidates.map(cand => {

        if (newId) return
        var exists = checklist.find(id => id === cand)
        if (!exists) newId = cand
    })
    
    if (!newId) newId = generate(12)
    // checklist.push(newId)
    
    return newId
}

module.exports = {toId}

},{"./generate":68}],119:[function(require,module,exports){
module.exports = {
  toNumber: (string) => {
    
    if (typeof string === 'number') return string
    
    if ((parseFloat(string) || parseFloat(string) === 0)  && (!isNaN(string.charAt(0)) || string.charAt(0) === '-')) {
      if (!isNaN(string.split(",").join(""))) {
        // is Price
        string = parseFloat(string.split(",").join(""));

      } else if (parseFloat(string).length === string.length) parseFloat(string)
    }

    return string;
  },
};

},{}],120:[function(require,module,exports){
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const toParam = ({ _window, string, e, id = "", req, res, mount }) => {
  const { toApproval } = require("./toApproval")

  var localId = id

  if (typeof string !== "string" || !string) return string || {}
  var params = {}

  string.split(";").map((param) => {
    
    var key, value, id = localId
    var local = _window ? _window.value[id] : window.value[id]

    // break
    if (params.break || local && local.break) return

    if (param.slice(0, 2) === "#:") {
      local["#"] = toArray(local["#"])
      return local["#"].push(param.slice(2))
    }
    
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else key = param

    // await
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = toArray(params.await) || []
      return params.await.push(awaiter)
    }

    if (local && local.status === "Loading") {
      if (key.includes("parent()") || key.includes("children()") || key.includes("next()")) {

        params.await = toArray(params.await) || []
        return params.await.push(param)
      }
    }

    // await
    /* if (value && value.includes("await.")) {
      
      var _value = value.split("await.")[1]
      params.await = toArray(params.await) || []
      return params.await.push(`${key}=${_value}`)
    } */

    // event
    if (key.includes("event.") && !key.split("event.")[0]) {
      
      var event = key.split("event.")[1].split(".")[0]
      var _params = key.split("event.")[1].split(`${event}.`)[1]
      return local.controls.push({
        "event": `${event}?${_params}`
      })
    }
    
    if (value === undefined) value = generate()
    else value = toValue({ _window, id, e, value, params, req, res })

    // condition not approved
    if (value === "*return*") return

    id = localId

    var keys = typeof key === "string" ? key.split(".") : [], timer

    // id
    /* if (key && key.slice(0, 3) === "():") {

      var key0 = key.split(".")[0]
      var newId = key0.split(":")[1]
      timer = key0.split(":")[2]
      key = `${key.split(".")[0].split(":")[0]}.${key.split(".").slice(1).join(".")}`
      keys = key.split(".")
      
      // id
      var _id = toValue({ _window, id, value: newId, params, e, req, res })
      if (_id) id = _id
    }

    // local
    var local = _window ? _window.value[id] : window.value[id]
    */

    // array id
    /*if (Array.isArray(id)) {

      id.slice(1).map(id => {
        var state = generate()
        global[state] = value
        toParam({ id, e, string: `${key}=global().${state}`, req, res })
      })

      id = id[0]
    }*/

    // conditions
    if (key && key.includes("<<")) {
      
      var condition = key.split("<<")[1]
      var approved = toApproval({ id, e, string: condition, req, res })
      if (!approved) return
      key = key.split("<<")[0]
    }

    var path = typeof key === "string" ? key.split(".") : []
    
    // break
    if (key === "break" || key === "break()") {

      params.break = true
      return params
    }

    // object structure
    if (path.length > 1 || path[0].includes("()")) {
      
      // mount state & value
      if (path[0].includes("()")) {
      
        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(local[keys.join(".")])
          local[keys.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && local && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res })

        path.reduce((obj, key, index) => {

          if (obj[key] !== undefined) {
            if (index === path.length - 1) {

              // if key=value exists => mount the existing to local, then mount the new value to params
              path.reduce((o, k, i) => {

                if (i === path.length - 1) return o[k] = value
                return o[k] || {}

              }, _window ? _window.value[id] : window.value[id])

              return obj[key] = value
            }

          } else {

            if (index === path.length - 1) return obj[key] = value
            else obj[key] = {}
          }

          return obj[key]
        }, params)

      }
      
      key = path[0]
      
    } else {

      if (id && local && mount) local[key] = value
      params[key] = value
    }
  })

  return params
}

module.exports = { toParam }

},{"./generate":68,"./reducer":89,"./toApproval":108,"./toArray":109,"./toValue":126}],121:[function(require,module,exports){
const toPath = ({ id }) => {}

module.exports = {toPath}

},{}],122:[function(require,module,exports){
module.exports = {
  toPrice: (string) => {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
};

},{}],123:[function(require,module,exports){
// arabic
var daysAr = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
var monthsAr = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"]
var toArabicNum = (string) => string.replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])

// english
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var simpleDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var simpleMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//Both Persian and Arabic to English digits.
var IntoEn = (string) => string.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, d => ((c=d.charCodeAt()) > 1775 ? c - 1776 : c - 1632))

module.exports = {
    toSimplifiedDate: ({ timestamp, lang, simplified }) => {

        timestamp = parseInt(timestamp)
        var date = new Date(timestamp)

        var dayofWeek = date.getDay()
        var dayofMonth = date.getDate()
        var month = date.getMonth()
        var year = date.getFullYear()

        var simplifiedDate

        if (lang === "ar") {
            simplifiedDate = daysAr[dayofWeek] + " " + dayofMonth + " " + monthsAr[month] + " " + year
            simplifiedDate = toArabicNum(simplifiedDate)
        }
        
        if (lang === "en" && simplified) {
            simplifiedDate = simpleDays[dayofWeek] + " " + dayofMonth + " " + simpleMonths[month] + " " + year
        }
        
        if (lang === "en" && !simplified) {
            simplifiedDate = days[dayofWeek] + " " + dayofMonth + " " + months[month] + " " + year
        }

        return simplifiedDate
    }
}
},{}],124:[function(require,module,exports){
const toString = (object, field) => {

  if (!object) return ""

  var string = ""
  var length = Object.entries(object).length

  Object.entries(object).map(([key, value], index) => {
    if (field) key = `${field}.${key}`

    if (Array.isArray(value)) {

      if (value.length === 0) string += `${key}=_array`
      else string += `${key}=_array.push():${value.join(".push():")}`

    } else if (typeof value === "object") {

      if (Object.keys(value).length === 0) string += `${key}=_map`
      else { 
        var path = toString(value).split(";")
        string += path.map(path => `${key}.${path}`).join(";")
      }

    } else string += `${key}=${value}`

    if (index < length - 1) string += ";"
  })

  return string || ""
}

module.exports = {toString}

},{}],125:[function(require,module,exports){
module.exports = {
  toStyle: ({ _window, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
    var style = ""

    if (local.style) {
      Object.entries(local.style).map(([k, v]) => {
        if (k === "after" || k.includes(">>")) return;
        else if (k === "userSelect") k = "user-select";
        else if (k === "inlineSize") k = "inline-size";
        else if (k === "clipPath") k = "clip-path";
        else if (k === "flexWrap") k = "flex-wrap";
        else if (k === "wordWrap") k = "word-wrap";
        else if (k === "wordBreak") k = "word-break";
        else if (k === "verticalAlign") k = "vertical-align";
        else if (k === "borderBottom") k = "border-bottom";
        else if (k === "borderLeft") k = "border-left";
        else if (k === "borderRight") k = "border-right";
        else if (k === "borderTop") k = "border-top";
        else if (k === "paddingBottom") k = "padding-bottom";
        else if (k === "paddingLeft") k = "padding-left";
        else if (k === "paddingRight") k = "padding-right";
        else if (k === "paddingTop") k = "padding-top";
        else if (k === "marginBottom") k = "margin-bottom";
        else if (k === "marginLeft") k = "margin-left";
        else if (k === "marginRight") k = "margin-right";
        else if (k === "marginTop") k = "margin-top";
        else if (k === "fontSize") k = "font-size";
        else if (k === "fontStyle") k = "font-style";
        else if (k === "fontWeight") k = "font-weight";
        else if (k === "textDecoration") k = "text-decoration";
        else if (k === "lineHeight") k = "line-height";
        else if (k === "letterSpacing") k = "letter-spacing";
        else if (k === "textOverflow") k = "text-overflow";
        else if (k === "whiteSpace") k = "white-space";
        else if (k === "backgroundColor") k = "background-color";
        else if (k === "zIndex") k = "z-index";
        else if (k === "boxShadow") k = "box-shadow";
        else if (k === "borderRadius") k = "border-radius";
        else if (k === "zIndex") k = "z-index";
        else if (k === "alignItems") k = "align-items";
        else if (k === "alignSelf") k = "align-self";
        else if (k === "justifyContent") k = "justify-content";
        else if (k === "justifySelf") k = "justify-self";
        else if (k === "userSelect") k = "user-select";
        else if (k === "textAlign") k = "text-align";
        else if (k === "pointerEvents") k = "pointer-events";
        else if (k === "flexDirection") k = "flex-direction";
        else if (k === "flexGrow") k = "flex-grow";
        else if (k === "flexShrink") k = "flex-shrink";
        else if (k === "maxWidth") k = "max-width";
        else if (k === "minWidth") k = "min-width";
        else if (k === "maxHeight") k = "max-height";
        else if (k === "minHeight") k = "min-height";
        else if (k === "overflowX") k = "overflow-x";
        else if (k === "overflowY") k = "overflow-y";
        else if (k === "gridTemplateColumns") k = "grid-template-columns";
        else if (k === "gridAutoColumns") k = "grid-auto-columns";
        else if (k === "gridTemplateRows") k = "grid-template-rows";
        else if (k === "gridAutoRows") k = "grid-auto-columns";
        style += `${k}:${v}; `
      })
    }

    return style
  }
}

},{}],126:[function(require,module,exports){
const { generate } = require("./generate")
const { reducer } = require("./reducer")

const toValue = ({ _window, value, params, _, id, e, req, res, object }) => {

  const { toApproval } = require("./toApproval")

  var local = _window ? _window.value[id] : window.value[id]
  var global = _window ? _window.global : window.global

  if (!value) return value

  if (value.includes('coded()') && value.length === 12) value = global.codes[value]
  
  // return const value
  if (value.split("const.")[1] !== undefined && !value.split("const.")[0])
  return value.split("const.")[1]

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0])
  return value.split("await().")[1]

  // _
  if (value === "_") return _

  // auto space
  if (value === "") return ""

  // auto comma
  if (value === "_comma") return ","

  // _quotation
  if (value === "_quotation") return `'`

  // _quotations
  if (value === "_quotations") return `"`

  // _array
  if (value === "_array") return []

  // _map
  if (value === "_map" || value === "_object") return {}

  // _string
  if (value === "_string") return ""

  // _quest
  if (value === "_quest") return "?"

  // _space
  if (value === "_space" || value === " ") return " "

  // _semi
  if (value === "_semi") return ";"

  // _dot
  if (value === "_dot") return "."

  // _dots
  if (value === "_dots") return "..."

  // _equal
  if (value === "_equal") return "="

  // _equals
  if (value === "_equals") return "=="

  // _equal_equal
  if (value === "_equal_equal") return "=="

  // auto space
  if (value === "&nbsp") return "&nbsp;"
    
  // auto question
  if (value.includes("_question")) value = value.split("_question").join("?")
  
  // auto question
  if (value.includes("_quest")) value = value.split("_quest").join("?")

  // auto equal
  if (value.includes("_equal")) value = value.split("_equal").join("=")

  // auto semicolon
  if (value.includes("_semi")) value = value.split("_semi").join(";")
  
  // auto comma
  if (value.includes("_comma")) value = value.split("_comma").join(",")
  
  // auto currency
  if (value.includes("_currency")) value = value.split("_currency").join(global.currency || "$")

  /*
  // id
  if (value.slice(0, 3) === "():") {

    var newId = value.split(":")[1]
    var _id = toValue({ _window, value: newId, params, _, id, e, req, res })
    if (_id) id = _id
    value = `().${value.split(".").slice(1).join(".")}`
  }
*/
  //var local = _window ? _window.value[id] : window.value[id]

  // conditions
  if (value.includes("<<")) {

    var condition = value.split("<<")[1]
    var approved = toApproval({ _window, id, e, string: condition, _, req, res })
    if (!approved) return "*return*"
    value = value.split("<<")[0]
  }

  var path = typeof value === "string" ? value.split(".") : []
  
  /* value */
  if (value === "global()") value = _window ? _window.global : window.global
  else if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, id, object, path, value, params, _, e, req, res  })
  else if (path[0].includes("()") && path.length === 1) value = reducer({ _window, id, e, path, params, object: object || (_window ? _window.value : window.value), _, req, res })
  else if (path[1]) value = reducer({ _window, id, object, path, value, params, _, e, req, res  })
  else if (path[0].includes("_array") || path[0].includes("_map")) value = reducer({ _window, id, e, path, params, object, _, req, res })
  else if (value === "()") value = local
  else if (typeof value === "boolean") {}
  else if (!isNaN(value)) value = parseFloat(value)
  else if (value === undefined || value === "generate") value = generate()
  else if (value === "e()" || value === "event()") value = e
  else if (value === "today()") value = new Date()
  else if (value === "keys()") value = Object.keys(value)
  else if (value === "values()") value = Object.values(value)
  else if (value === "undefined") value = undefined
  else if (value === "false") value = false
  else if (value === "true") value = true
  else if (value === "_") value = _

  return value
}

module.exports = { toValue }

},{"./generate":68,"./reducer":89,"./toApproval":108}],127:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { toArray } = require("./toArray")

const toggleView = ({ toggle, id }) => {

  var value = window.value
  var global = window.global
  var togglePage = toggle.page 
  var toggleId = toggle.id
    || togglePage && value.root && value.root.element.children[0] && value.root.element.children[0].id 
    || value[id] && value[id].element.children[0] && value[id].element.children[0].id
  var parentId = toggleId ? value[toggleId].parent : id
  var local = {}
  var viewId = toggle.viewId

  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  // children
  var children = []
  if (togglePage) {

    global.currentPage = togglePage.split("/")[0]
    var title = global.data.page[global.currentPage].title
    history.pushState(null, title, togglePage === "main" ? "/" : togglePage)
    document.title = title
    local = value.root
    children = global.data.page[global.currentPage]["view-id"].map(view => global.data.view[view])

  } else {

    children = toArray(global.data.view[viewId])
    local = value[parentId]
  }

  if (!children) return
  if (!local || !local.element) return

  // fadeout
  var timer = toggle.timer || toggle.fadeout.timer || 200

  if (toggleId && value[toggleId] && value[toggleId].element) {
    
    value[toggleId].element.style.transition = toggle.fadeout.after.transition || `${timer}ms ease-out`
    value[toggleId].element.style.transform = toggle.fadeout.after.transform || "translateX(-10%)"
    value[toggleId].element.style.opacity = toggle.fadeout.after.opacity || "0"

    // remove id from VALUE
    removeChildren({ id: toggleId })
    delete value[toggleId]
  }
  
  var innerHTML = children
    .map((child, index) => {

      var id = child.id || generate()
      value[id] = clone(child)
      value[id].id = id
      value[id].index = index
      value[id].parent = local.id
      value[id].style = {}
      value[id].style.transition = toggle.fadein.before.transition || null
      value[id].style.opacity = toggle.fadein.before.opacity || "0"
      value[id].style.transform = toggle.fadein.before.transform || "translateX(10%)"

      return createElement({ id })

    }).join("")

      
  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)
  lDiv.style.position = "absolute"
  lDiv.style.display = "none"
  lDiv.innerHTML = innerHTML

  var children = [...lDiv.children]
  children.map(child => {

    var id = child.id
    setElement({ id })
  })
  
  // fadein
  setTimeout(() => {

    var child = children[0]

    local.element = child
    starter({ id: child.id })

    var timer = toggle.timer || toggle.fadein.timer || 200
    child.style.transition = toggle.fadein.after.transition || `${timer}ms ease-out`
    child.style.transform = toggle.fadein.after.transform || "translateX(0)"
    child.style.opacity = toggle.fadein.after.opacity || "1"

    // append innerhtml
    local.element.appendChild(child)

  }, toggle.timer || 200)

  if (lDiv) {
    document.body.removeChild(lDiv)
    lDiv = null
  }
}

module.exports = {toggleView}
},{"./clone":40,"./createElement":49,"./generate":68,"./setElement":99,"./starter":102,"./toArray":109,"./update":128}],128:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { controls } = require("./controls")
const { toParam } = require("./toParam")

const update = ({ id }) => {

  var value = window.value
  var global = window.global
  var local = value[id]
  
  if (!local || !local.element) return

  // children
  var children = toArray(local.children)

  // remove id from VALUE
  removeChildren({ id })

  // reset children for root
  if (id === "root") children = global.data.page[global.currentPage]["view-id"].map(view => global.data.view[view])

  // onloading
  if (id === "root" && global.data.page[global.currentPage].controls) {

    var loadingEventControls = toArray(global.data.page[global.currentPage].controls)
      .find(controls => controls.event.split("?")[0].includes("loading"))
    if (loadingEventControls) controls({ id: "root", controls: loadingEventControls })
  }
  
  var innerHTML = children
    .map((child, index) => {

      var id = child.id || generate()
      value[id] = clone(child)
      value[id].flicker
      value[id].id = id
      value[id].index = index
      value[id].parent = local.id
      value[id].style = value[id].style || {}
      value[id].reservedStyles = toParam({ id, string: value[id].type.split("?")[1] || "" }).style || {}
      value[id].style.transition = null
      value[id].style.opacity = "0"

      return createElement({ id })

    }).join("")
    
      
  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)
  lDiv.style.position = "absolute"
  lDiv.style.display = "none"
  lDiv.innerHTML = innerHTML

  // onloaded
  /*if (id === "root" && global.data.page[global.currentPage].controls) {

    var loadedEventControls = toArray(global.data.page[global.currentPage].controls)
      .find(controls => controls.event.split("?")[0].includes("loaded"))
    if (loadedEventControls) controls({ id: "root", controls: loadedEventControls })
  }*/
  
  var children = [...lDiv.children]
  children.map(child => {

    var id = child.id
    setElement({ id })
  })

  setTimeout(() => {

    local.element.innerHTML = ""
    children.map(child => {

      var id = child.id

      value[id].element = child
      starter({ id })
      
      value[id].style.transition = value[id].element.style.transition = value[id].reservedStyles.transition || null
      value[id].style.opacity = value[id].element.style.opacity = value[id].reservedStyles.opacity || "1"
      delete value[id].reservedStyles
      
      local.element.appendChild(child)
    })
    
    if (lDiv) {
      document.body.removeChild(lDiv)
      lDiv = null
    }
  }, 0)
}

const removeChildren = ({ id }) => {

  var value = window.value
  var local = value[id]

  if (!local.element && id !== "root") return delete value[id]
  var children = [...local.element.children]

  children.map((child) => {

    var id = child.id
    if (!value[id]) return

    // clear time out
    Object.entries(value[id]).map(([k, v]) => {

      if (k.includes("-timer")) setTimeout(() => clearTimeout(v), 1000)
      if (k.includes("-watch")) clearTimeout(v)
    })

    removeChildren({ id })
    delete value[id]
  })
}

module.exports = {update, removeChildren}
},{"./clone":40,"./controls":44,"./createElement":49,"./generate":68,"./setElement":99,"./starter":102,"./toArray":109,"./toParam":120}],129:[function(require,module,exports){
const axios = require("axios")
const { toAwait } = require("./toAwait")

const upload = async ({ id, e, upload = {}, ...params }) => {
        
  var local = window.value[id]
  var global = window.global
  var collection = upload.collection = upload.collection || upload.path

  upload.doc = upload.doc || upload.id
  upload.name = upload.name || global.upload[0].name

  // file
  var file = await readFile(upload.file)
  
  // get file type
  var type = file.substring("data:".length, file.indexOf(";base64"))
  upload.type = type.split("/").join("-")

  // get regex exp
  var regex = new RegExp(`^data:${type};base64,`, "gi")
  file = file.replace(regex, "")

  // decrease upload length
  delete upload.file
  
  var { data } = await axios.post(`https://us-central1-bracketjs.cloudfunctions.net/app/api/file/${collection}`, { file, upload })

  local.upload = data

  console.log(data)

  // await params
  toAwait({ id, e, params })
}
  
const readFile = (file) => {
  return new Promise(res => {

    let myReader = new FileReader()
    myReader.onloadend = () => res(myReader.result)
    myReader.readAsDataURL(file)
  })
}

module.exports = { upload }

/* const { capitalize } = require("./capitalize")
const { save } = require("./save")
const { toAwait } = require("./toAwait")

module.exports = {
    upload: async ({ id, e, upload = {}, ...params }) => {

        var global = window.global
        var value = window.value
        var local = value[id]
        var storage = global.storage
        
        upload.save = upload.save !== undefined ? upload.save : true
        
        await storage.child(`images/${local.file.fileName}.${local.file.fileType}`).put(local.file.src)
        await storage.child(`images/${local.file.fileName}.${local.file.fileType}`).getDownloadURL().then(url => local.file.url = url)
        
        local.file.id = `${local.file.fileName}.${local.file.fileType}`
        var _save = { path: "image", data: {
            "creation-date": new Date().getTime() + 10800000 + "", name: `${local.file.fileName}.${local.file.fileType}`, id: `${local.file.fileName}.${local.file.fileType}`, url: local.file.url, description: `${capitalize(local.file.fileName.split('-')[0])} Image`, active: true
        }}

        upload.save && await save({ ...params, save: _save, id, e })

        !upload.save && toAwait({ id, params, e })
    }
}*/
},{"./toAwait":110,"axios":132}],130:[function(require,module,exports){
module.exports = {
    values: () => {}
}
},{}],131:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")

const watch = ({ controls, id }) => {

    const { execute } = require("./execute")

    var local = window.value[id]
    if (!local) return

    var watch = toCode({ id, string: controls.watch })
    var approved = toApproval({ id, string: watch.split('?')[2] })
    if (!approved) return

    watch.split('?')[0].split(';').map(name => {

        var timer = 500
        local[`${name}-watch`] = clone(toValue({ id, value: name }))

        const myFn = async () => {
            
            if (!window.value[id]) return clearInterval(local[`${name}-timer`])
            
            var value = toValue({ id, value: name })

            if ((value === undefined && local[`${name}-watch`] === undefined) || isEqual(value, local[`${name}-watch`])) return

            local[`${name}-watch`] = clone(value)
            
            // params
            /*params = */toParam({ id, string: watch.split('?')[1], mount: true })
            if (local["once()"]) {

                delete local["once()"]
                clearInterval(local[`${name}-timer`])
            }
            
            // approval
            var approved = toApproval({ id, string: watch.split('?')[2] })
            if (!approved) return
            
            // once
            if (controls.actions) await execute({ controls, id })
                
            // await params
            if (local.await) toParam({ id, string: local.await.join(';'), mount: true })
        }

        if (local[`${name}-timer`]) clearInterval(local[`${name}-timer`])
        local[`${name}-timer`] = setInterval(myFn, timer)

    })
}

module.exports = { watch }
},{"./clone":40,"./execute":60,"./isEqual":77,"./toApproval":108,"./toCode":113,"./toParam":120,"./toValue":126}],132:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":134}],133:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":140,"../core/createError":141,"./../core/settle":145,"./../helpers/buildURL":149,"./../helpers/cookies":151,"./../helpers/isURLSameOrigin":154,"./../helpers/parseHeaders":156,"./../utils":159}],134:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":135,"./cancel/CancelToken":136,"./cancel/isCancel":137,"./core/Axios":138,"./core/mergeConfig":144,"./defaults":147,"./helpers/bind":148,"./helpers/isAxiosError":153,"./helpers/spread":157,"./utils":159}],135:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],136:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":135}],137:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],138:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":149,"../helpers/validator":158,"./../utils":159,"./InterceptorManager":139,"./dispatchRequest":142,"./mergeConfig":144}],139:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":159}],140:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":150,"../helpers/isAbsoluteURL":152}],141:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":143}],142:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":137,"../defaults":147,"./../utils":159,"./transformData":146}],143:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],144:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":159}],145:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":141}],146:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../defaults":147,"./../utils":159}],147:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":133,"./adapters/xhr":133,"./core/enhanceError":143,"./helpers/normalizeHeaderName":155,"./utils":159,"_process":4}],148:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],149:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":159}],150:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],151:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":159}],152:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],153:[function(require,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],154:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":159}],155:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":159}],156:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":159}],157:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],158:[function(require,module,exports){
'use strict';

var pkg = require('./../../package.json');

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};

},{"./../../package.json":160}],159:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":148}],160:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "axios@0.21.4",
      "C:\\Users\\user\\Desktop\\Js\\QuePik CMS\\functions"
    ]
  ],
  "_from": "axios@0.21.4",
  "_id": "axios@0.21.4",
  "_inBundle": false,
  "_integrity": "sha512-ut5vewkiu8jjGBdqpM44XxjuCjq9LAKeHVmoVfHVzy8eHgxxq8SbAVQNovDA8mVi05kP0Ea/n/UzcSHcTJQfNg==",
  "_location": "/axios",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "axios@0.21.4",
    "name": "axios",
    "escapedName": "axios",
    "rawSpec": "0.21.4",
    "saveSpec": null,
    "fetchSpec": "0.21.4"
  },
  "_requiredBy": [
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/axios/-/axios-0.21.4.tgz",
  "_spec": "0.21.4",
  "_where": "C:\\Users\\user\\Desktop\\Js\\QuePik CMS\\functions",
  "author": {
    "name": "Matt Zabriskie"
  },
  "browser": {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  },
  "bugs": {
    "url": "https://github.com/axios/axios/issues"
  },
  "bundlesize": [
    {
      "path": "./dist/axios.min.js",
      "threshold": "5kB"
    }
  ],
  "dependencies": {
    "follow-redirects": "^1.14.0"
  },
  "description": "Promise based HTTP client for the browser and node.js",
  "devDependencies": {
    "coveralls": "^3.0.0",
    "es6-promise": "^4.2.4",
    "grunt": "^1.3.0",
    "grunt-banner": "^0.6.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-clean": "^1.1.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-eslint": "^23.0.0",
    "grunt-karma": "^4.0.0",
    "grunt-mocha-test": "^0.13.3",
    "grunt-ts": "^6.0.0-beta.19",
    "grunt-webpack": "^4.0.2",
    "istanbul-instrumenter-loader": "^1.0.0",
    "jasmine-core": "^2.4.1",
    "karma": "^6.3.2",
    "karma-chrome-launcher": "^3.1.0",
    "karma-firefox-launcher": "^2.1.0",
    "karma-jasmine": "^1.1.1",
    "karma-jasmine-ajax": "^0.1.13",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^4.3.6",
    "karma-sinon": "^1.0.5",
    "karma-sourcemap-loader": "^0.3.8",
    "karma-webpack": "^4.0.2",
    "load-grunt-tasks": "^3.5.2",
    "minimist": "^1.2.0",
    "mocha": "^8.2.1",
    "sinon": "^4.5.0",
    "terser-webpack-plugin": "^4.2.3",
    "typescript": "^4.0.5",
    "url-search-params": "^0.10.0",
    "webpack": "^4.44.2",
    "webpack-dev-server": "^3.11.0"
  },
  "homepage": "https://axios-http.com",
  "jsdelivr": "dist/axios.min.js",
  "keywords": [
    "xhr",
    "http",
    "ajax",
    "promise",
    "node"
  ],
  "license": "MIT",
  "main": "index.js",
  "name": "axios",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/axios/axios.git"
  },
  "scripts": {
    "build": "NODE_ENV=production grunt build",
    "coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    "examples": "node ./examples/server.js",
    "fix": "eslint --fix lib/**/*.js",
    "postversion": "git push && git push --tags",
    "preversion": "npm test",
    "start": "node ./sandbox/server.js",
    "test": "grunt test",
    "version": "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"
  },
  "typings": "./index.d.ts",
  "unpkg": "dist/axios.min.js",
  "version": "0.21.4"
}

},{}],161:[function(require,module,exports){
(function (process){(function (){
/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = require('fs')
const path = require('path')
const os = require('os')

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\r\n|\n|\r/

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

function resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse

}).call(this)}).call(this,require('_process'))
},{"_process":4,"fs":1,"os":2,"path":3}]},{},[5]);
