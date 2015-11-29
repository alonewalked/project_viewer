module.exports = extend

var TYPE_OBJECT = '[object Object]';
var TYPE_STRING = '[object String]';
var TYPE_ARRAY  = '[object Array]';

function extend(target) {
	var result = null;
	
	for (var i = 0; i < arguments.length; i++) {
		var toMerge = arguments[i],
			keys = Object.keys(toMerge);
			
		if (result === null) {
			result = toMerge;
			continue;
		}
		
		for (var j = 0; j < keys.length; j++) {
			var keyName = keys[j];
			var value   = toMerge[keyName];
			
			if (Object.prototype.toString.call(value) == TYPE_OBJECT) {
				if (result[keyName] === undefined) {
					result[keyName] = {};
				}
				result[keyName] = extend(result[keyName], value);
			} else if (Object.prototype.toString.call(value) == TYPE_ARRAY) {
				if (result[keyName] === undefined) {
					result[keyName] = [];
				}
				result[keyName] = value.concat(result[keyName]);
			} else {
				result[keyName] = value;
			}
		}
	}
	
	return result;
}