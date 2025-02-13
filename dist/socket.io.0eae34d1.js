// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
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
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
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

  while (len) {
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
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
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

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/socket.io/client-dist/socket.io.js":[function(require,module,exports) {
var define;
var process = require("process");
var Buffer = require("buffer").Buffer;
function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

/*!
 * Socket.IO v4.1.3
 * (c) 2014-2021 Guillermo Rauch
 * Released under the MIT License.
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof2(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof2(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof2(exports)) === 'object') exports["io"] = factory();else root["io"] = factory();
})(self, function () {
  return (
    /******/
    function (modules) {
      // webpackBootstrap

      /******/
      // The module cache

      /******/
      var installedModules = {};
      /******/

      /******/
      // The require function

      /******/

      function __webpack_require__(moduleId) {
        /******/

        /******/
        // Check if module is in cache

        /******/
        if (installedModules[moduleId]) {
          /******/
          return installedModules[moduleId].exports;
          /******/
        }
        /******/
        // Create a new module (and put it into the cache)

        /******/


        var module = installedModules[moduleId] = {
          /******/
          i: moduleId,

          /******/
          l: false,

          /******/
          exports: {}
          /******/

        };
        /******/

        /******/
        // Execute the module function

        /******/

        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/

        /******/
        // Flag the module as loaded

        /******/

        module.l = true;
        /******/

        /******/
        // Return the exports of the module

        /******/

        return module.exports;
        /******/
      }
      /******/

      /******/

      /******/
      // expose the modules object (__webpack_modules__)

      /******/


      __webpack_require__.m = modules;
      /******/

      /******/
      // expose the module cache

      /******/

      __webpack_require__.c = installedModules;
      /******/

      /******/
      // define getter function for harmony exports

      /******/

      __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
          /******/
          Object.defineProperty(exports, name, {
            enumerable: true,
            get: getter
          });
          /******/
        }
        /******/

      };
      /******/

      /******/
      // define __esModule on exports

      /******/


      __webpack_require__.r = function (exports) {
        /******/
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          /******/
          Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
          });
          /******/
        }
        /******/


        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        /******/
      };
      /******/

      /******/
      // create a fake namespace object

      /******/
      // mode & 1: value is a module id, require it

      /******/
      // mode & 2: merge all properties of value into the ns

      /******/
      // mode & 4: return value when already ns object

      /******/
      // mode & 8|1: behave like require

      /******/


      __webpack_require__.t = function (value, mode) {
        /******/
        if (mode & 1) value = __webpack_require__(value);
        /******/

        if (mode & 8) return value;
        /******/

        if (mode & 4 && _typeof2(value) === 'object' && value && value.__esModule) return value;
        /******/

        var ns = Object.create(null);
        /******/

        __webpack_require__.r(ns);
        /******/


        Object.defineProperty(ns, 'default', {
          enumerable: true,
          value: value
        });
        /******/

        if (mode & 2 && typeof value != 'string') for (var key in value) {
          __webpack_require__.d(ns, key, function (key) {
            return value[key];
          }.bind(null, key));
        }
        /******/

        return ns;
        /******/
      };
      /******/

      /******/
      // getDefaultExport function for compatibility with non-harmony modules

      /******/


      __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
        /******/
        function getDefault() {
          return module['default'];
        } :
        /******/
        function getModuleExports() {
          return module;
        };
        /******/

        __webpack_require__.d(getter, 'a', getter);
        /******/


        return getter;
        /******/
      };
      /******/

      /******/
      // Object.prototype.hasOwnProperty.call

      /******/


      __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/

      /******/
      // __webpack_public_path__

      /******/


      __webpack_require__.p = "";
      /******/

      /******/

      /******/
      // Load entry module and return exports

      /******/

      return __webpack_require__(__webpack_require__.s = "./build/index.js");
      /******/
    }({
      /***/
      "./build/index.js": function buildIndexJs(module, exports, __webpack_require__) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.io = exports.Socket = exports.Manager = exports.protocol = void 0;

        var url_1 = __webpack_require__(
        /*! ./url */
        "./build/url.js");

        var manager_1 = __webpack_require__(
        /*! ./manager */
        "./build/manager.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("socket.io-client");
        /**
         * Module exports.
         */


        module.exports = exports = lookup;
        /**
         * Managers cache.
         */

        var cache = exports.managers = {};

        function lookup(uri, opts) {
          if (_typeof(uri) === "object") {
            opts = uri;
            uri = undefined;
          }

          opts = opts || {};
          var parsed = url_1.url(uri, opts.path || "/socket.io");
          var source = parsed.source;
          var id = parsed.id;
          var path = parsed.path;
          var sameNamespace = cache[id] && path in cache[id]["nsps"];
          var newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
          var io;

          if (newConnection) {
            debug("ignoring socket cache for %s", source);
            io = new manager_1.Manager(source, opts);
          } else {
            if (!cache[id]) {
              debug("new io instance for %s", source);
              cache[id] = new manager_1.Manager(source, opts);
            }

            io = cache[id];
          }

          if (parsed.query && !opts.query) {
            opts.query = parsed.queryKey;
          }

          return io.socket(parsed.path, opts);
        }

        exports.io = lookup;
        /**
         * Protocol version.
         *
         * @public
         */

        var socket_io_parser_1 = __webpack_require__(
        /*! socket.io-parser */
        "./node_modules/socket.io-parser/dist/index.js");

        Object.defineProperty(exports, "protocol", {
          enumerable: true,
          get: function get() {
            return socket_io_parser_1.protocol;
          }
        });
        /**
         * `connect`.
         *
         * @param {String} uri
         * @public
         */

        exports.connect = lookup;
        /**
         * Expose constructors for standalone build.
         *
         * @public
         */

        var manager_2 = __webpack_require__(
        /*! ./manager */
        "./build/manager.js");

        Object.defineProperty(exports, "Manager", {
          enumerable: true,
          get: function get() {
            return manager_2.Manager;
          }
        });

        var socket_1 = __webpack_require__(
        /*! ./socket */
        "./build/socket.js");

        Object.defineProperty(exports, "Socket", {
          enumerable: true,
          get: function get() {
            return socket_1.Socket;
          }
        });
        exports["default"] = lookup;
        /***/
      },

      /***/
      "./build/manager.js": function buildManagerJs(module, exports, __webpack_require__) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.Manager = void 0;

        var eio = __webpack_require__(
        /*! engine.io-client */
        "./node_modules/engine.io-client/lib/index.js");

        var socket_1 = __webpack_require__(
        /*! ./socket */
        "./build/socket.js");

        var parser = __webpack_require__(
        /*! socket.io-parser */
        "./node_modules/socket.io-parser/dist/index.js");

        var on_1 = __webpack_require__(
        /*! ./on */
        "./build/on.js");

        var Backoff = __webpack_require__(
        /*! backo2 */
        "./node_modules/backo2/index.js");

        var typed_events_1 = __webpack_require__(
        /*! ./typed-events */
        "./build/typed-events.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("socket.io-client:manager");

        var Manager = /*#__PURE__*/function (_typed_events_1$Stric) {
          _inherits(Manager, _typed_events_1$Stric);

          var _super = _createSuper(Manager);

          function Manager(uri, opts) {
            var _this;

            _classCallCheck(this, Manager);

            _this = _super.call(this);
            _this.nsps = {};
            _this.subs = [];

            if (uri && "object" === _typeof(uri)) {
              opts = uri;
              uri = undefined;
            }

            opts = opts || {};
            opts.path = opts.path || "/socket.io";
            _this.opts = opts;

            _this.reconnection(opts.reconnection !== false);

            _this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);

            _this.reconnectionDelay(opts.reconnectionDelay || 1000);

            _this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);

            _this.randomizationFactor(opts.randomizationFactor || 0.5);

            _this.backoff = new Backoff({
              min: _this.reconnectionDelay(),
              max: _this.reconnectionDelayMax(),
              jitter: _this.randomizationFactor()
            });

            _this.timeout(null == opts.timeout ? 20000 : opts.timeout);

            _this._readyState = "closed";
            _this.uri = uri;

            var _parser = opts.parser || parser;

            _this.encoder = new _parser.Encoder();
            _this.decoder = new _parser.Decoder();
            _this._autoConnect = opts.autoConnect !== false;
            if (_this._autoConnect) _this.open();
            return _this;
          }

          _createClass(Manager, [{
            key: "reconnection",
            value: function reconnection(v) {
              if (!arguments.length) return this._reconnection;
              this._reconnection = !!v;
              return this;
            }
          }, {
            key: "reconnectionAttempts",
            value: function reconnectionAttempts(v) {
              if (v === undefined) return this._reconnectionAttempts;
              this._reconnectionAttempts = v;
              return this;
            }
          }, {
            key: "reconnectionDelay",
            value: function reconnectionDelay(v) {
              var _a;

              if (v === undefined) return this._reconnectionDelay;
              this._reconnectionDelay = v;
              (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
              return this;
            }
          }, {
            key: "randomizationFactor",
            value: function randomizationFactor(v) {
              var _a;

              if (v === undefined) return this._randomizationFactor;
              this._randomizationFactor = v;
              (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
              return this;
            }
          }, {
            key: "reconnectionDelayMax",
            value: function reconnectionDelayMax(v) {
              var _a;

              if (v === undefined) return this._reconnectionDelayMax;
              this._reconnectionDelayMax = v;
              (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
              return this;
            }
          }, {
            key: "timeout",
            value: function timeout(v) {
              if (!arguments.length) return this._timeout;
              this._timeout = v;
              return this;
            }
            /**
             * Starts trying to reconnect if reconnection is enabled and we have not
             * started reconnecting yet
             *
             * @private
             */

          }, {
            key: "maybeReconnectOnOpen",
            value: function maybeReconnectOnOpen() {
              // Only try to reconnect if it's the first time we're connecting
              if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
                // keeps reconnection from firing twice for the same reconnection loop
                this.reconnect();
              }
            }
            /**
             * Sets the current transport `socket`.
             *
             * @param {Function} fn - optional, callback
             * @return self
             * @public
             */

          }, {
            key: "open",
            value: function open(fn) {
              var _this2 = this;

              debug("readyState %s", this._readyState);
              if (~this._readyState.indexOf("open")) return this;
              debug("opening %s", this.uri);
              this.engine = eio(this.uri, this.opts);
              var socket = this.engine;
              var self = this;
              this._readyState = "opening";
              this.skipReconnect = false; // emit `open`

              var openSubDestroy = on_1.on(socket, "open", function () {
                self.onopen();
                fn && fn();
              }); // emit `error`

              var errorSub = on_1.on(socket, "error", function (err) {
                debug("error");
                self.cleanup();
                self._readyState = "closed";

                _this2.emitReserved("error", err);

                if (fn) {
                  fn(err);
                } else {
                  // Only do this if there is no fn to handle the error
                  self.maybeReconnectOnOpen();
                }
              });

              if (false !== this._timeout) {
                var timeout = this._timeout;
                debug("connect attempt will timeout after %d", timeout);

                if (timeout === 0) {
                  openSubDestroy(); // prevents a race condition with the 'open' event
                } // set timer


                var timer = setTimeout(function () {
                  debug("connect attempt timed out after %d", timeout);
                  openSubDestroy();
                  socket.close();
                  socket.emit("error", new Error("timeout"));
                }, timeout);

                if (this.opts.autoUnref) {
                  timer.unref();
                }

                this.subs.push(function subDestroy() {
                  clearTimeout(timer);
                });
              }

              this.subs.push(openSubDestroy);
              this.subs.push(errorSub);
              return this;
            }
            /**
             * Alias for open()
             *
             * @return self
             * @public
             */

          }, {
            key: "connect",
            value: function connect(fn) {
              return this.open(fn);
            }
            /**
             * Called upon transport open.
             *
             * @private
             */

          }, {
            key: "onopen",
            value: function onopen() {
              debug("open"); // clear old subs

              this.cleanup(); // mark as open

              this._readyState = "open";
              this.emitReserved("open"); // add new subs

              var socket = this.engine;
              this.subs.push(on_1.on(socket, "ping", this.onping.bind(this)), on_1.on(socket, "data", this.ondata.bind(this)), on_1.on(socket, "error", this.onerror.bind(this)), on_1.on(socket, "close", this.onclose.bind(this)), on_1.on(this.decoder, "decoded", this.ondecoded.bind(this)));
            }
            /**
             * Called upon a ping.
             *
             * @private
             */

          }, {
            key: "onping",
            value: function onping() {
              this.emitReserved("ping");
            }
            /**
             * Called with data.
             *
             * @private
             */

          }, {
            key: "ondata",
            value: function ondata(data) {
              this.decoder.add(data);
            }
            /**
             * Called when parser fully decodes a packet.
             *
             * @private
             */

          }, {
            key: "ondecoded",
            value: function ondecoded(packet) {
              this.emitReserved("packet", packet);
            }
            /**
             * Called upon socket error.
             *
             * @private
             */

          }, {
            key: "onerror",
            value: function onerror(err) {
              debug("error", err);
              this.emitReserved("error", err);
            }
            /**
             * Creates a new socket for the given `nsp`.
             *
             * @return {Socket}
             * @public
             */

          }, {
            key: "socket",
            value: function socket(nsp, opts) {
              var socket = this.nsps[nsp];

              if (!socket) {
                socket = new socket_1.Socket(this, nsp, opts);
                this.nsps[nsp] = socket;
              }

              return socket;
            }
            /**
             * Called upon a socket close.
             *
             * @param socket
             * @private
             */

          }, {
            key: "_destroy",
            value: function _destroy(socket) {
              var nsps = Object.keys(this.nsps);

              for (var _i = 0, _nsps = nsps; _i < _nsps.length; _i++) {
                var nsp = _nsps[_i];
                var _socket = this.nsps[nsp];

                if (_socket.active) {
                  debug("socket %s is still active, skipping close", nsp);
                  return;
                }
              }

              this._close();
            }
            /**
             * Writes a packet.
             *
             * @param packet
             * @private
             */

          }, {
            key: "_packet",
            value: function _packet(packet) {
              debug("writing packet %j", packet);
              var encodedPackets = this.encoder.encode(packet);

              for (var i = 0; i < encodedPackets.length; i++) {
                this.engine.write(encodedPackets[i], packet.options);
              }
            }
            /**
             * Clean up transport subscriptions and packet buffer.
             *
             * @private
             */

          }, {
            key: "cleanup",
            value: function cleanup() {
              debug("cleanup");
              this.subs.forEach(function (subDestroy) {
                return subDestroy();
              });
              this.subs.length = 0;
              this.decoder.destroy();
            }
            /**
             * Close the current socket.
             *
             * @private
             */

          }, {
            key: "_close",
            value: function _close() {
              debug("disconnect");
              this.skipReconnect = true;
              this._reconnecting = false;

              if ("opening" === this._readyState) {
                // `onclose` will not fire because
                // an open event never happened
                this.cleanup();
              }

              this.backoff.reset();
              this._readyState = "closed";
              if (this.engine) this.engine.close();
            }
            /**
             * Alias for close()
             *
             * @private
             */

          }, {
            key: "disconnect",
            value: function disconnect() {
              return this._close();
            }
            /**
             * Called upon engine close.
             *
             * @private
             */

          }, {
            key: "onclose",
            value: function onclose(reason) {
              debug("onclose");
              this.cleanup();
              this.backoff.reset();
              this._readyState = "closed";
              this.emitReserved("close", reason);

              if (this._reconnection && !this.skipReconnect) {
                this.reconnect();
              }
            }
            /**
             * Attempt a reconnection.
             *
             * @private
             */

          }, {
            key: "reconnect",
            value: function reconnect() {
              var _this3 = this;

              if (this._reconnecting || this.skipReconnect) return this;
              var self = this;

              if (this.backoff.attempts >= this._reconnectionAttempts) {
                debug("reconnect failed");
                this.backoff.reset();
                this.emitReserved("reconnect_failed");
                this._reconnecting = false;
              } else {
                var delay = this.backoff.duration();
                debug("will wait %dms before reconnect attempt", delay);
                this._reconnecting = true;
                var timer = setTimeout(function () {
                  if (self.skipReconnect) return;
                  debug("attempting reconnect");

                  _this3.emitReserved("reconnect_attempt", self.backoff.attempts); // check again for the case socket closed in above events


                  if (self.skipReconnect) return;
                  self.open(function (err) {
                    if (err) {
                      debug("reconnect attempt error");
                      self._reconnecting = false;
                      self.reconnect();

                      _this3.emitReserved("reconnect_error", err);
                    } else {
                      debug("reconnect success");
                      self.onreconnect();
                    }
                  });
                }, delay);

                if (this.opts.autoUnref) {
                  timer.unref();
                }

                this.subs.push(function subDestroy() {
                  clearTimeout(timer);
                });
              }
            }
            /**
             * Called upon successful reconnect.
             *
             * @private
             */

          }, {
            key: "onreconnect",
            value: function onreconnect() {
              var attempt = this.backoff.attempts;
              this._reconnecting = false;
              this.backoff.reset();
              this.emitReserved("reconnect", attempt);
            }
          }]);

          return Manager;
        }(typed_events_1.StrictEventEmitter);

        exports.Manager = Manager;
        /***/
      },

      /***/
      "./build/on.js": function buildOnJs(module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.on = void 0;

        function on(obj, ev, fn) {
          obj.on(ev, fn);
          return function subDestroy() {
            obj.off(ev, fn);
          };
        }

        exports.on = on;
        /***/
      },

      /***/
      "./build/socket.js": function buildSocketJs(module, exports, __webpack_require__) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _createForOfIteratorHelper(o, allowArrayLike) {
          var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

          if (!it) {
            if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
              if (it) o = it;
              var i = 0;

              var F = function F() {};

              return {
                s: F,
                n: function n() {
                  if (i >= o.length) return {
                    done: true
                  };
                  return {
                    done: false,
                    value: o[i++]
                  };
                },
                e: function e(_e) {
                  throw _e;
                },
                f: F
              };
            }

            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }

          var normalCompletion = true,
              didErr = false,
              err;
          return {
            s: function s() {
              it = it.call(o);
            },
            n: function n() {
              var step = it.next();
              normalCompletion = step.done;
              return step;
            },
            e: function e(_e2) {
              didErr = true;
              err = _e2;
            },
            f: function f() {
              try {
                if (!normalCompletion && it["return"] != null) it["return"]();
              } finally {
                if (didErr) throw err;
              }
            }
          };
        }

        function _unsupportedIterableToArray(o, minLen) {
          if (!o) return;
          if (typeof o === "string") return _arrayLikeToArray(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          if (n === "Object" && o.constructor) n = o.constructor.name;
          if (n === "Map" || n === "Set") return Array.from(o);
          if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }

        function _arrayLikeToArray(arr, len) {
          if (len == null || len > arr.length) len = arr.length;

          for (var i = 0, arr2 = new Array(len); i < len; i++) {
            arr2[i] = arr[i];
          }

          return arr2;
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _get(target, property, receiver) {
          if (typeof Reflect !== "undefined" && Reflect.get) {
            _get = Reflect.get;
          } else {
            _get = function _get(target, property, receiver) {
              var base = _superPropBase(target, property);

              if (!base) return;
              var desc = Object.getOwnPropertyDescriptor(base, property);

              if (desc.get) {
                return desc.get.call(receiver);
              }

              return desc.value;
            };
          }

          return _get(target, property, receiver || target);
        }

        function _superPropBase(object, property) {
          while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
          }

          return object;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.Socket = void 0;

        var socket_io_parser_1 = __webpack_require__(
        /*! socket.io-parser */
        "./node_modules/socket.io-parser/dist/index.js");

        var on_1 = __webpack_require__(
        /*! ./on */
        "./build/on.js");

        var typed_events_1 = __webpack_require__(
        /*! ./typed-events */
        "./build/typed-events.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("socket.io-client:socket");
        /**
         * Internal events.
         * These events can't be emitted by the user.
         */


        var RESERVED_EVENTS = Object.freeze({
          connect: 1,
          connect_error: 1,
          disconnect: 1,
          disconnecting: 1,
          // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
          newListener: 1,
          removeListener: 1
        });

        var Socket = /*#__PURE__*/function (_typed_events_1$Stric) {
          _inherits(Socket, _typed_events_1$Stric);

          var _super = _createSuper(Socket);
          /**
           * `Socket` constructor.
           *
           * @public
           */


          function Socket(io, nsp, opts) {
            var _this;

            _classCallCheck(this, Socket);

            _this = _super.call(this);
            _this.receiveBuffer = [];
            _this.sendBuffer = [];
            _this.ids = 0;
            _this.acks = {};
            _this.flags = {};
            _this.io = io;
            _this.nsp = nsp;
            _this.ids = 0;
            _this.acks = {};
            _this.receiveBuffer = [];
            _this.sendBuffer = [];
            _this.connected = false;
            _this.disconnected = true;
            _this.flags = {};

            if (opts && opts.auth) {
              _this.auth = opts.auth;
            }

            if (_this.io._autoConnect) _this.open();
            return _this;
          }
          /**
           * Subscribe to open, close and packet events
           *
           * @private
           */


          _createClass(Socket, [{
            key: "subEvents",
            value: function subEvents() {
              if (this.subs) return;
              var io = this.io;
              this.subs = [on_1.on(io, "open", this.onopen.bind(this)), on_1.on(io, "packet", this.onpacket.bind(this)), on_1.on(io, "error", this.onerror.bind(this)), on_1.on(io, "close", this.onclose.bind(this))];
            }
            /**
             * Whether the Socket will try to reconnect when its Manager connects or reconnects
             */

          }, {
            key: "active",
            get: function get() {
              return !!this.subs;
            }
            /**
             * "Opens" the socket.
             *
             * @public
             */

          }, {
            key: "connect",
            value: function connect() {
              if (this.connected) return this;
              this.subEvents();
              if (!this.io["_reconnecting"]) this.io.open(); // ensure open

              if ("open" === this.io._readyState) this.onopen();
              return this;
            }
            /**
             * Alias for connect()
             */

          }, {
            key: "open",
            value: function open() {
              return this.connect();
            }
            /**
             * Sends a `message` event.
             *
             * @return self
             * @public
             */

          }, {
            key: "send",
            value: function send() {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              args.unshift("message");
              this.emit.apply(this, args);
              return this;
            }
            /**
             * Override `emit`.
             * If the event is in `events`, it's emitted normally.
             *
             * @return self
             * @public
             */

          }, {
            key: "emit",
            value: function emit(ev) {
              if (RESERVED_EVENTS.hasOwnProperty(ev)) {
                throw new Error('"' + ev + '" is a reserved event name');
              }

              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              args.unshift(ev);
              var packet = {
                type: socket_io_parser_1.PacketType.EVENT,
                data: args
              };
              packet.options = {};
              packet.options.compress = this.flags.compress !== false; // event ack callback

              if ("function" === typeof args[args.length - 1]) {
                debug("emitting packet with ack id %d", this.ids);
                this.acks[this.ids] = args.pop();
                packet.id = this.ids++;
              }

              var isTransportWritable = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
              var discardPacket = this.flags["volatile"] && (!isTransportWritable || !this.connected);

              if (discardPacket) {
                debug("discard packet as the transport is not currently writable");
              } else if (this.connected) {
                this.packet(packet);
              } else {
                this.sendBuffer.push(packet);
              }

              this.flags = {};
              return this;
            }
            /**
             * Sends a packet.
             *
             * @param packet
             * @private
             */

          }, {
            key: "packet",
            value: function packet(_packet) {
              _packet.nsp = this.nsp;

              this.io._packet(_packet);
            }
            /**
             * Called upon engine `open`.
             *
             * @private
             */

          }, {
            key: "onopen",
            value: function onopen() {
              var _this2 = this;

              debug("transport is open - connecting");

              if (typeof this.auth == "function") {
                this.auth(function (data) {
                  _this2.packet({
                    type: socket_io_parser_1.PacketType.CONNECT,
                    data: data
                  });
                });
              } else {
                this.packet({
                  type: socket_io_parser_1.PacketType.CONNECT,
                  data: this.auth
                });
              }
            }
            /**
             * Called upon engine or manager `error`.
             *
             * @param err
             * @private
             */

          }, {
            key: "onerror",
            value: function onerror(err) {
              if (!this.connected) {
                this.emitReserved("connect_error", err);
              }
            }
            /**
             * Called upon engine `close`.
             *
             * @param reason
             * @private
             */

          }, {
            key: "onclose",
            value: function onclose(reason) {
              debug("close (%s)", reason);
              this.connected = false;
              this.disconnected = true;
              delete this.id;
              this.emitReserved("disconnect", reason);
            }
            /**
             * Called with socket packet.
             *
             * @param packet
             * @private
             */

          }, {
            key: "onpacket",
            value: function onpacket(packet) {
              var sameNamespace = packet.nsp === this.nsp;
              if (!sameNamespace) return;

              switch (packet.type) {
                case socket_io_parser_1.PacketType.CONNECT:
                  if (packet.data && packet.data.sid) {
                    var id = packet.data.sid;
                    this.onconnect(id);
                  } else {
                    this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                  }

                  break;

                case socket_io_parser_1.PacketType.EVENT:
                  this.onevent(packet);
                  break;

                case socket_io_parser_1.PacketType.BINARY_EVENT:
                  this.onevent(packet);
                  break;

                case socket_io_parser_1.PacketType.ACK:
                  this.onack(packet);
                  break;

                case socket_io_parser_1.PacketType.BINARY_ACK:
                  this.onack(packet);
                  break;

                case socket_io_parser_1.PacketType.DISCONNECT:
                  this.ondisconnect();
                  break;

                case socket_io_parser_1.PacketType.CONNECT_ERROR:
                  var err = new Error(packet.data.message); // @ts-ignore

                  err.data = packet.data.data;
                  this.emitReserved("connect_error", err);
                  break;
              }
            }
            /**
             * Called upon a server event.
             *
             * @param packet
             * @private
             */

          }, {
            key: "onevent",
            value: function onevent(packet) {
              var args = packet.data || [];
              debug("emitting event %j", args);

              if (null != packet.id) {
                debug("attaching ack callback to event");
                args.push(this.ack(packet.id));
              }

              if (this.connected) {
                this.emitEvent(args);
              } else {
                this.receiveBuffer.push(Object.freeze(args));
              }
            }
          }, {
            key: "emitEvent",
            value: function emitEvent(args) {
              if (this._anyListeners && this._anyListeners.length) {
                var listeners = this._anyListeners.slice();

                var _iterator = _createForOfIteratorHelper(listeners),
                    _step;

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var listener = _step.value;
                    listener.apply(this, args);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
              }

              _get(_getPrototypeOf(Socket.prototype), "emit", this).apply(this, args);
            }
            /**
             * Produces an ack callback to emit with an event.
             *
             * @private
             */

          }, {
            key: "ack",
            value: function ack(id) {
              var self = this;
              var sent = false;
              return function () {
                // prevent double callbacks
                if (sent) return;
                sent = true;

                for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                  args[_key3] = arguments[_key3];
                }

                debug("sending ack %j", args);
                self.packet({
                  type: socket_io_parser_1.PacketType.ACK,
                  id: id,
                  data: args
                });
              };
            }
            /**
             * Called upon a server acknowlegement.
             *
             * @param packet
             * @private
             */

          }, {
            key: "onack",
            value: function onack(packet) {
              var ack = this.acks[packet.id];

              if ("function" === typeof ack) {
                debug("calling ack %s with %j", packet.id, packet.data);
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
              } else {
                debug("bad ack %s", packet.id);
              }
            }
            /**
             * Called upon server connect.
             *
             * @private
             */

          }, {
            key: "onconnect",
            value: function onconnect(id) {
              debug("socket connected with id %s", id);
              this.id = id;
              this.connected = true;
              this.disconnected = false;
              this.emitBuffered();
              this.emitReserved("connect");
            }
            /**
             * Emit buffered events (received and emitted).
             *
             * @private
             */

          }, {
            key: "emitBuffered",
            value: function emitBuffered() {
              var _this3 = this;

              this.receiveBuffer.forEach(function (args) {
                return _this3.emitEvent(args);
              });
              this.receiveBuffer = [];
              this.sendBuffer.forEach(function (packet) {
                return _this3.packet(packet);
              });
              this.sendBuffer = [];
            }
            /**
             * Called upon server disconnect.
             *
             * @private
             */

          }, {
            key: "ondisconnect",
            value: function ondisconnect() {
              debug("server disconnect (%s)", this.nsp);
              this.destroy();
              this.onclose("io server disconnect");
            }
            /**
             * Called upon forced client/server side disconnections,
             * this method ensures the manager stops tracking us and
             * that reconnections don't get triggered for this.
             *
             * @private
             */

          }, {
            key: "destroy",
            value: function destroy() {
              if (this.subs) {
                // clean subscriptions to avoid reconnections
                this.subs.forEach(function (subDestroy) {
                  return subDestroy();
                });
                this.subs = undefined;
              }

              this.io["_destroy"](this);
            }
            /**
             * Disconnects the socket manually.
             *
             * @return self
             * @public
             */

          }, {
            key: "disconnect",
            value: function disconnect() {
              if (this.connected) {
                debug("performing disconnect (%s)", this.nsp);
                this.packet({
                  type: socket_io_parser_1.PacketType.DISCONNECT
                });
              } // remove socket from pool


              this.destroy();

              if (this.connected) {
                // fire events
                this.onclose("io client disconnect");
              }

              return this;
            }
            /**
             * Alias for disconnect()
             *
             * @return self
             * @public
             */

          }, {
            key: "close",
            value: function close() {
              return this.disconnect();
            }
            /**
             * Sets the compress flag.
             *
             * @param compress - if `true`, compresses the sending data
             * @return self
             * @public
             */

          }, {
            key: "compress",
            value: function compress(_compress) {
              this.flags.compress = _compress;
              return this;
            }
            /**
             * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
             * ready to send messages.
             *
             * @returns self
             * @public
             */

          }, {
            key: "volatile",
            get: function get() {
              this.flags["volatile"] = true;
              return this;
            }
            /**
             * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
             * callback.
             *
             * @param listener
             * @public
             */

          }, {
            key: "onAny",
            value: function onAny(listener) {
              this._anyListeners = this._anyListeners || [];

              this._anyListeners.push(listener);

              return this;
            }
            /**
             * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
             * callback. The listener is added to the beginning of the listeners array.
             *
             * @param listener
             * @public
             */

          }, {
            key: "prependAny",
            value: function prependAny(listener) {
              this._anyListeners = this._anyListeners || [];

              this._anyListeners.unshift(listener);

              return this;
            }
            /**
             * Removes the listener that will be fired when any event is emitted.
             *
             * @param listener
             * @public
             */

          }, {
            key: "offAny",
            value: function offAny(listener) {
              if (!this._anyListeners) {
                return this;
              }

              if (listener) {
                var listeners = this._anyListeners;

                for (var i = 0; i < listeners.length; i++) {
                  if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                  }
                }
              } else {
                this._anyListeners = [];
              }

              return this;
            }
            /**
             * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
             * e.g. to remove listeners.
             *
             * @public
             */

          }, {
            key: "listenersAny",
            value: function listenersAny() {
              return this._anyListeners || [];
            }
          }]);

          return Socket;
        }(typed_events_1.StrictEventEmitter);

        exports.Socket = Socket;
        /***/
      },

      /***/
      "./build/typed-events.js": function buildTypedEventsJs(module, exports, __webpack_require__) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _get(target, property, receiver) {
          if (typeof Reflect !== "undefined" && Reflect.get) {
            _get = Reflect.get;
          } else {
            _get = function _get(target, property, receiver) {
              var base = _superPropBase(target, property);

              if (!base) return;
              var desc = Object.getOwnPropertyDescriptor(base, property);

              if (desc.get) {
                return desc.get.call(receiver);
              }

              return desc.value;
            };
          }

          return _get(target, property, receiver || target);
        }

        function _superPropBase(object, property) {
          while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
          }

          return object;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.StrictEventEmitter = void 0;

        var Emitter = __webpack_require__(
        /*! component-emitter */
        "./node_modules/component-emitter/index.js");
        /**
         * Strictly typed version of an `EventEmitter`. A `TypedEventEmitter` takes type
         * parameters for mappings of event names to event data types, and strictly
         * types method calls to the `EventEmitter` according to these event maps.
         *
         * @typeParam ListenEvents - `EventsMap` of user-defined events that can be
         * listened to with `on` or `once`
         * @typeParam EmitEvents - `EventsMap` of user-defined events that can be
         * emitted with `emit`
         * @typeParam ReservedEvents - `EventsMap` of reserved events, that can be
         * emitted by socket.io with `emitReserved`, and can be listened to with
         * `listen`.
         */


        var StrictEventEmitter = /*#__PURE__*/function (_Emitter) {
          _inherits(StrictEventEmitter, _Emitter);

          var _super = _createSuper(StrictEventEmitter);

          function StrictEventEmitter() {
            _classCallCheck(this, StrictEventEmitter);

            return _super.apply(this, arguments);
          }

          _createClass(StrictEventEmitter, [{
            key: "on",
            value:
            /**
             * Adds the `listener` function as an event listener for `ev`.
             *
             * @param ev Name of the event
             * @param listener Callback function
             */
            function on(ev, listener) {
              _get(_getPrototypeOf(StrictEventEmitter.prototype), "on", this).call(this, ev, listener);

              return this;
            }
            /**
             * Adds a one-time `listener` function as an event listener for `ev`.
             *
             * @param ev Name of the event
             * @param listener Callback function
             */

          }, {
            key: "once",
            value: function once(ev, listener) {
              _get(_getPrototypeOf(StrictEventEmitter.prototype), "once", this).call(this, ev, listener);

              return this;
            }
            /**
             * Emits an event.
             *
             * @param ev Name of the event
             * @param args Values to send to listeners of this event
             */

          }, {
            key: "emit",
            value: function emit(ev) {
              var _get2;

              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }

              (_get2 = _get(_getPrototypeOf(StrictEventEmitter.prototype), "emit", this)).call.apply(_get2, [this, ev].concat(args));

              return this;
            }
            /**
             * Emits a reserved event.
             *
             * This method is `protected`, so that only a class extending
             * `StrictEventEmitter` can emit its own reserved events.
             *
             * @param ev Reserved event name
             * @param args Arguments to emit along with the event
             */

          }, {
            key: "emitReserved",
            value: function emitReserved(ev) {
              var _get3;

              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              (_get3 = _get(_getPrototypeOf(StrictEventEmitter.prototype), "emit", this)).call.apply(_get3, [this, ev].concat(args));

              return this;
            }
            /**
             * Returns the listeners listening to an event.
             *
             * @param event Event name
             * @returns Array of listeners subscribed to `event`
             */

          }, {
            key: "listeners",
            value: function listeners(event) {
              return _get(_getPrototypeOf(StrictEventEmitter.prototype), "listeners", this).call(this, event);
            }
          }]);

          return StrictEventEmitter;
        }(Emitter);

        exports.StrictEventEmitter = StrictEventEmitter;
        /***/
      },

      /***/
      "./build/url.js": function buildUrlJs(module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.url = void 0;

        var parseuri = __webpack_require__(
        /*! parseuri */
        "./node_modules/parseuri/index.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("socket.io-client:url");
        /**
         * URL parser.
         *
         * @param uri - url
         * @param path - the request path of the connection
         * @param loc - An object meant to mimic window.location.
         *        Defaults to window.location.
         * @public
         */


        function url(uri) {
          var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
          var loc = arguments.length > 2 ? arguments[2] : undefined;
          var obj = uri; // default to window.location

          loc = loc || typeof location !== "undefined" && location;
          if (null == uri) uri = loc.protocol + "//" + loc.host; // relative path support

          if (typeof uri === "string") {
            if ("/" === uri.charAt(0)) {
              if ("/" === uri.charAt(1)) {
                uri = loc.protocol + uri;
              } else {
                uri = loc.host + uri;
              }
            }

            if (!/^(https?|wss?):\/\//.test(uri)) {
              debug("protocol-less url %s", uri);

              if ("undefined" !== typeof loc) {
                uri = loc.protocol + "//" + uri;
              } else {
                uri = "https://" + uri;
              }
            } // parse


            debug("parse %s", uri);
            obj = parseuri(uri);
          } // make sure we treat `localhost:80` and `localhost` equally


          if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
              obj.port = "80";
            } else if (/^(http|ws)s$/.test(obj.protocol)) {
              obj.port = "443";
            }
          }

          obj.path = obj.path || "/";
          var ipv6 = obj.host.indexOf(":") !== -1;
          var host = ipv6 ? "[" + obj.host + "]" : obj.host; // define unique id

          obj.id = obj.protocol + "://" + host + ":" + obj.port + path; // define href

          obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
          return obj;
        }

        exports.url = url;
        /***/
      },

      /***/
      "./node_modules/backo2/index.js": function node_modulesBacko2IndexJs(module, exports) {
        /**
         * Expose `Backoff`.
         */
        module.exports = Backoff;
        /**
         * Initialize backoff timer with `opts`.
         *
         * - `min` initial timeout in milliseconds [100]
         * - `max` max timeout [10000]
         * - `jitter` [0]
         * - `factor` [2]
         *
         * @param {Object} opts
         * @api public
         */

        function Backoff(opts) {
          opts = opts || {};
          this.ms = opts.min || 100;
          this.max = opts.max || 10000;
          this.factor = opts.factor || 2;
          this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
          this.attempts = 0;
        }
        /**
         * Return the backoff duration.
         *
         * @return {Number}
         * @api public
         */


        Backoff.prototype.duration = function () {
          var ms = this.ms * Math.pow(this.factor, this.attempts++);

          if (this.jitter) {
            var rand = Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
          }

          return Math.min(ms, this.max) | 0;
        };
        /**
         * Reset the number of attempts.
         *
         * @api public
         */


        Backoff.prototype.reset = function () {
          this.attempts = 0;
        };
        /**
         * Set the minimum duration
         *
         * @api public
         */


        Backoff.prototype.setMin = function (min) {
          this.ms = min;
        };
        /**
         * Set the maximum duration
         *
         * @api public
         */


        Backoff.prototype.setMax = function (max) {
          this.max = max;
        };
        /**
         * Set the jitter
         *
         * @api public
         */


        Backoff.prototype.setJitter = function (jitter) {
          this.jitter = jitter;
        };
        /***/

      },

      /***/
      "./node_modules/component-emitter/index.js": function node_modulesComponentEmitterIndexJs(module, exports, __webpack_require__) {
        /**
         * Expose `Emitter`.
         */
        if (true) {
          module.exports = Emitter;
        }
        /**
         * Initialize a new `Emitter`.
         *
         * @api public
         */


        function Emitter(obj) {
          if (obj) return mixin(obj);
        }

        ;
        /**
         * Mixin the emitter properties.
         *
         * @param {Object} obj
         * @return {Object}
         * @api private
         */

        function mixin(obj) {
          for (var key in Emitter.prototype) {
            obj[key] = Emitter.prototype[key];
          }

          return obj;
        }
        /**
         * Listen on the given `event` with `fn`.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */


        Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
          this._callbacks = this._callbacks || {};
          (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
          return this;
        };
        /**
         * Adds an `event` listener that will be invoked a single
         * time then automatically removed.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */


        Emitter.prototype.once = function (event, fn) {
          function on() {
            this.off(event, on);
            fn.apply(this, arguments);
          }

          on.fn = fn;
          this.on(event, on);
          return this;
        };
        /**
         * Remove the given callback for `event` or all
         * registered callbacks.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */


        Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
          this._callbacks = this._callbacks || {}; // all

          if (0 == arguments.length) {
            this._callbacks = {};
            return this;
          } // specific event


          var callbacks = this._callbacks['$' + event];
          if (!callbacks) return this; // remove all handlers

          if (1 == arguments.length) {
            delete this._callbacks['$' + event];
            return this;
          } // remove specific handler


          var cb;

          for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];

            if (cb === fn || cb.fn === fn) {
              callbacks.splice(i, 1);
              break;
            }
          } // Remove event specific arrays for event types that no
          // one is subscribed for to avoid memory leak.


          if (callbacks.length === 0) {
            delete this._callbacks['$' + event];
          }

          return this;
        };
        /**
         * Emit `event` with the given args.
         *
         * @param {String} event
         * @param {Mixed} ...
         * @return {Emitter}
         */


        Emitter.prototype.emit = function (event) {
          this._callbacks = this._callbacks || {};
          var args = new Array(arguments.length - 1),
              callbacks = this._callbacks['$' + event];

          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }

          if (callbacks) {
            callbacks = callbacks.slice(0);

            for (var i = 0, len = callbacks.length; i < len; ++i) {
              callbacks[i].apply(this, args);
            }
          }

          return this;
        };
        /**
         * Return array of callbacks for `event`.
         *
         * @param {String} event
         * @return {Array}
         * @api public
         */


        Emitter.prototype.listeners = function (event) {
          this._callbacks = this._callbacks || {};
          return this._callbacks['$' + event] || [];
        };
        /**
         * Check if this emitter has `event` handlers.
         *
         * @param {String} event
         * @return {Boolean}
         * @api public
         */


        Emitter.prototype.hasListeners = function (event) {
          return !!this.listeners(event).length;
        };
        /***/

      },

      /***/
      "./node_modules/debug/src/browser.js": function node_modulesDebugSrcBrowserJs(module, exports, __webpack_require__) {
        /* eslint-env browser */

        /**
         * This is the web browser implementation of `debug()`.
         */
        exports.formatArgs = formatArgs;
        exports.save = save;
        exports.load = load;
        exports.useColors = useColors;
        exports.storage = localstorage();

        exports.destroy = function () {
          var warned = false;
          return function () {
            if (!warned) {
              warned = true;
              console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
            }
          };
        }();
        /**
         * Colors.
         */


        exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
        /**
         * Currently only WebKit-based Web Inspectors, Firefox >= v31,
         * and the Firebug extension (any Firefox version) are known
         * to support "%c" CSS customizations.
         *
         * TODO: add a `localStorage` variable to explicitly enable/disable colors
         */
        // eslint-disable-next-line complexity

        function useColors() {
          // NB: In an Electron preload script, document will be defined but not fully
          // initialized. Since we know we're in Chrome, we'll just detect this case
          // explicitly
          if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
            return true;
          } // Internet Explorer and Edge do not support colors.


          if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
            return false;
          } // Is webkit? http://stackoverflow.com/a/16459606/376773
          // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


          return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
          typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
          // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
          typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
          typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
        }
        /**
         * Colorize log arguments if enabled.
         *
         * @api public
         */


        function formatArgs(args) {
          args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

          if (!this.useColors) {
            return;
          }

          var c = 'color: ' + this.color;
          args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
          // arguments passed either before or after the %c, so we need to
          // figure out the correct index to insert the CSS into

          var index = 0;
          var lastC = 0;
          args[0].replace(/%[a-zA-Z%]/g, function (match) {
            if (match === '%%') {
              return;
            }

            index++;

            if (match === '%c') {
              // We only are interested in the *last* %c
              // (the user may have provided their own)
              lastC = index;
            }
          });
          args.splice(lastC, 0, c);
        }
        /**
         * Invokes `console.debug()` when available.
         * No-op when `console.debug` is not a "function".
         * If `console.debug` is not available, falls back
         * to `console.log`.
         *
         * @api public
         */


        exports.log = console.debug || console.log || function () {};
        /**
         * Save `namespaces`.
         *
         * @param {String} namespaces
         * @api private
         */


        function save(namespaces) {
          try {
            if (namespaces) {
              exports.storage.setItem('debug', namespaces);
            } else {
              exports.storage.removeItem('debug');
            }
          } catch (error) {// Swallow
            // XXX (@Qix-) should we be logging these?
          }
        }
        /**
         * Load `namespaces`.
         *
         * @return {String} returns the previously persisted debug modes
         * @api private
         */


        function load() {
          var r;

          try {
            r = exports.storage.getItem('debug');
          } catch (error) {// Swallow
            // XXX (@Qix-) should we be logging these?
          } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


          if (!r && typeof process !== 'undefined' && 'env' in process) {
            r = undefined;
          }

          return r;
        }
        /**
         * Localstorage attempts to return the localstorage.
         *
         * This is necessary because safari throws
         * when a user disables cookies/localstorage
         * and you attempt to access it.
         *
         * @return {LocalStorage}
         * @api private
         */


        function localstorage() {
          try {
            // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
            // The Browser also has localStorage in the global context.
            return localStorage;
          } catch (error) {// Swallow
            // XXX (@Qix-) should we be logging these?
          }
        }

        module.exports = __webpack_require__(
        /*! ./common */
        "./node_modules/debug/src/common.js")(exports);
        var formatters = module.exports.formatters;
        /**
         * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
         */

        formatters.j = function (v) {
          try {
            return JSON.stringify(v);
          } catch (error) {
            return '[UnexpectedJSONParseError]: ' + error.message;
          }
        };
        /***/

      },

      /***/
      "./node_modules/debug/src/common.js": function node_modulesDebugSrcCommonJs(module, exports, __webpack_require__) {
        function _toConsumableArray(arr) {
          return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
        }

        function _nonIterableSpread() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }

        function _unsupportedIterableToArray(o, minLen) {
          if (!o) return;
          if (typeof o === "string") return _arrayLikeToArray(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          if (n === "Object" && o.constructor) n = o.constructor.name;
          if (n === "Map" || n === "Set") return Array.from(o);
          if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }

        function _iterableToArray(iter) {
          if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
        }

        function _arrayWithoutHoles(arr) {
          if (Array.isArray(arr)) return _arrayLikeToArray(arr);
        }

        function _arrayLikeToArray(arr, len) {
          if (len == null || len > arr.length) len = arr.length;

          for (var i = 0, arr2 = new Array(len); i < len; i++) {
            arr2[i] = arr[i];
          }

          return arr2;
        }
        /**
         * This is the common logic for both the Node.js and web browser
         * implementations of `debug()`.
         */


        function setup(env) {
          createDebug.debug = createDebug;
          createDebug["default"] = createDebug;
          createDebug.coerce = coerce;
          createDebug.disable = disable;
          createDebug.enable = enable;
          createDebug.enabled = enabled;
          createDebug.humanize = __webpack_require__(
          /*! ms */
          "./node_modules/ms/index.js");
          createDebug.destroy = destroy;
          Object.keys(env).forEach(function (key) {
            createDebug[key] = env[key];
          });
          /**
          * The currently active debug mode names, and names to skip.
          */

          createDebug.names = [];
          createDebug.skips = [];
          /**
          * Map of special "%n" handling functions, for the debug "format" argument.
          *
          * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
          */

          createDebug.formatters = {};
          /**
          * Selects a color for a debug namespace
          * @param {String} namespace The namespace string for the for the debug instance to be colored
          * @return {Number|String} An ANSI color code for the given namespace
          * @api private
          */

          function selectColor(namespace) {
            var hash = 0;

            for (var i = 0; i < namespace.length; i++) {
              hash = (hash << 5) - hash + namespace.charCodeAt(i);
              hash |= 0; // Convert to 32bit integer
            }

            return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
          }

          createDebug.selectColor = selectColor;
          /**
          * Create a debugger with the given `namespace`.
          *
          * @param {String} namespace
          * @return {Function}
          * @api public
          */

          function createDebug(namespace) {
            var prevTime;
            var enableOverride = null;

            function debug() {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              } // Disabled?


              if (!debug.enabled) {
                return;
              }

              var self = debug; // Set `diff` timestamp

              var curr = Number(new Date());
              var ms = curr - (prevTime || curr);
              self.diff = ms;
              self.prev = prevTime;
              self.curr = curr;
              prevTime = curr;
              args[0] = createDebug.coerce(args[0]);

              if (typeof args[0] !== 'string') {
                // Anything else let's inspect with %O
                args.unshift('%O');
              } // Apply any `formatters` transformations


              var index = 0;
              args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
                // If we encounter an escaped % then don't increase the array index
                if (match === '%%') {
                  return '%';
                }

                index++;
                var formatter = createDebug.formatters[format];

                if (typeof formatter === 'function') {
                  var val = args[index];
                  match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

                  args.splice(index, 1);
                  index--;
                }

                return match;
              }); // Apply env-specific formatting (colors, etc.)

              createDebug.formatArgs.call(self, args);
              var logFn = self.log || createDebug.log;
              logFn.apply(self, args);
            }

            debug.namespace = namespace;
            debug.useColors = createDebug.useColors();
            debug.color = createDebug.selectColor(namespace);
            debug.extend = extend;
            debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

            Object.defineProperty(debug, 'enabled', {
              enumerable: true,
              configurable: false,
              get: function get() {
                return enableOverride === null ? createDebug.enabled(namespace) : enableOverride;
              },
              set: function set(v) {
                enableOverride = v;
              }
            }); // Env-specific initialization logic for debug instances

            if (typeof createDebug.init === 'function') {
              createDebug.init(debug);
            }

            return debug;
          }

          function extend(namespace, delimiter) {
            var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
            newDebug.log = this.log;
            return newDebug;
          }
          /**
          * Enables a debug mode by namespaces. This can include modes
          * separated by a colon and wildcards.
          *
          * @param {String} namespaces
          * @api public
          */


          function enable(namespaces) {
            createDebug.save(namespaces);
            createDebug.names = [];
            createDebug.skips = [];
            var i;
            var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
            var len = split.length;

            for (i = 0; i < len; i++) {
              if (!split[i]) {
                // ignore empty strings
                continue;
              }

              namespaces = split[i].replace(/\*/g, '.*?');

              if (namespaces[0] === '-') {
                createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
              } else {
                createDebug.names.push(new RegExp('^' + namespaces + '$'));
              }
            }
          }
          /**
          * Disable debug output.
          *
          * @return {String} namespaces
          * @api public
          */


          function disable() {
            var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
              return '-' + namespace;
            }))).join(',');
            createDebug.enable('');
            return namespaces;
          }
          /**
          * Returns true if the given mode name is enabled, false otherwise.
          *
          * @param {String} name
          * @return {Boolean}
          * @api public
          */


          function enabled(name) {
            if (name[name.length - 1] === '*') {
              return true;
            }

            var i;
            var len;

            for (i = 0, len = createDebug.skips.length; i < len; i++) {
              if (createDebug.skips[i].test(name)) {
                return false;
              }
            }

            for (i = 0, len = createDebug.names.length; i < len; i++) {
              if (createDebug.names[i].test(name)) {
                return true;
              }
            }

            return false;
          }
          /**
          * Convert regexp to namespace
          *
          * @param {RegExp} regxep
          * @return {String} namespace
          * @api private
          */


          function toNamespace(regexp) {
            return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
          }
          /**
          * Coerce `val`.
          *
          * @param {Mixed} val
          * @return {Mixed}
          * @api private
          */


          function coerce(val) {
            if (val instanceof Error) {
              return val.stack || val.message;
            }

            return val;
          }
          /**
          * XXX DO NOT USE. This is a temporary stub function.
          * XXX It WILL be removed in the next major release.
          */


          function destroy() {
            console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
          }

          createDebug.enable(createDebug.load());
          return createDebug;
        }

        module.exports = setup;
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/globalThis.browser.js": function node_modulesEngineIoClientLibGlobalThisBrowserJs(module, exports) {
        module.exports = function () {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else {
            return Function("return this")();
          }
        }();
        /***/

      },

      /***/
      "./node_modules/engine.io-client/lib/index.js": function node_modulesEngineIoClientLibIndexJs(module, exports, __webpack_require__) {
        var Socket = __webpack_require__(
        /*! ./socket */
        "./node_modules/engine.io-client/lib/socket.js");

        module.exports = function (uri, opts) {
          return new Socket(uri, opts);
        };
        /**
         * Expose deps for legacy compatibility
         * and standalone browser access.
         */


        module.exports.Socket = Socket;
        module.exports.protocol = Socket.protocol; // this is an int

        module.exports.Transport = __webpack_require__(
        /*! ./transport */
        "./node_modules/engine.io-client/lib/transport.js");
        module.exports.transports = __webpack_require__(
        /*! ./transports/index */
        "./node_modules/engine.io-client/lib/transports/index.js");
        module.exports.parser = __webpack_require__(
        /*! engine.io-parser */
        "./node_modules/engine.io-parser/lib/index.js");
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/socket.js": function node_modulesEngineIoClientLibSocketJs(module, exports, __webpack_require__) {
        function _extends() {
          _extends = Object.assign || function (target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];

              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }

            return target;
          };

          return _extends.apply(this, arguments);
        }

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        var transports = __webpack_require__(
        /*! ./transports/index */
        "./node_modules/engine.io-client/lib/transports/index.js");

        var Emitter = __webpack_require__(
        /*! component-emitter */
        "./node_modules/component-emitter/index.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("engine.io-client:socket");

        var parser = __webpack_require__(
        /*! engine.io-parser */
        "./node_modules/engine.io-parser/lib/index.js");

        var parseuri = __webpack_require__(
        /*! parseuri */
        "./node_modules/parseuri/index.js");

        var parseqs = __webpack_require__(
        /*! parseqs */
        "./node_modules/parseqs/index.js");

        var Socket = /*#__PURE__*/function (_Emitter) {
          _inherits(Socket, _Emitter);

          var _super = _createSuper(Socket);
          /**
           * Socket constructor.
           *
           * @param {String|Object} uri or options
           * @param {Object} options
           * @api public
           */


          function Socket(uri) {
            var _this;

            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            _classCallCheck(this, Socket);

            _this = _super.call(this);

            if (uri && "object" === _typeof(uri)) {
              opts = uri;
              uri = null;
            }

            if (uri) {
              uri = parseuri(uri);
              opts.hostname = uri.host;
              opts.secure = uri.protocol === "https" || uri.protocol === "wss";
              opts.port = uri.port;
              if (uri.query) opts.query = uri.query;
            } else if (opts.host) {
              opts.hostname = parseuri(opts.host).host;
            }

            _this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;

            if (opts.hostname && !opts.port) {
              // if no port is specified manually, use the protocol default
              opts.port = _this.secure ? "443" : "80";
            }

            _this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
            _this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : _this.secure ? 443 : 80);
            _this.transports = opts.transports || ["polling", "websocket"];
            _this.readyState = "";
            _this.writeBuffer = [];
            _this.prevBufferLen = 0;
            _this.opts = _extends({
              path: "/engine.io",
              agent: false,
              withCredentials: false,
              upgrade: true,
              jsonp: true,
              timestampParam: "t",
              rememberUpgrade: false,
              rejectUnauthorized: true,
              perMessageDeflate: {
                threshold: 1024
              },
              transportOptions: {},
              closeOnBeforeunload: true
            }, opts);
            _this.opts.path = _this.opts.path.replace(/\/$/, "") + "/";

            if (typeof _this.opts.query === "string") {
              _this.opts.query = parseqs.decode(_this.opts.query);
            } // set on handshake


            _this.id = null;
            _this.upgrades = null;
            _this.pingInterval = null;
            _this.pingTimeout = null; // set on heartbeat

            _this.pingTimeoutTimer = null;

            if (typeof addEventListener === "function") {
              if (_this.opts.closeOnBeforeunload) {
                // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                // closed/reloaded)
                addEventListener("beforeunload", function () {
                  if (_this.transport) {
                    // silently close the transport
                    _this.transport.removeAllListeners();

                    _this.transport.close();
                  }
                }, false);
              }

              if (_this.hostname !== "localhost") {
                _this.offlineEventListener = function () {
                  _this.onClose("transport close");
                };

                addEventListener("offline", _this.offlineEventListener, false);
              }
            }

            _this.open();

            return _this;
          }
          /**
           * Creates transport of the given type.
           *
           * @param {String} transport name
           * @return {Transport}
           * @api private
           */


          _createClass(Socket, [{
            key: "createTransport",
            value: function createTransport(name) {
              debug('creating transport "%s"', name);
              var query = clone(this.opts.query); // append engine.io protocol identifier

              query.EIO = parser.protocol; // transport name

              query.transport = name; // session id if we already have one

              if (this.id) query.sid = this.id;

              var opts = _extends({}, this.opts.transportOptions[name], this.opts, {
                query: query,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port
              });

              debug("options: %j", opts);
              return new transports[name](opts);
            }
            /**
             * Initializes transport to use and starts probe.
             *
             * @api private
             */

          }, {
            key: "open",
            value: function open() {
              var _this2 = this;

              var transport;

              if (this.opts.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) {
                transport = "websocket";
              } else if (0 === this.transports.length) {
                // Emit error on next tick so it can be listened to
                setTimeout(function () {
                  _this2.emit("error", "No transports available");
                }, 0);
                return;
              } else {
                transport = this.transports[0];
              }

              this.readyState = "opening"; // Retry with the next transport if the transport is disabled (jsonp: false)

              try {
                transport = this.createTransport(transport);
              } catch (e) {
                debug("error while creating transport: %s", e);
                this.transports.shift();
                this.open();
                return;
              }

              transport.open();
              this.setTransport(transport);
            }
            /**
             * Sets the current transport. Disables the existing one (if any).
             *
             * @api private
             */

          }, {
            key: "setTransport",
            value: function setTransport(transport) {
              var _this3 = this;

              debug("setting transport %s", transport.name);

              if (this.transport) {
                debug("clearing existing transport %s", this.transport.name);
                this.transport.removeAllListeners();
              } // set up transport


              this.transport = transport; // set up transport listeners

              transport.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", function () {
                _this3.onClose("transport close");
              });
            }
            /**
             * Probes a transport.
             *
             * @param {String} transport name
             * @api private
             */

          }, {
            key: "probe",
            value: function probe(name) {
              var _this4 = this;

              debug('probing transport "%s"', name);
              var transport = this.createTransport(name, {
                probe: 1
              });
              var failed = false;
              Socket.priorWebsocketSuccess = false;

              var onTransportOpen = function onTransportOpen() {
                if (failed) return;
                debug('probe transport "%s" opened', name);
                transport.send([{
                  type: "ping",
                  data: "probe"
                }]);
                transport.once("packet", function (msg) {
                  if (failed) return;

                  if ("pong" === msg.type && "probe" === msg.data) {
                    debug('probe transport "%s" pong', name);
                    _this4.upgrading = true;

                    _this4.emit("upgrading", transport);

                    if (!transport) return;
                    Socket.priorWebsocketSuccess = "websocket" === transport.name;
                    debug('pausing current transport "%s"', _this4.transport.name);

                    _this4.transport.pause(function () {
                      if (failed) return;
                      if ("closed" === _this4.readyState) return;
                      debug("changing transport and sending upgrade packet");
                      cleanup();

                      _this4.setTransport(transport);

                      transport.send([{
                        type: "upgrade"
                      }]);

                      _this4.emit("upgrade", transport);

                      transport = null;
                      _this4.upgrading = false;

                      _this4.flush();
                    });
                  } else {
                    debug('probe transport "%s" failed', name);
                    var err = new Error("probe error");
                    err.transport = transport.name;

                    _this4.emit("upgradeError", err);
                  }
                });
              };

              function freezeTransport() {
                if (failed) return; // Any callback called by transport should be ignored since now

                failed = true;
                cleanup();
                transport.close();
                transport = null;
              } // Handle any error that happens while probing


              var onerror = function onerror(err) {
                var error = new Error("probe error: " + err);
                error.transport = transport.name;
                freezeTransport();
                debug('probe transport "%s" failed because of error: %s', name, err);

                _this4.emit("upgradeError", error);
              };

              function onTransportClose() {
                onerror("transport closed");
              } // When the socket is closed while we're probing


              function onclose() {
                onerror("socket closed");
              } // When the socket is upgraded while we're probing


              function onupgrade(to) {
                if (transport && to.name !== transport.name) {
                  debug('"%s" works - aborting "%s"', to.name, transport.name);
                  freezeTransport();
                }
              } // Remove all listeners on the transport and on self


              var cleanup = function cleanup() {
                transport.removeListener("open", onTransportOpen);
                transport.removeListener("error", onerror);
                transport.removeListener("close", onTransportClose);

                _this4.removeListener("close", onclose);

                _this4.removeListener("upgrading", onupgrade);
              };

              transport.once("open", onTransportOpen);
              transport.once("error", onerror);
              transport.once("close", onTransportClose);
              this.once("close", onclose);
              this.once("upgrading", onupgrade);
              transport.open();
            }
            /**
             * Called when connection is deemed open.
             *
             * @api public
             */

          }, {
            key: "onOpen",
            value: function onOpen() {
              debug("socket open");
              this.readyState = "open";
              Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
              this.emit("open");
              this.flush(); // we check for `readyState` in case an `open`
              // listener already closed the socket

              if ("open" === this.readyState && this.opts.upgrade && this.transport.pause) {
                debug("starting upgrade probes");
                var i = 0;
                var l = this.upgrades.length;

                for (; i < l; i++) {
                  this.probe(this.upgrades[i]);
                }
              }
            }
            /**
             * Handles a packet.
             *
             * @api private
             */

          }, {
            key: "onPacket",
            value: function onPacket(packet) {
              if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
                this.emit("packet", packet); // Socket is live - any packet counts

                this.emit("heartbeat");

                switch (packet.type) {
                  case "open":
                    this.onHandshake(JSON.parse(packet.data));
                    break;

                  case "ping":
                    this.resetPingTimeout();
                    this.sendPacket("pong");
                    this.emit("ping");
                    this.emit("pong");
                    break;

                  case "error":
                    var err = new Error("server error");
                    err.code = packet.data;
                    this.onError(err);
                    break;

                  case "message":
                    this.emit("data", packet.data);
                    this.emit("message", packet.data);
                    break;
                }
              } else {
                debug('packet received with socket readyState "%s"', this.readyState);
              }
            }
            /**
             * Called upon handshake completion.
             *
             * @param {Object} handshake obj
             * @api private
             */

          }, {
            key: "onHandshake",
            value: function onHandshake(data) {
              this.emit("handshake", data);
              this.id = data.sid;
              this.transport.query.sid = data.sid;
              this.upgrades = this.filterUpgrades(data.upgrades);
              this.pingInterval = data.pingInterval;
              this.pingTimeout = data.pingTimeout;
              this.onOpen(); // In case open handler closes socket

              if ("closed" === this.readyState) return;
              this.resetPingTimeout();
            }
            /**
             * Sets and resets ping timeout timer based on server pings.
             *
             * @api private
             */

          }, {
            key: "resetPingTimeout",
            value: function resetPingTimeout() {
              var _this5 = this;

              clearTimeout(this.pingTimeoutTimer);
              this.pingTimeoutTimer = setTimeout(function () {
                _this5.onClose("ping timeout");
              }, this.pingInterval + this.pingTimeout);

              if (this.opts.autoUnref) {
                this.pingTimeoutTimer.unref();
              }
            }
            /**
             * Called on `drain` event
             *
             * @api private
             */

          }, {
            key: "onDrain",
            value: function onDrain() {
              this.writeBuffer.splice(0, this.prevBufferLen); // setting prevBufferLen = 0 is very important
              // for example, when upgrading, upgrade packet is sent over,
              // and a nonzero prevBufferLen could cause problems on `drain`

              this.prevBufferLen = 0;

              if (0 === this.writeBuffer.length) {
                this.emit("drain");
              } else {
                this.flush();
              }
            }
            /**
             * Flush write buffers.
             *
             * @api private
             */

          }, {
            key: "flush",
            value: function flush() {
              if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
                debug("flushing %d packets in socket", this.writeBuffer.length);
                this.transport.send(this.writeBuffer); // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`

                this.prevBufferLen = this.writeBuffer.length;
                this.emit("flush");
              }
            }
            /**
             * Sends a message.
             *
             * @param {String} message.
             * @param {Function} callback function.
             * @param {Object} options.
             * @return {Socket} for chaining.
             * @api public
             */

          }, {
            key: "write",
            value: function write(msg, options, fn) {
              this.sendPacket("message", msg, options, fn);
              return this;
            }
          }, {
            key: "send",
            value: function send(msg, options, fn) {
              this.sendPacket("message", msg, options, fn);
              return this;
            }
            /**
             * Sends a packet.
             *
             * @param {String} packet type.
             * @param {String} data.
             * @param {Object} options.
             * @param {Function} callback function.
             * @api private
             */

          }, {
            key: "sendPacket",
            value: function sendPacket(type, data, options, fn) {
              if ("function" === typeof data) {
                fn = data;
                data = undefined;
              }

              if ("function" === typeof options) {
                fn = options;
                options = null;
              }

              if ("closing" === this.readyState || "closed" === this.readyState) {
                return;
              }

              options = options || {};
              options.compress = false !== options.compress;
              var packet = {
                type: type,
                data: data,
                options: options
              };
              this.emit("packetCreate", packet);
              this.writeBuffer.push(packet);
              if (fn) this.once("flush", fn);
              this.flush();
            }
            /**
             * Closes the connection.
             *
             * @api private
             */

          }, {
            key: "close",
            value: function close() {
              var _this6 = this;

              var close = function close() {
                _this6.onClose("forced close");

                debug("socket closing - telling transport to close");

                _this6.transport.close();
              };

              var cleanupAndClose = function cleanupAndClose() {
                _this6.removeListener("upgrade", cleanupAndClose);

                _this6.removeListener("upgradeError", cleanupAndClose);

                close();
              };

              var waitForUpgrade = function waitForUpgrade() {
                // wait for upgrade to finish since we can't send packets while pausing a transport
                _this6.once("upgrade", cleanupAndClose);

                _this6.once("upgradeError", cleanupAndClose);
              };

              if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";

                if (this.writeBuffer.length) {
                  this.once("drain", function () {
                    if (_this6.upgrading) {
                      waitForUpgrade();
                    } else {
                      close();
                    }
                  });
                } else if (this.upgrading) {
                  waitForUpgrade();
                } else {
                  close();
                }
              }

              return this;
            }
            /**
             * Called upon transport error
             *
             * @api private
             */

          }, {
            key: "onError",
            value: function onError(err) {
              debug("socket error %j", err);
              Socket.priorWebsocketSuccess = false;
              this.emit("error", err);
              this.onClose("transport error", err);
            }
            /**
             * Called upon transport close.
             *
             * @api private
             */

          }, {
            key: "onClose",
            value: function onClose(reason, desc) {
              if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                debug('socket close with reason: "%s"', reason); // clear timers

                clearTimeout(this.pingIntervalTimer);
                clearTimeout(this.pingTimeoutTimer); // stop event from firing again for transport

                this.transport.removeAllListeners("close"); // ensure transport won't stay open

                this.transport.close(); // ignore further transport communication

                this.transport.removeAllListeners();

                if (typeof removeEventListener === "function") {
                  removeEventListener("offline", this.offlineEventListener, false);
                } // set ready state


                this.readyState = "closed"; // clear session id

                this.id = null; // emit close event

                this.emit("close", reason, desc); // clean buffers after, so users can still
                // grab the buffers on `close` event

                this.writeBuffer = [];
                this.prevBufferLen = 0;
              }
            }
            /**
             * Filters upgrades, returning only those matching client transports.
             *
             * @param {Array} server upgrades
             * @api private
             *
             */

          }, {
            key: "filterUpgrades",
            value: function filterUpgrades(upgrades) {
              var filteredUpgrades = [];
              var i = 0;
              var j = upgrades.length;

              for (; i < j; i++) {
                if (~this.transports.indexOf(upgrades[i])) filteredUpgrades.push(upgrades[i]);
              }

              return filteredUpgrades;
            }
          }]);

          return Socket;
        }(Emitter);

        Socket.priorWebsocketSuccess = false;
        /**
         * Protocol version.
         *
         * @api public
         */

        Socket.protocol = parser.protocol; // this is an int

        function clone(obj) {
          var o = {};

          for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              o[i] = obj[i];
            }
          }

          return o;
        }

        module.exports = Socket;
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/transport.js": function node_modulesEngineIoClientLibTransportJs(module, exports, __webpack_require__) {
        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        var parser = __webpack_require__(
        /*! engine.io-parser */
        "./node_modules/engine.io-parser/lib/index.js");

        var Emitter = __webpack_require__(
        /*! component-emitter */
        "./node_modules/component-emitter/index.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("engine.io-client:transport");

        var Transport = /*#__PURE__*/function (_Emitter) {
          _inherits(Transport, _Emitter);

          var _super = _createSuper(Transport);
          /**
           * Transport abstract constructor.
           *
           * @param {Object} options.
           * @api private
           */


          function Transport(opts) {
            var _this;

            _classCallCheck(this, Transport);

            _this = _super.call(this);
            _this.opts = opts;
            _this.query = opts.query;
            _this.readyState = "";
            _this.socket = opts.socket;
            return _this;
          }
          /**
           * Emits an error.
           *
           * @param {String} str
           * @return {Transport} for chaining
           * @api public
           */


          _createClass(Transport, [{
            key: "onError",
            value: function onError(msg, desc) {
              var err = new Error(msg);
              err.type = "TransportError";
              err.description = desc;
              this.emit("error", err);
              return this;
            }
            /**
             * Opens the transport.
             *
             * @api public
             */

          }, {
            key: "open",
            value: function open() {
              if ("closed" === this.readyState || "" === this.readyState) {
                this.readyState = "opening";
                this.doOpen();
              }

              return this;
            }
            /**
             * Closes the transport.
             *
             * @api private
             */

          }, {
            key: "close",
            value: function close() {
              if ("opening" === this.readyState || "open" === this.readyState) {
                this.doClose();
                this.onClose();
              }

              return this;
            }
            /**
             * Sends multiple packets.
             *
             * @param {Array} packets
             * @api private
             */

          }, {
            key: "send",
            value: function send(packets) {
              if ("open" === this.readyState) {
                this.write(packets);
              } else {
                // this might happen if the transport was silently closed in the beforeunload event handler
                debug("transport is not open, discarding packets");
              }
            }
            /**
             * Called upon open
             *
             * @api private
             */

          }, {
            key: "onOpen",
            value: function onOpen() {
              this.readyState = "open";
              this.writable = true;
              this.emit("open");
            }
            /**
             * Called with data.
             *
             * @param {String} data
             * @api private
             */

          }, {
            key: "onData",
            value: function onData(data) {
              var packet = parser.decodePacket(data, this.socket.binaryType);
              this.onPacket(packet);
            }
            /**
             * Called with a decoded packet.
             */

          }, {
            key: "onPacket",
            value: function onPacket(packet) {
              this.emit("packet", packet);
            }
            /**
             * Called upon close.
             *
             * @api private
             */

          }, {
            key: "onClose",
            value: function onClose() {
              this.readyState = "closed";
              this.emit("close");
            }
          }]);

          return Transport;
        }(Emitter);

        module.exports = Transport;
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/transports/index.js": function node_modulesEngineIoClientLibTransportsIndexJs(module, exports, __webpack_require__) {
        var XMLHttpRequest = __webpack_require__(
        /*! ../../contrib/xmlhttprequest-ssl/XMLHttpRequest */
        "./node_modules/engine.io-client/lib/xmlhttprequest.js");

        var XHR = __webpack_require__(
        /*! ./polling-xhr */
        "./node_modules/engine.io-client/lib/transports/polling-xhr.js");

        var JSONP = __webpack_require__(
        /*! ./polling-jsonp */
        "./node_modules/engine.io-client/lib/transports/polling-jsonp.js");

        var websocket = __webpack_require__(
        /*! ./websocket */
        "./node_modules/engine.io-client/lib/transports/websocket.js");

        exports.polling = polling;
        exports.websocket = websocket;
        /**
         * Polling transport polymorphic constructor.
         * Decides on xhr vs jsonp based on feature detection.
         *
         * @api private
         */

        function polling(opts) {
          var xhr;
          var xd = false;
          var xs = false;
          var jsonp = false !== opts.jsonp;

          if (typeof location !== "undefined") {
            var isSSL = "https:" === location.protocol;
            var port = location.port; // some user agents have empty `location.port`

            if (!port) {
              port = isSSL ? 443 : 80;
            }

            xd = opts.hostname !== location.hostname || port !== opts.port;
            xs = opts.secure !== isSSL;
          }

          opts.xdomain = xd;
          opts.xscheme = xs;
          xhr = new XMLHttpRequest(opts);

          if ("open" in xhr && !opts.forceJSONP) {
            return new XHR(opts);
          } else {
            if (!jsonp) throw new Error("JSONP disabled");
            return new JSONP(opts);
          }
        }
        /***/

      },

      /***/
      "./node_modules/engine.io-client/lib/transports/polling-jsonp.js": function node_modulesEngineIoClientLibTransportsPollingJsonpJs(module, exports, __webpack_require__) {
        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _get(target, property, receiver) {
          if (typeof Reflect !== "undefined" && Reflect.get) {
            _get = Reflect.get;
          } else {
            _get = function _get(target, property, receiver) {
              var base = _superPropBase(target, property);

              if (!base) return;
              var desc = Object.getOwnPropertyDescriptor(base, property);

              if (desc.get) {
                return desc.get.call(receiver);
              }

              return desc.value;
            };
          }

          return _get(target, property, receiver || target);
        }

        function _superPropBase(object, property) {
          while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
          }

          return object;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        var Polling = __webpack_require__(
        /*! ./polling */
        "./node_modules/engine.io-client/lib/transports/polling.js");

        var globalThis = __webpack_require__(
        /*! ../globalThis */
        "./node_modules/engine.io-client/lib/globalThis.browser.js");

        var rNewline = /\n/g;
        var rEscapedNewline = /\\n/g;
        /**
         * Global JSONP callbacks.
         */

        var callbacks;

        var JSONPPolling = /*#__PURE__*/function (_Polling) {
          _inherits(JSONPPolling, _Polling);

          var _super = _createSuper(JSONPPolling);
          /**
           * JSONP Polling constructor.
           *
           * @param {Object} opts.
           * @api public
           */


          function JSONPPolling(opts) {
            var _this;

            _classCallCheck(this, JSONPPolling);

            _this = _super.call(this, opts);
            _this.query = _this.query || {}; // define global callbacks array if not present
            // we do this here (lazily) to avoid unneeded global pollution

            if (!callbacks) {
              // we need to consider multiple engines in the same page
              callbacks = globalThis.___eio = globalThis.___eio || [];
            } // callback identifier


            _this.index = callbacks.length; // add callback to jsonp global

            callbacks.push(_this.onData.bind(_assertThisInitialized(_this))); // append to query string

            _this.query.j = _this.index;
            return _this;
          }
          /**
           * JSONP only supports binary as base64 encoded strings
           */


          _createClass(JSONPPolling, [{
            key: "supportsBinary",
            get: function get() {
              return false;
            }
            /**
             * Closes the socket.
             *
             * @api private
             */

          }, {
            key: "doClose",
            value: function doClose() {
              if (this.script) {
                // prevent spurious errors from being emitted when the window is unloaded
                this.script.onerror = function () {};

                this.script.parentNode.removeChild(this.script);
                this.script = null;
              }

              if (this.form) {
                this.form.parentNode.removeChild(this.form);
                this.form = null;
                this.iframe = null;
              }

              _get(_getPrototypeOf(JSONPPolling.prototype), "doClose", this).call(this);
            }
            /**
             * Starts a poll cycle.
             *
             * @api private
             */

          }, {
            key: "doPoll",
            value: function doPoll() {
              var _this2 = this;

              var script = document.createElement("script");

              if (this.script) {
                this.script.parentNode.removeChild(this.script);
                this.script = null;
              }

              script.async = true;
              script.src = this.uri();

              script.onerror = function (e) {
                _this2.onError("jsonp poll error", e);
              };

              var insertAt = document.getElementsByTagName("script")[0];

              if (insertAt) {
                insertAt.parentNode.insertBefore(script, insertAt);
              } else {
                (document.head || document.body).appendChild(script);
              }

              this.script = script;
              var isUAgecko = "undefined" !== typeof navigator && /gecko/i.test(navigator.userAgent);

              if (isUAgecko) {
                setTimeout(function () {
                  var iframe = document.createElement("iframe");
                  document.body.appendChild(iframe);
                  document.body.removeChild(iframe);
                }, 100);
              }
            }
            /**
             * Writes with a hidden iframe.
             *
             * @param {String} data to send
             * @param {Function} called upon flush.
             * @api private
             */

          }, {
            key: "doWrite",
            value: function doWrite(data, fn) {
              var _this3 = this;

              var iframe;

              if (!this.form) {
                var form = document.createElement("form");
                var area = document.createElement("textarea");
                var id = this.iframeId = "eio_iframe_" + this.index;
                form.className = "socketio";
                form.style.position = "absolute";
                form.style.top = "-1000px";
                form.style.left = "-1000px";
                form.target = id;
                form.method = "POST";
                form.setAttribute("accept-charset", "utf-8");
                area.name = "d";
                form.appendChild(area);
                document.body.appendChild(form);
                this.form = form;
                this.area = area;
              }

              this.form.action = this.uri();

              function complete() {
                initIframe();
                fn();
              }

              var initIframe = function initIframe() {
                if (_this3.iframe) {
                  try {
                    _this3.form.removeChild(_this3.iframe);
                  } catch (e) {
                    _this3.onError("jsonp polling iframe removal error", e);
                  }
                }

                try {
                  // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
                  var html = '<iframe src="javascript:0" name="' + _this3.iframeId + '">';
                  iframe = document.createElement(html);
                } catch (e) {
                  iframe = document.createElement("iframe");
                  iframe.name = _this3.iframeId;
                  iframe.src = "javascript:0";
                }

                iframe.id = _this3.iframeId;

                _this3.form.appendChild(iframe);

                _this3.iframe = iframe;
              };

              initIframe(); // escape \n to prevent it from being converted into \r\n by some UAs
              // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side

              data = data.replace(rEscapedNewline, "\\\n");
              this.area.value = data.replace(rNewline, "\\n");

              try {
                this.form.submit();
              } catch (e) {}

              if (this.iframe.attachEvent) {
                this.iframe.onreadystatechange = function () {
                  if (_this3.iframe.readyState === "complete") {
                    complete();
                  }
                };
              } else {
                this.iframe.onload = complete;
              }
            }
          }]);

          return JSONPPolling;
        }(Polling);

        module.exports = JSONPPolling;
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/transports/polling-xhr.js": function node_modulesEngineIoClientLibTransportsPollingXhrJs(module, exports, __webpack_require__) {
        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _extends() {
          _extends = Object.assign || function (target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];

              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }

            return target;
          };

          return _extends.apply(this, arguments);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }
        /* global attachEvent */


        var XMLHttpRequest = __webpack_require__(
        /*! ../../contrib/xmlhttprequest-ssl/XMLHttpRequest */
        "./node_modules/engine.io-client/lib/xmlhttprequest.js");

        var Polling = __webpack_require__(
        /*! ./polling */
        "./node_modules/engine.io-client/lib/transports/polling.js");

        var Emitter = __webpack_require__(
        /*! component-emitter */
        "./node_modules/component-emitter/index.js");

        var _require = __webpack_require__(
        /*! ../util */
        "./node_modules/engine.io-client/lib/util.js"),
            pick = _require.pick;

        var globalThis = __webpack_require__(
        /*! ../globalThis */
        "./node_modules/engine.io-client/lib/globalThis.browser.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("engine.io-client:polling-xhr");
        /**
         * Empty function
         */


        function empty() {}

        var hasXHR2 = function () {
          var xhr = new XMLHttpRequest({
            xdomain: false
          });
          return null != xhr.responseType;
        }();

        var XHR = /*#__PURE__*/function (_Polling) {
          _inherits(XHR, _Polling);

          var _super = _createSuper(XHR);
          /**
           * XHR Polling constructor.
           *
           * @param {Object} opts
           * @api public
           */


          function XHR(opts) {
            var _this;

            _classCallCheck(this, XHR);

            _this = _super.call(this, opts);

            if (typeof location !== "undefined") {
              var isSSL = "https:" === location.protocol;
              var port = location.port; // some user agents have empty `location.port`

              if (!port) {
                port = isSSL ? 443 : 80;
              }

              _this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
              _this.xs = opts.secure !== isSSL;
            }
            /**
             * XHR supports binary
             */


            var forceBase64 = opts && opts.forceBase64;
            _this.supportsBinary = hasXHR2 && !forceBase64;
            return _this;
          }
          /**
           * Creates a request.
           *
           * @param {String} method
           * @api private
           */


          _createClass(XHR, [{
            key: "request",
            value: function request() {
              var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

              _extends(opts, {
                xd: this.xd,
                xs: this.xs
              }, this.opts);

              return new Request(this.uri(), opts);
            }
            /**
             * Sends data.
             *
             * @param {String} data to send.
             * @param {Function} called upon flush.
             * @api private
             */

          }, {
            key: "doWrite",
            value: function doWrite(data, fn) {
              var _this2 = this;

              var req = this.request({
                method: "POST",
                data: data
              });
              req.on("success", fn);
              req.on("error", function (err) {
                _this2.onError("xhr post error", err);
              });
            }
            /**
             * Starts a poll cycle.
             *
             * @api private
             */

          }, {
            key: "doPoll",
            value: function doPoll() {
              var _this3 = this;

              debug("xhr poll");
              var req = this.request();
              req.on("data", this.onData.bind(this));
              req.on("error", function (err) {
                _this3.onError("xhr poll error", err);
              });
              this.pollXhr = req;
            }
          }]);

          return XHR;
        }(Polling);

        var Request = /*#__PURE__*/function (_Emitter) {
          _inherits(Request, _Emitter);

          var _super2 = _createSuper(Request);
          /**
           * Request constructor
           *
           * @param {Object} options
           * @api public
           */


          function Request(uri, opts) {
            var _this4;

            _classCallCheck(this, Request);

            _this4 = _super2.call(this);
            _this4.opts = opts;
            _this4.method = opts.method || "GET";
            _this4.uri = uri;
            _this4.async = false !== opts.async;
            _this4.data = undefined !== opts.data ? opts.data : null;

            _this4.create();

            return _this4;
          }
          /**
           * Creates the XHR object and sends the request.
           *
           * @api private
           */


          _createClass(Request, [{
            key: "create",
            value: function create() {
              var _this5 = this;

              var opts = pick(this.opts, "agent", "enablesXDR", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
              opts.xdomain = !!this.opts.xd;
              opts.xscheme = !!this.opts.xs;
              var xhr = this.xhr = new XMLHttpRequest(opts);

              try {
                debug("xhr open %s: %s", this.method, this.uri);
                xhr.open(this.method, this.uri, this.async);

                try {
                  if (this.opts.extraHeaders) {
                    xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);

                    for (var i in this.opts.extraHeaders) {
                      if (this.opts.extraHeaders.hasOwnProperty(i)) {
                        xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                      }
                    }
                  }
                } catch (e) {}

                if ("POST" === this.method) {
                  try {
                    xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                  } catch (e) {}
                }

                try {
                  xhr.setRequestHeader("Accept", "*/*");
                } catch (e) {} // ie6 check


                if ("withCredentials" in xhr) {
                  xhr.withCredentials = this.opts.withCredentials;
                }

                if (this.opts.requestTimeout) {
                  xhr.timeout = this.opts.requestTimeout;
                }

                if (this.hasXDR()) {
                  xhr.onload = function () {
                    _this5.onLoad();
                  };

                  xhr.onerror = function () {
                    _this5.onError(xhr.responseText);
                  };
                } else {
                  xhr.onreadystatechange = function () {
                    if (4 !== xhr.readyState) return;

                    if (200 === xhr.status || 1223 === xhr.status) {
                      _this5.onLoad();
                    } else {
                      // make sure the `error` event handler that's user-set
                      // does not throw in the same tick and gets caught here
                      setTimeout(function () {
                        _this5.onError(typeof xhr.status === "number" ? xhr.status : 0);
                      }, 0);
                    }
                  };
                }

                debug("xhr data %s", this.data);
                xhr.send(this.data);
              } catch (e) {
                // Need to defer since .create() is called directly from the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                setTimeout(function () {
                  _this5.onError(e);
                }, 0);
                return;
              }

              if (typeof document !== "undefined") {
                this.index = Request.requestsCount++;
                Request.requests[this.index] = this;
              }
            }
            /**
             * Called upon successful response.
             *
             * @api private
             */

          }, {
            key: "onSuccess",
            value: function onSuccess() {
              this.emit("success");
              this.cleanup();
            }
            /**
             * Called if we have data.
             *
             * @api private
             */

          }, {
            key: "onData",
            value: function onData(data) {
              this.emit("data", data);
              this.onSuccess();
            }
            /**
             * Called upon error.
             *
             * @api private
             */

          }, {
            key: "onError",
            value: function onError(err) {
              this.emit("error", err);
              this.cleanup(true);
            }
            /**
             * Cleans up house.
             *
             * @api private
             */

          }, {
            key: "cleanup",
            value: function cleanup(fromError) {
              if ("undefined" === typeof this.xhr || null === this.xhr) {
                return;
              } // xmlhttprequest


              if (this.hasXDR()) {
                this.xhr.onload = this.xhr.onerror = empty;
              } else {
                this.xhr.onreadystatechange = empty;
              }

              if (fromError) {
                try {
                  this.xhr.abort();
                } catch (e) {}
              }

              if (typeof document !== "undefined") {
                delete Request.requests[this.index];
              }

              this.xhr = null;
            }
            /**
             * Called upon load.
             *
             * @api private
             */

          }, {
            key: "onLoad",
            value: function onLoad() {
              var data = this.xhr.responseText;

              if (data !== null) {
                this.onData(data);
              }
            }
            /**
             * Check if it has XDomainRequest.
             *
             * @api private
             */

          }, {
            key: "hasXDR",
            value: function hasXDR() {
              return typeof XDomainRequest !== "undefined" && !this.xs && this.enablesXDR;
            }
            /**
             * Aborts the request.
             *
             * @api public
             */

          }, {
            key: "abort",
            value: function abort() {
              this.cleanup();
            }
          }]);

          return Request;
        }(Emitter);
        /**
         * Aborts pending requests when unloading the window. This is needed to prevent
         * memory leaks (e.g. when using IE) and to ensure that no spurious error is
         * emitted.
         */


        Request.requestsCount = 0;
        Request.requests = {};

        if (typeof document !== "undefined") {
          if (typeof attachEvent === "function") {
            attachEvent("onunload", unloadHandler);
          } else if (typeof addEventListener === "function") {
            var terminationEvent = "onpagehide" in globalThis ? "pagehide" : "unload";
            addEventListener(terminationEvent, unloadHandler, false);
          }
        }

        function unloadHandler() {
          for (var i in Request.requests) {
            if (Request.requests.hasOwnProperty(i)) {
              Request.requests[i].abort();
            }
          }
        }

        module.exports = XHR;
        module.exports.Request = Request;
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/transports/polling.js": function node_modulesEngineIoClientLibTransportsPollingJs(module, exports, __webpack_require__) {
        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        var Transport = __webpack_require__(
        /*! ../transport */
        "./node_modules/engine.io-client/lib/transport.js");

        var parseqs = __webpack_require__(
        /*! parseqs */
        "./node_modules/parseqs/index.js");

        var parser = __webpack_require__(
        /*! engine.io-parser */
        "./node_modules/engine.io-parser/lib/index.js");

        var yeast = __webpack_require__(
        /*! yeast */
        "./node_modules/yeast/index.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("engine.io-client:polling");

        var Polling = /*#__PURE__*/function (_Transport) {
          _inherits(Polling, _Transport);

          var _super = _createSuper(Polling);

          function Polling() {
            _classCallCheck(this, Polling);

            return _super.apply(this, arguments);
          }

          _createClass(Polling, [{
            key: "name",
            get:
            /**
             * Transport name.
             */
            function get() {
              return "polling";
            }
            /**
             * Opens the socket (triggers polling). We write a PING message to determine
             * when the transport is open.
             *
             * @api private
             */

          }, {
            key: "doOpen",
            value: function doOpen() {
              this.poll();
            }
            /**
             * Pauses polling.
             *
             * @param {Function} callback upon buffers are flushed and transport is paused
             * @api private
             */

          }, {
            key: "pause",
            value: function pause(onPause) {
              var _this = this;

              this.readyState = "pausing";

              var pause = function pause() {
                debug("paused");
                _this.readyState = "paused";
                onPause();
              };

              if (this.polling || !this.writable) {
                var total = 0;

                if (this.polling) {
                  debug("we are currently polling - waiting to pause");
                  total++;
                  this.once("pollComplete", function () {
                    debug("pre-pause polling complete");
                    --total || pause();
                  });
                }

                if (!this.writable) {
                  debug("we are currently writing - waiting to pause");
                  total++;
                  this.once("drain", function () {
                    debug("pre-pause writing complete");
                    --total || pause();
                  });
                }
              } else {
                pause();
              }
            }
            /**
             * Starts polling cycle.
             *
             * @api public
             */

          }, {
            key: "poll",
            value: function poll() {
              debug("polling");
              this.polling = true;
              this.doPoll();
              this.emit("poll");
            }
            /**
             * Overloads onData to detect payloads.
             *
             * @api private
             */

          }, {
            key: "onData",
            value: function onData(data) {
              var _this2 = this;

              debug("polling got data %s", data);

              var callback = function callback(packet) {
                // if its the first message we consider the transport open
                if ("opening" === _this2.readyState && packet.type === "open") {
                  _this2.onOpen();
                } // if its a close packet, we close the ongoing requests


                if ("close" === packet.type) {
                  _this2.onClose();

                  return false;
                } // otherwise bypass onData and handle the message


                _this2.onPacket(packet);
              }; // decode payload


              parser.decodePayload(data, this.socket.binaryType).forEach(callback); // if an event did not trigger closing

              if ("closed" !== this.readyState) {
                // if we got data we're not polling
                this.polling = false;
                this.emit("pollComplete");

                if ("open" === this.readyState) {
                  this.poll();
                } else {
                  debug('ignoring poll - transport state "%s"', this.readyState);
                }
              }
            }
            /**
             * For polling, send a close packet.
             *
             * @api private
             */

          }, {
            key: "doClose",
            value: function doClose() {
              var _this3 = this;

              var close = function close() {
                debug("writing close packet");

                _this3.write([{
                  type: "close"
                }]);
              };

              if ("open" === this.readyState) {
                debug("transport open - closing");
                close();
              } else {
                // in case we're trying to close while
                // handshaking is in progress (GH-164)
                debug("transport not open - deferring close");
                this.once("open", close);
              }
            }
            /**
             * Writes a packets payload.
             *
             * @param {Array} data packets
             * @param {Function} drain callback
             * @api private
             */

          }, {
            key: "write",
            value: function write(packets) {
              var _this4 = this;

              this.writable = false;
              parser.encodePayload(packets, function (data) {
                _this4.doWrite(data, function () {
                  _this4.writable = true;

                  _this4.emit("drain");
                });
              });
            }
            /**
             * Generates uri for connection.
             *
             * @api private
             */

          }, {
            key: "uri",
            value: function uri() {
              var query = this.query || {};
              var schema = this.opts.secure ? "https" : "http";
              var port = ""; // cache busting is forced

              if (false !== this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
              }

              if (!this.supportsBinary && !query.sid) {
                query.b64 = 1;
              }

              query = parseqs.encode(query); // avoid port if default for schema

              if (this.opts.port && ("https" === schema && Number(this.opts.port) !== 443 || "http" === schema && Number(this.opts.port) !== 80)) {
                port = ":" + this.opts.port;
              } // prepend ? to query


              if (query.length) {
                query = "?" + query;
              }

              var ipv6 = this.opts.hostname.indexOf(":") !== -1;
              return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + query;
            }
          }]);

          return Polling;
        }(Transport);

        module.exports = Polling;
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/transports/websocket-constructor.browser.js": function node_modulesEngineIoClientLibTransportsWebsocketConstructorBrowserJs(module, exports, __webpack_require__) {
        var globalThis = __webpack_require__(
        /*! ../globalThis */
        "./node_modules/engine.io-client/lib/globalThis.browser.js");

        var nextTick = function () {
          var isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";

          if (isPromiseAvailable) {
            return function (cb) {
              return Promise.resolve().then(cb);
            };
          } else {
            return function (cb) {
              return setTimeout(cb, 0);
            };
          }
        }();

        module.exports = {
          WebSocket: globalThis.WebSocket || globalThis.MozWebSocket,
          usingBrowserWebSocket: true,
          defaultBinaryType: "arraybuffer",
          nextTick: nextTick
        };
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/transports/websocket.js": function node_modulesEngineIoClientLibTransportsWebsocketJs(module, exports, __webpack_require__) {
        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        var Transport = __webpack_require__(
        /*! ../transport */
        "./node_modules/engine.io-client/lib/transport.js");

        var parser = __webpack_require__(
        /*! engine.io-parser */
        "./node_modules/engine.io-parser/lib/index.js");

        var parseqs = __webpack_require__(
        /*! parseqs */
        "./node_modules/parseqs/index.js");

        var yeast = __webpack_require__(
        /*! yeast */
        "./node_modules/yeast/index.js");

        var _require = __webpack_require__(
        /*! ../util */
        "./node_modules/engine.io-client/lib/util.js"),
            pick = _require.pick;

        var _require2 = __webpack_require__(
        /*! ./websocket-constructor */
        "./node_modules/engine.io-client/lib/transports/websocket-constructor.browser.js"),
            WebSocket = _require2.WebSocket,
            usingBrowserWebSocket = _require2.usingBrowserWebSocket,
            defaultBinaryType = _require2.defaultBinaryType,
            nextTick = _require2.nextTick;

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("engine.io-client:websocket"); // detect ReactNative environment


        var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";

        var WS = /*#__PURE__*/function (_Transport) {
          _inherits(WS, _Transport);

          var _super = _createSuper(WS);
          /**
           * WebSocket transport constructor.
           *
           * @api {Object} connection options
           * @api public
           */


          function WS(opts) {
            var _this;

            _classCallCheck(this, WS);

            _this = _super.call(this, opts);
            _this.supportsBinary = !opts.forceBase64;
            return _this;
          }
          /**
           * Transport name.
           *
           * @api public
           */


          _createClass(WS, [{
            key: "name",
            get: function get() {
              return "websocket";
            }
            /**
             * Opens socket.
             *
             * @api private
             */

          }, {
            key: "doOpen",
            value: function doOpen() {
              if (!this.check()) {
                // let probe timeout
                return;
              }

              var uri = this.uri();
              var protocols = this.opts.protocols; // React Native only supports the 'headers' option, and will print a warning if anything else is passed

              var opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");

              if (this.opts.extraHeaders) {
                opts.headers = this.opts.extraHeaders;
              }

              try {
                this.ws = usingBrowserWebSocket && !isReactNative ? protocols ? new WebSocket(uri, protocols) : new WebSocket(uri) : new WebSocket(uri, protocols, opts);
              } catch (err) {
                return this.emit("error", err);
              }

              this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
              this.addEventListeners();
            }
            /**
             * Adds event listeners to the socket
             *
             * @api private
             */

          }, {
            key: "addEventListeners",
            value: function addEventListeners() {
              var _this2 = this;

              this.ws.onopen = function () {
                if (_this2.opts.autoUnref) {
                  _this2.ws._socket.unref();
                }

                _this2.onOpen();
              };

              this.ws.onclose = this.onClose.bind(this);

              this.ws.onmessage = function (ev) {
                return _this2.onData(ev.data);
              };

              this.ws.onerror = function (e) {
                return _this2.onError("websocket error", e);
              };
            }
            /**
             * Writes data to socket.
             *
             * @param {Array} array of packets.
             * @api private
             */

          }, {
            key: "write",
            value: function write(packets) {
              var _this3 = this;

              this.writable = false; // encodePacket efficient as it uses WS framing
              // no need for encodePayload

              var _loop = function _loop(i) {
                var packet = packets[i];
                var lastPacket = i === packets.length - 1;
                parser.encodePacket(packet, _this3.supportsBinary, function (data) {
                  // always create a new object (GH-437)
                  var opts = {};

                  if (!usingBrowserWebSocket) {
                    if (packet.options) {
                      opts.compress = packet.options.compress;
                    }

                    if (_this3.opts.perMessageDeflate) {
                      var len = "string" === typeof data ? Buffer.byteLength(data) : data.length;

                      if (len < _this3.opts.perMessageDeflate.threshold) {
                        opts.compress = false;
                      }
                    }
                  } // Sometimes the websocket has already been closed but the browser didn't
                  // have a chance of informing us about it yet, in that case send will
                  // throw an error


                  try {
                    if (usingBrowserWebSocket) {
                      // TypeError is thrown when passing the second argument on Safari
                      _this3.ws.send(data);
                    } else {
                      _this3.ws.send(data, opts);
                    }
                  } catch (e) {
                    debug("websocket closed before onclose event");
                  }

                  if (lastPacket) {
                    // fake drain
                    // defer to next tick to allow Socket to clear writeBuffer
                    nextTick(function () {
                      _this3.writable = true;

                      _this3.emit("drain");
                    });
                  }
                });
              };

              for (var i = 0; i < packets.length; i++) {
                _loop(i);
              }
            }
            /**
             * Called upon close
             *
             * @api private
             */

          }, {
            key: "onClose",
            value: function onClose() {
              Transport.prototype.onClose.call(this);
            }
            /**
             * Closes socket.
             *
             * @api private
             */

          }, {
            key: "doClose",
            value: function doClose() {
              if (typeof this.ws !== "undefined") {
                this.ws.close();
                this.ws = null;
              }
            }
            /**
             * Generates uri for connection.
             *
             * @api private
             */

          }, {
            key: "uri",
            value: function uri() {
              var query = this.query || {};
              var schema = this.opts.secure ? "wss" : "ws";
              var port = ""; // avoid port if default for schema

              if (this.opts.port && ("wss" === schema && Number(this.opts.port) !== 443 || "ws" === schema && Number(this.opts.port) !== 80)) {
                port = ":" + this.opts.port;
              } // append timestamp to URI


              if (this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
              } // communicate binary support capabilities


              if (!this.supportsBinary) {
                query.b64 = 1;
              }

              query = parseqs.encode(query); // prepend ? to query

              if (query.length) {
                query = "?" + query;
              }

              var ipv6 = this.opts.hostname.indexOf(":") !== -1;
              return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + query;
            }
            /**
             * Feature detection for WebSocket.
             *
             * @return {Boolean} whether this transport is available.
             * @api public
             */

          }, {
            key: "check",
            value: function check() {
              return !!WebSocket && !("__initialize" in WebSocket && this.name === WS.prototype.name);
            }
          }]);

          return WS;
        }(Transport);

        module.exports = WS;
        /***/
      },

      /***/
      "./node_modules/engine.io-client/lib/util.js": function node_modulesEngineIoClientLibUtilJs(module, exports) {
        module.exports.pick = function (obj) {
          for (var _len = arguments.length, attr = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            attr[_key - 1] = arguments[_key];
          }

          return attr.reduce(function (acc, k) {
            if (obj.hasOwnProperty(k)) {
              acc[k] = obj[k];
            }

            return acc;
          }, {});
        };
        /***/

      },

      /***/
      "./node_modules/engine.io-client/lib/xmlhttprequest.js": function node_modulesEngineIoClientLibXmlhttprequestJs(module, exports, __webpack_require__) {
        // browser shim for xmlhttprequest module
        var hasCORS = __webpack_require__(
        /*! has-cors */
        "./node_modules/has-cors/index.js");

        var globalThis = __webpack_require__(
        /*! ./globalThis */
        "./node_modules/engine.io-client/lib/globalThis.browser.js");

        module.exports = function (opts) {
          var xdomain = opts.xdomain; // scheme must be same when usign XDomainRequest
          // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx

          var xscheme = opts.xscheme; // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
          // https://github.com/Automattic/engine.io-client/pull/217

          var enablesXDR = opts.enablesXDR; // XMLHttpRequest can be disabled on IE

          try {
            if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
              return new XMLHttpRequest();
            }
          } catch (e) {} // Use XDomainRequest for IE8 if enablesXDR is true
          // because loading bar keeps flashing when using jsonp-polling
          // https://github.com/yujiosaka/socke.io-ie8-loading-example


          try {
            if ("undefined" !== typeof XDomainRequest && !xscheme && enablesXDR) {
              return new XDomainRequest();
            }
          } catch (e) {}

          if (!xdomain) {
            try {
              return new globalThis[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
            } catch (e) {}
          }
        };
        /***/

      },

      /***/
      "./node_modules/engine.io-parser/lib/commons.js": function node_modulesEngineIoParserLibCommonsJs(module, exports) {
        var PACKET_TYPES = Object.create(null); // no Map = no polyfill

        PACKET_TYPES["open"] = "0";
        PACKET_TYPES["close"] = "1";
        PACKET_TYPES["ping"] = "2";
        PACKET_TYPES["pong"] = "3";
        PACKET_TYPES["message"] = "4";
        PACKET_TYPES["upgrade"] = "5";
        PACKET_TYPES["noop"] = "6";
        var PACKET_TYPES_REVERSE = Object.create(null);
        Object.keys(PACKET_TYPES).forEach(function (key) {
          PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
        });
        var ERROR_PACKET = {
          type: "error",
          data: "parser error"
        };
        module.exports = {
          PACKET_TYPES: PACKET_TYPES,
          PACKET_TYPES_REVERSE: PACKET_TYPES_REVERSE,
          ERROR_PACKET: ERROR_PACKET
        };
        /***/
      },

      /***/
      "./node_modules/engine.io-parser/lib/decodePacket.browser.js": function node_modulesEngineIoParserLibDecodePacketBrowserJs(module, exports, __webpack_require__) {
        var _require = __webpack_require__(
        /*! ./commons */
        "./node_modules/engine.io-parser/lib/commons.js"),
            PACKET_TYPES_REVERSE = _require.PACKET_TYPES_REVERSE,
            ERROR_PACKET = _require.ERROR_PACKET;

        var withNativeArrayBuffer = typeof ArrayBuffer === "function";
        var base64decoder;

        if (withNativeArrayBuffer) {
          base64decoder = __webpack_require__(
          /*! base64-arraybuffer */
          "./node_modules/engine.io-parser/node_modules/base64-arraybuffer/lib/base64-arraybuffer.js");
        }

        var decodePacket = function decodePacket(encodedPacket, binaryType) {
          if (typeof encodedPacket !== "string") {
            return {
              type: "message",
              data: mapBinary(encodedPacket, binaryType)
            };
          }

          var type = encodedPacket.charAt(0);

          if (type === "b") {
            return {
              type: "message",
              data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
          }

          var packetType = PACKET_TYPES_REVERSE[type];

          if (!packetType) {
            return ERROR_PACKET;
          }

          return encodedPacket.length > 1 ? {
            type: PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1)
          } : {
            type: PACKET_TYPES_REVERSE[type]
          };
        };

        var decodeBase64Packet = function decodeBase64Packet(data, binaryType) {
          if (base64decoder) {
            var decoded = base64decoder.decode(data);
            return mapBinary(decoded, binaryType);
          } else {
            return {
              base64: true,
              data: data
            }; // fallback for old browsers
          }
        };

        var mapBinary = function mapBinary(data, binaryType) {
          switch (binaryType) {
            case "blob":
              return data instanceof ArrayBuffer ? new Blob([data]) : data;

            case "arraybuffer":
            default:
              return data;
            // assuming the data is already an ArrayBuffer
          }
        };

        module.exports = decodePacket;
        /***/
      },

      /***/
      "./node_modules/engine.io-parser/lib/encodePacket.browser.js": function node_modulesEngineIoParserLibEncodePacketBrowserJs(module, exports, __webpack_require__) {
        var _require = __webpack_require__(
        /*! ./commons */
        "./node_modules/engine.io-parser/lib/commons.js"),
            PACKET_TYPES = _require.PACKET_TYPES;

        var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
        var withNativeArrayBuffer = typeof ArrayBuffer === "function"; // ArrayBuffer.isView method is not defined in IE10

        var isView = function isView(obj) {
          return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
        };

        var encodePacket = function encodePacket(_ref, supportsBinary, callback) {
          var type = _ref.type,
              data = _ref.data;

          if (withNativeBlob && data instanceof Blob) {
            if (supportsBinary) {
              return callback(data);
            } else {
              return encodeBlobAsBase64(data, callback);
            }
          } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
            if (supportsBinary) {
              return callback(data instanceof ArrayBuffer ? data : data.buffer);
            } else {
              return encodeBlobAsBase64(new Blob([data]), callback);
            }
          } // plain string


          return callback(PACKET_TYPES[type] + (data || ""));
        };

        var encodeBlobAsBase64 = function encodeBlobAsBase64(data, callback) {
          var fileReader = new FileReader();

          fileReader.onload = function () {
            var content = fileReader.result.split(",")[1];
            callback("b" + content);
          };

          return fileReader.readAsDataURL(data);
        };

        module.exports = encodePacket;
        /***/
      },

      /***/
      "./node_modules/engine.io-parser/lib/index.js": function node_modulesEngineIoParserLibIndexJs(module, exports, __webpack_require__) {
        var encodePacket = __webpack_require__(
        /*! ./encodePacket */
        "./node_modules/engine.io-parser/lib/encodePacket.browser.js");

        var decodePacket = __webpack_require__(
        /*! ./decodePacket */
        "./node_modules/engine.io-parser/lib/decodePacket.browser.js");

        var SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text

        var encodePayload = function encodePayload(packets, callback) {
          // some packets may be added to the array while encoding, so the initial length must be saved
          var length = packets.length;
          var encodedPackets = new Array(length);
          var count = 0;
          packets.forEach(function (packet, i) {
            // force base64 encoding for binary packets
            encodePacket(packet, false, function (encodedPacket) {
              encodedPackets[i] = encodedPacket;

              if (++count === length) {
                callback(encodedPackets.join(SEPARATOR));
              }
            });
          });
        };

        var decodePayload = function decodePayload(encodedPayload, binaryType) {
          var encodedPackets = encodedPayload.split(SEPARATOR);
          var packets = [];

          for (var i = 0; i < encodedPackets.length; i++) {
            var decodedPacket = decodePacket(encodedPackets[i], binaryType);
            packets.push(decodedPacket);

            if (decodedPacket.type === "error") {
              break;
            }
          }

          return packets;
        };

        module.exports = {
          protocol: 4,
          encodePacket: encodePacket,
          encodePayload: encodePayload,
          decodePacket: decodePacket,
          decodePayload: decodePayload
        };
        /***/
      },

      /***/
      "./node_modules/engine.io-parser/node_modules/base64-arraybuffer/lib/base64-arraybuffer.js": function node_modulesEngineIoParserNode_modulesBase64ArraybufferLibBase64ArraybufferJs(module, exports) {
        /*
         * base64-arraybuffer
         * https://github.com/niklasvh/base64-arraybuffer
         *
         * Copyright (c) 2012 Niklas von Hertzen
         * Licensed under the MIT license.
         */
        (function (chars) {
          "use strict";

          exports.encode = function (arraybuffer) {
            var bytes = new Uint8Array(arraybuffer),
                i,
                len = bytes.length,
                base64 = "";

            for (i = 0; i < len; i += 3) {
              base64 += chars[bytes[i] >> 2];
              base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
              base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
              base64 += chars[bytes[i + 2] & 63];
            }

            if (len % 3 === 2) {
              base64 = base64.substring(0, base64.length - 1) + "=";
            } else if (len % 3 === 1) {
              base64 = base64.substring(0, base64.length - 2) + "==";
            }

            return base64;
          };

          exports.decode = function (base64) {
            var bufferLength = base64.length * 0.75,
                len = base64.length,
                i,
                p = 0,
                encoded1,
                encoded2,
                encoded3,
                encoded4;

            if (base64[base64.length - 1] === "=") {
              bufferLength--;

              if (base64[base64.length - 2] === "=") {
                bufferLength--;
              }
            }

            var arraybuffer = new ArrayBuffer(bufferLength),
                bytes = new Uint8Array(arraybuffer);

            for (i = 0; i < len; i += 4) {
              encoded1 = chars.indexOf(base64[i]);
              encoded2 = chars.indexOf(base64[i + 1]);
              encoded3 = chars.indexOf(base64[i + 2]);
              encoded4 = chars.indexOf(base64[i + 3]);
              bytes[p++] = encoded1 << 2 | encoded2 >> 4;
              bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
              bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
            }

            return arraybuffer;
          };
        })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
        /***/

      },

      /***/
      "./node_modules/has-cors/index.js": function node_modulesHasCorsIndexJs(module, exports) {
        /**
         * Module exports.
         *
         * Logic borrowed from Modernizr:
         *
         *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
         */
        try {
          module.exports = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest();
        } catch (err) {
          // if XMLHttp support is disabled in IE then it will throw
          // when trying to create
          module.exports = false;
        }
        /***/

      },

      /***/
      "./node_modules/ms/index.js": function node_modulesMsIndexJs(module, exports) {
        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }
        /**
         * Helpers.
         */


        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var w = d * 7;
        var y = d * 365.25;
        /**
         * Parse or format the given `val`.
         *
         * Options:
         *
         *  - `long` verbose formatting [false]
         *
         * @param {String|Number} val
         * @param {Object} [options]
         * @throws {Error} throw an error if val is not a non-empty string or a number
         * @return {String|Number}
         * @api public
         */

        module.exports = function (val, options) {
          options = options || {};

          var type = _typeof(val);

          if (type === 'string' && val.length > 0) {
            return parse(val);
          } else if (type === 'number' && isFinite(val)) {
            return options["long"] ? fmtLong(val) : fmtShort(val);
          }

          throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
        };
        /**
         * Parse the given `str` and return milliseconds.
         *
         * @param {String} str
         * @return {Number}
         * @api private
         */


        function parse(str) {
          str = String(str);

          if (str.length > 100) {
            return;
          }

          var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);

          if (!match) {
            return;
          }

          var n = parseFloat(match[1]);
          var type = (match[2] || 'ms').toLowerCase();

          switch (type) {
            case 'years':
            case 'year':
            case 'yrs':
            case 'yr':
            case 'y':
              return n * y;

            case 'weeks':
            case 'week':
            case 'w':
              return n * w;

            case 'days':
            case 'day':
            case 'd':
              return n * d;

            case 'hours':
            case 'hour':
            case 'hrs':
            case 'hr':
            case 'h':
              return n * h;

            case 'minutes':
            case 'minute':
            case 'mins':
            case 'min':
            case 'm':
              return n * m;

            case 'seconds':
            case 'second':
            case 'secs':
            case 'sec':
            case 's':
              return n * s;

            case 'milliseconds':
            case 'millisecond':
            case 'msecs':
            case 'msec':
            case 'ms':
              return n;

            default:
              return undefined;
          }
        }
        /**
         * Short format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */


        function fmtShort(ms) {
          var msAbs = Math.abs(ms);

          if (msAbs >= d) {
            return Math.round(ms / d) + 'd';
          }

          if (msAbs >= h) {
            return Math.round(ms / h) + 'h';
          }

          if (msAbs >= m) {
            return Math.round(ms / m) + 'm';
          }

          if (msAbs >= s) {
            return Math.round(ms / s) + 's';
          }

          return ms + 'ms';
        }
        /**
         * Long format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */


        function fmtLong(ms) {
          var msAbs = Math.abs(ms);

          if (msAbs >= d) {
            return plural(ms, msAbs, d, 'day');
          }

          if (msAbs >= h) {
            return plural(ms, msAbs, h, 'hour');
          }

          if (msAbs >= m) {
            return plural(ms, msAbs, m, 'minute');
          }

          if (msAbs >= s) {
            return plural(ms, msAbs, s, 'second');
          }

          return ms + ' ms';
        }
        /**
         * Pluralization helper.
         */


        function plural(ms, msAbs, n, name) {
          var isPlural = msAbs >= n * 1.5;
          return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
        }
        /***/

      },

      /***/
      "./node_modules/parseqs/index.js": function node_modulesParseqsIndexJs(module, exports) {
        /**
         * Compiles a querystring
         * Returns string representation of the object
         *
         * @param {Object}
         * @api private
         */
        exports.encode = function (obj) {
          var str = '';

          for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              if (str.length) str += '&';
              str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
            }
          }

          return str;
        };
        /**
         * Parses a simple querystring into an object
         *
         * @param {String} qs
         * @api private
         */


        exports.decode = function (qs) {
          var qry = {};
          var pairs = qs.split('&');

          for (var i = 0, l = pairs.length; i < l; i++) {
            var pair = pairs[i].split('=');
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
          }

          return qry;
        };
        /***/

      },

      /***/
      "./node_modules/parseuri/index.js": function node_modulesParseuriIndexJs(module, exports) {
        /**
         * Parses an URI
         *
         * @author Steven Levithan <stevenlevithan.com> (MIT license)
         * @api private
         */
        var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
        var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];

        module.exports = function parseuri(str) {
          var src = str,
              b = str.indexOf('['),
              e = str.indexOf(']');

          if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
          }

          var m = re.exec(str || ''),
              uri = {},
              i = 14;

          while (i--) {
            uri[parts[i]] = m[i] || '';
          }

          if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
          }

          uri.pathNames = pathNames(uri, uri['path']);
          uri.queryKey = queryKey(uri, uri['query']);
          return uri;
        };

        function pathNames(obj, path) {
          var regx = /\/{2,9}/g,
              names = path.replace(regx, "/").split("/");

          if (path.substr(0, 1) == '/' || path.length === 0) {
            names.splice(0, 1);
          }

          if (path.substr(path.length - 1, 1) == '/') {
            names.splice(names.length - 1, 1);
          }

          return names;
        }

        function queryKey(uri, query) {
          var data = {};
          query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            if ($1) {
              data[$1] = $2;
            }
          });
          return data;
        }
        /***/

      },

      /***/
      "./node_modules/socket.io-parser/dist/binary.js": function node_modulesSocketIoParserDistBinaryJs(module, exports, __webpack_require__) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.reconstructPacket = exports.deconstructPacket = void 0;

        var is_binary_1 = __webpack_require__(
        /*! ./is-binary */
        "./node_modules/socket.io-parser/dist/is-binary.js");
        /**
         * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
         *
         * @param {Object} packet - socket.io event packet
         * @return {Object} with deconstructed packet and list of buffers
         * @public
         */


        function deconstructPacket(packet) {
          var buffers = [];
          var packetData = packet.data;
          var pack = packet;
          pack.data = _deconstructPacket(packetData, buffers);
          pack.attachments = buffers.length; // number of binary 'attachments'

          return {
            packet: pack,
            buffers: buffers
          };
        }

        exports.deconstructPacket = deconstructPacket;

        function _deconstructPacket(data, buffers) {
          if (!data) return data;

          if (is_binary_1.isBinary(data)) {
            var placeholder = {
              _placeholder: true,
              num: buffers.length
            };
            buffers.push(data);
            return placeholder;
          } else if (Array.isArray(data)) {
            var newData = new Array(data.length);

            for (var i = 0; i < data.length; i++) {
              newData[i] = _deconstructPacket(data[i], buffers);
            }

            return newData;
          } else if (_typeof(data) === "object" && !(data instanceof Date)) {
            var _newData = {};

            for (var key in data) {
              if (data.hasOwnProperty(key)) {
                _newData[key] = _deconstructPacket(data[key], buffers);
              }
            }

            return _newData;
          }

          return data;
        }
        /**
         * Reconstructs a binary packet from its placeholder packet and buffers
         *
         * @param {Object} packet - event packet with placeholders
         * @param {Array} buffers - binary buffers to put in placeholder positions
         * @return {Object} reconstructed packet
         * @public
         */


        function reconstructPacket(packet, buffers) {
          packet.data = _reconstructPacket(packet.data, buffers);
          packet.attachments = undefined; // no longer useful

          return packet;
        }

        exports.reconstructPacket = reconstructPacket;

        function _reconstructPacket(data, buffers) {
          if (!data) return data;

          if (data && data._placeholder) {
            return buffers[data.num]; // appropriate buffer (should be natural order anyway)
          } else if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
              data[i] = _reconstructPacket(data[i], buffers);
            }
          } else if (_typeof(data) === "object") {
            for (var key in data) {
              if (data.hasOwnProperty(key)) {
                data[key] = _reconstructPacket(data[key], buffers);
              }
            }
          }

          return data;
        }
        /***/

      },

      /***/
      "./node_modules/socket.io-parser/dist/index.js": function node_modulesSocketIoParserDistIndexJs(module, exports, __webpack_require__) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _get(target, property, receiver) {
          if (typeof Reflect !== "undefined" && Reflect.get) {
            _get = Reflect.get;
          } else {
            _get = function _get(target, property, receiver) {
              var base = _superPropBase(target, property);

              if (!base) return;
              var desc = Object.getOwnPropertyDescriptor(base, property);

              if (desc.get) {
                return desc.get.call(receiver);
              }

              return desc.value;
            };
          }

          return _get(target, property, receiver || target);
        }

        function _superPropBase(object, property) {
          while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
          }

          return object;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();

          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;

            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;

              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }

            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;

        var Emitter = __webpack_require__(
        /*! component-emitter */
        "./node_modules/component-emitter/index.js");

        var binary_1 = __webpack_require__(
        /*! ./binary */
        "./node_modules/socket.io-parser/dist/binary.js");

        var is_binary_1 = __webpack_require__(
        /*! ./is-binary */
        "./node_modules/socket.io-parser/dist/is-binary.js");

        var debug = __webpack_require__(
        /*! debug */
        "./node_modules/debug/src/browser.js")("socket.io-parser");
        /**
         * Protocol version.
         *
         * @public
         */


        exports.protocol = 5;
        var PacketType;

        (function (PacketType) {
          PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
          PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
          PacketType[PacketType["EVENT"] = 2] = "EVENT";
          PacketType[PacketType["ACK"] = 3] = "ACK";
          PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
          PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
          PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
        })(PacketType = exports.PacketType || (exports.PacketType = {}));
        /**
         * A socket.io Encoder instance
         */


        var Encoder = /*#__PURE__*/function () {
          function Encoder() {
            _classCallCheck(this, Encoder);
          }

          _createClass(Encoder, [{
            key: "encode",
            value:
            /**
             * Encode a packet as a single string if non-binary, or as a
             * buffer sequence, depending on packet type.
             *
             * @param {Object} obj - packet object
             */
            function encode(obj) {
              debug("encoding packet %j", obj);

              if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
                if (is_binary_1.hasBinary(obj)) {
                  obj.type = obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK;
                  return this.encodeAsBinary(obj);
                }
              }

              return [this.encodeAsString(obj)];
            }
            /**
             * Encode packet as string.
             */

          }, {
            key: "encodeAsString",
            value: function encodeAsString(obj) {
              // first is type
              var str = "" + obj.type; // attachments if we have them

              if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
                str += obj.attachments + "-";
              } // if we have a namespace other than `/`
              // we append it followed by a comma `,`


              if (obj.nsp && "/" !== obj.nsp) {
                str += obj.nsp + ",";
              } // immediately followed by the id


              if (null != obj.id) {
                str += obj.id;
              } // json data


              if (null != obj.data) {
                str += JSON.stringify(obj.data);
              }

              debug("encoded %j as %s", obj, str);
              return str;
            }
            /**
             * Encode packet as 'buffer sequence' by removing blobs, and
             * deconstructing packet into object with placeholders and
             * a list of buffers.
             */

          }, {
            key: "encodeAsBinary",
            value: function encodeAsBinary(obj) {
              var deconstruction = binary_1.deconstructPacket(obj);
              var pack = this.encodeAsString(deconstruction.packet);
              var buffers = deconstruction.buffers;
              buffers.unshift(pack); // add packet info to beginning of data list

              return buffers; // write all the buffers
            }
          }]);

          return Encoder;
        }();

        exports.Encoder = Encoder;
        /**
         * A socket.io Decoder instance
         *
         * @return {Object} decoder
         */

        var Decoder = /*#__PURE__*/function (_Emitter) {
          _inherits(Decoder, _Emitter);

          var _super = _createSuper(Decoder);

          function Decoder() {
            _classCallCheck(this, Decoder);

            return _super.call(this);
          }
          /**
           * Decodes an encoded packet string into packet JSON.
           *
           * @param {String} obj - encoded packet
           */


          _createClass(Decoder, [{
            key: "add",
            value: function add(obj) {
              var packet;

              if (typeof obj === "string") {
                packet = this.decodeString(obj);

                if (packet.type === PacketType.BINARY_EVENT || packet.type === PacketType.BINARY_ACK) {
                  // binary packet's json
                  this.reconstructor = new BinaryReconstructor(packet); // no attachments, labeled binary but no binary data to follow

                  if (packet.attachments === 0) {
                    _get(_getPrototypeOf(Decoder.prototype), "emit", this).call(this, "decoded", packet);
                  }
                } else {
                  // non-binary full packet
                  _get(_getPrototypeOf(Decoder.prototype), "emit", this).call(this, "decoded", packet);
                }
              } else if (is_binary_1.isBinary(obj) || obj.base64) {
                // raw binary data
                if (!this.reconstructor) {
                  throw new Error("got binary data when not reconstructing a packet");
                } else {
                  packet = this.reconstructor.takeBinaryData(obj);

                  if (packet) {
                    // received final buffer
                    this.reconstructor = null;

                    _get(_getPrototypeOf(Decoder.prototype), "emit", this).call(this, "decoded", packet);
                  }
                }
              } else {
                throw new Error("Unknown type: " + obj);
              }
            }
            /**
             * Decode a packet String (JSON data)
             *
             * @param {String} str
             * @return {Object} packet
             */

          }, {
            key: "decodeString",
            value: function decodeString(str) {
              var i = 0; // look up type

              var p = {
                type: Number(str.charAt(0))
              };

              if (PacketType[p.type] === undefined) {
                throw new Error("unknown packet type " + p.type);
              } // look up attachments if type binary


              if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
                var start = i + 1;

                while (str.charAt(++i) !== "-" && i != str.length) {}

                var buf = str.substring(start, i);

                if (buf != Number(buf) || str.charAt(i) !== "-") {
                  throw new Error("Illegal attachments");
                }

                p.attachments = Number(buf);
              } // look up namespace (if any)


              if ("/" === str.charAt(i + 1)) {
                var _start = i + 1;

                while (++i) {
                  var c = str.charAt(i);
                  if ("," === c) break;
                  if (i === str.length) break;
                }

                p.nsp = str.substring(_start, i);
              } else {
                p.nsp = "/";
              } // look up id


              var next = str.charAt(i + 1);

              if ("" !== next && Number(next) == next) {
                var _start2 = i + 1;

                while (++i) {
                  var _c = str.charAt(i);

                  if (null == _c || Number(_c) != _c) {
                    --i;
                    break;
                  }

                  if (i === str.length) break;
                }

                p.id = Number(str.substring(_start2, i + 1));
              } // look up json data


              if (str.charAt(++i)) {
                var payload = tryParse(str.substr(i));

                if (Decoder.isPayloadValid(p.type, payload)) {
                  p.data = payload;
                } else {
                  throw new Error("invalid payload");
                }
              }

              debug("decoded %s as %j", str, p);
              return p;
            }
          }, {
            key: "destroy",
            value:
            /**
             * Deallocates a parser's resources
             */
            function destroy() {
              if (this.reconstructor) {
                this.reconstructor.finishedReconstruction();
              }
            }
          }], [{
            key: "isPayloadValid",
            value: function isPayloadValid(type, payload) {
              switch (type) {
                case PacketType.CONNECT:
                  return _typeof(payload) === "object";

                case PacketType.DISCONNECT:
                  return payload === undefined;

                case PacketType.CONNECT_ERROR:
                  return typeof payload === "string" || _typeof(payload) === "object";

                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                  return Array.isArray(payload) && payload.length > 0;

                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                  return Array.isArray(payload);
              }
            }
          }]);

          return Decoder;
        }(Emitter);

        exports.Decoder = Decoder;

        function tryParse(str) {
          try {
            return JSON.parse(str);
          } catch (e) {
            return false;
          }
        }
        /**
         * A manager of a binary event's 'buffer sequence'. Should
         * be constructed whenever a packet of type BINARY_EVENT is
         * decoded.
         *
         * @param {Object} packet
         * @return {BinaryReconstructor} initialized reconstructor
         */


        var BinaryReconstructor = /*#__PURE__*/function () {
          function BinaryReconstructor(packet) {
            _classCallCheck(this, BinaryReconstructor);

            this.packet = packet;
            this.buffers = [];
            this.reconPack = packet;
          }
          /**
           * Method to be called when binary data received from connection
           * after a BINARY_EVENT packet.
           *
           * @param {Buffer | ArrayBuffer} binData - the raw binary data received
           * @return {null | Object} returns null if more binary data is expected or
           *   a reconstructed packet object if all buffers have been received.
           */


          _createClass(BinaryReconstructor, [{
            key: "takeBinaryData",
            value: function takeBinaryData(binData) {
              this.buffers.push(binData);

              if (this.buffers.length === this.reconPack.attachments) {
                // done with buffer list
                var packet = binary_1.reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
              }

              return null;
            }
            /**
             * Cleans up binary packet reconstruction variables.
             */

          }, {
            key: "finishedReconstruction",
            value: function finishedReconstruction() {
              this.reconPack = null;
              this.buffers = [];
            }
          }]);

          return BinaryReconstructor;
        }();
        /***/

      },

      /***/
      "./node_modules/socket.io-parser/dist/is-binary.js": function node_modulesSocketIoParserDistIsBinaryJs(module, exports, __webpack_require__) {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.hasBinary = exports.isBinary = void 0;
        var withNativeArrayBuffer = typeof ArrayBuffer === "function";

        var isView = function isView(obj) {
          return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
        };

        var toString = Object.prototype.toString;
        var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
        var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
        /**
         * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
         *
         * @private
         */

        function isBinary(obj) {
          return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
        }

        exports.isBinary = isBinary;

        function hasBinary(obj, toJSON) {
          if (!obj || _typeof(obj) !== "object") {
            return false;
          }

          if (Array.isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; i++) {
              if (hasBinary(obj[i])) {
                return true;
              }
            }

            return false;
          }

          if (isBinary(obj)) {
            return true;
          }

          if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
            return hasBinary(obj.toJSON(), true);
          }

          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
              return true;
            }
          }

          return false;
        }

        exports.hasBinary = hasBinary;
        /***/
      },

      /***/
      "./node_modules/yeast/index.js": function node_modulesYeastIndexJs(module, exports, __webpack_require__) {
        "use strict";

        var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),
            length = 64,
            map = {},
            seed = 0,
            i = 0,
            prev;
        /**
         * Return a string representing the specified number.
         *
         * @param {Number} num The number to convert.
         * @returns {String} The string representation of the number.
         * @api public
         */

        function encode(num) {
          var encoded = '';

          do {
            encoded = alphabet[num % length] + encoded;
            num = Math.floor(num / length);
          } while (num > 0);

          return encoded;
        }
        /**
         * Return the integer value specified by the given string.
         *
         * @param {String} str The string to convert.
         * @returns {Number} The integer value represented by the string.
         * @api public
         */


        function decode(str) {
          var decoded = 0;

          for (i = 0; i < str.length; i++) {
            decoded = decoded * length + map[str.charAt(i)];
          }

          return decoded;
        }
        /**
         * Yeast: A tiny growing id generator.
         *
         * @returns {String} A unique id.
         * @api public
         */


        function yeast() {
          var now = encode(+new Date());
          if (now !== prev) return seed = 0, prev = now;
          return now + '.' + encode(seed++);
        } //
        // Map each character to its index.
        //


        for (; i < length; i++) {
          map[alphabet[i]] = i;
        } //
        // Expose the `yeast`, `encode` and `decode` functions.
        //


        yeast.encode = encode;
        yeast.decode = decode;
        module.exports = yeast;
        /***/
      }
      /******/

    })
  );
});
},{"process":"node_modules/process/browser.js","buffer":"node_modules/buffer/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62648" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","node_modules/socket.io/client-dist/socket.io.js"], null)
//# sourceMappingURL=/socket.io.0eae34d1.js.map