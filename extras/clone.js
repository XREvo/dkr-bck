var clone = function(obj) {
    /*var target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;*/
    
    if (obj === null || typeof obj !== 'object') { return obj; }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = clone(obj[key]);
    }
    return temp;
}

exports.clone = clone;