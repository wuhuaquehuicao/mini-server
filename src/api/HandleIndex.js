var app = require("../main/app");
var fs = require("fs");

module.exports = {
    "~/index": {
        get: function (req, res, next) {
            fs.readFile("./src/static/index.html", function (err, content) {
                if (err) {
                    res.writeHead(404, {
                        "Content-Type": 'text/plain; charset="UTF-8"'
                    });
                    res.write(err.message);
                    res.end();
                    next();
                } else {
                    res.writeHead(200, {
                        "Content-Type": "text/html; charset=UTF-8"
                    });
                    res.write(content);
                    res.end();
                    next();
                }
            });
        }
    },
    "~/ws": {
        get: function (req, res, next) {
            fs.readFile("./src/static/ws.html", function (err, content) {
                if (err) {
                    res.writeHead(404, {
                        "Content-Type": 'text/plain; charset="UTF-8"'
                    });
                    res.write(err.message);
                    res.end();
                    next();
                } else {
                    res.writeHead(200, {
                        "Content-Type": "text/html; charset=UTF-8"
                    });
                    res.write(content);
                    res.end();
                    next();
                }
            });
        }
    }
};