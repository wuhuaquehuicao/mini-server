var fs = require("fs");
var path = require("path");

var load = function(path, name) {
    if (name) {
        return require(path + name);
    }
    return require(path);
};

module.exports = function(dir) {
    var result = {};
    fs.readdirSync(dir).forEach(function(filename) {
        if (!/\.js$/.test(filename)) {
            return;
        }
        var name = path.basename(filename, ".js");
        var _load = load.bind(null, dir + "/", name);
        result.__defineGetter__(name, _load);
    });
    return result;
};
