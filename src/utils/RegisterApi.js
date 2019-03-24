var loadDir = require("./load_dir");

function RegisterApi(m, parent, result) {
    if (!parent) {
        parent = "";
    }
    var mkeys = Object.keys(m);
    for (var j = 0; j < mkeys.length; j++) {
        var k = mkeys[j];
        var v = m[k];
        if (typeof v === "function") {
            if (k === "get" || k === "post" || k === "put" || k === "del") {
                result.push({
                    path: parent,
                    method: k,
                    handler: v
                });
            }
        } else {
            RegisterApi(v, parent + k, result);
        }
    }
    return result;
}

function RegisterApis(Modules) {
    var result = [];
    var keys = Object.keys(Modules);
    for (var i = 0; i < keys.length; i++) {
        var m = Modules[keys[i]];
        RegisterApi(m, null, result);
    }
    return result;
}

function HandlerException(dataManager, controller) {
    return function (req, res, next) {
        try {
            controller.handler(req, res, next);
        } catch (e) {
            dataManager.emit("httpError", req, res, e);
        }
    }
}

module.exports = function (app, dataManager, dir, root) {
    var result = RegisterApis(loadDir(dir));
    for (var i = 0; i < result.length; i++) {
        var controller = result[i];
        controller.app = app;
        controller.db = dataManager;
        if (controller.method === "get") {
            if (controller.path.startsWith("~")) {
                app.get(controller.path.substr(1), HandlerException(dataManager, controller));
            } else
                app.get(root + controller.path, HandlerException(dataManager, controller));
        } else if (controller.method === "post") {
            if (controller.path.startsWith("~")) {
                app.post(controller.path.substr(1), HandlerException(dataManager, controller));
            } else
                app.post(root + controller.path, HandlerException(dataManager, controller));
        } else if (controller.method === "put") {
            if (controller.path.startsWith("~")) {
                app.put(controller.path.substr(1), HandlerException(dataManager, controller));
            } else
                app.put(root + controller.path, HandlerException(dataManager, controller));
        } else if (controller.method === "del") {
            if (controller.path.startsWith("~")) {
                app.del(controller.path.substr(1), HandlerException(dataManager, controller));
            } else
                app.del(root + controller.path, HandlerException(dataManager, controller));
        }
    }
    return result;
};