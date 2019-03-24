var axios = require("axios");
var md5 = require("md5");

module.exports = {
    "/users": {
        "/login": {
            post: function (req, res, next) {
                this.db.login(req.body,
                    function (err, result) {
                        if (err) {
                            next(new errors.InternalServerError());
                        } else {
                            res.writeHead(200, {
                                "Content-type": "application/json; charset=UTF-8"
                            });
                            res.write(JSON.stringify(result));
                            res.end();
                            next();
                        }
                    }
                );
            }
        },
        "/:id": {
            get: function (req, res, next) {
                this.db.getUser(parseInt(req.params.id),
                    function (err, result) {
                        if (err) {
                            next(new errors.InternalServerError());
                        } else {
                            res.writeHead(200, {
                                "Content-type": "application/json; charset=UTF-8"
                            });
                            res.write(JSON.stringify(result));
                            res.end();
                            next();
                        }
                    }
                );
            }
        }
    }
};