'use strict';

/**
 * This is a port of the PrototypeJS method toQueryString. It Turns an object
 * into its URL-encoded query string representation.
 * @param {object} The object whose property/value pairs will be converted.
 * @return {object} A URL-encoded query string representation of the object.
 */

var _toString = Object.prototype.toString,
  STRING_CLASS = '[object String]',
  ARRAY_CLASS = '[object Array]',
  FUNCTION_CLASS = '[object Function]';

function isString(object) {
  return _toString.call(object) === STRING_CLASS;
}

function isArray(object) {
  return _toString.call(object) === ARRAY_CLASS;
}

function isFunction(object) {
  return _toString.call(object) === FUNCTION_CLASS;
}

function isObject(value) {
  if (!isString(value) && !isArray(value) && !isFunction(value) && (value != null && typeof value == 'object')) {
    return true;
  }
  return false;
}

function isHash(object) {
  return object instanceof Hash;
}

function isUndefined(object) {
  return typeof object === "undefined";
}

function extend(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
}

function clone(object) {
  return extend({ }, object);
}

function regExpEsc(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function inject(input, memo, iterator, context) {
  input.forEach(function(value, index) {
    memo = iterator.call(context, memo, value, index, input);
  }, input);
  return memo;
}

function Template(template, pattern) {
  this.template = template.toString();
  this.pattern = pattern || /(^|.|\r|\n)(#\{(.*?)\})/;
  this.evaluate = function(object) {
    if (object && isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return gsub(this.template, this.pattern, function(match) {
      if (object == null) return (match[1] + '');

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3],
          pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
          
      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + interpret(ctx);
    });
  }
}

function Hash(object) {
  var self = this;
  this._object = isHash(object) ? clone(this._object) : clone(object);

  this.forEach = function(iterator, context) {
    var i = 0;
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator.call(context, pair, i);
      i++;
    }
  }

  this.toQueryPair = function(key, value) {
    if (isUndefined(value)) return key;
    
    value = interpret(value);
    value = gsub(value, /(\r)?\n/, '\r\n');
    value = encodeURIComponent(value);
    value = gsub(value, /%20/, '+');

    return key + '=' + value;
  }

  this.toQueryString = function() {
    return inject(this, [], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;
      
      if (values && typeof values == 'object') {
        if (isArray(values)) {
          var queryValues = [];
          for (var i = 0, len = values.length, value; i < len; i++) {
            value = values[i];
            queryValues.push(self.toQueryPair(key, value));            
          }
          return results.concat(queryValues);
        }
      } else {
          results.push(self.toQueryPair(key, values));
      }
      return results;
    }).join('&');
  }
}

function prepareReplacement(replacement) {
  if (isFunction(replacement)) return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
}

function interpret(value) {
  return value == null ? '' : String(value);
}

function isNonEmptyRegExp(regexp) {
  return regexp.source && regexp.source !== '(?:)';
}

function gsub(input, pattern, replacement) {
    var result = '', source = input, match;
    replacement = prepareReplacement(replacement);

    if (isString(pattern))
      pattern = regExpEsc(pattern);

    if (!(pattern.length || isNonEmptyRegExp(pattern))) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      match = source.match(pattern)
      if (match && match[0].length > 0) {
        result += source.slice(0, match.index);
        result += interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
}

function toQueryString(input) {
  if (isObject(input)) {
    var hash = new Hash(input);
    return hash.toQueryString();
  }
  return undefined;
}

module.exports = toQueryString;
