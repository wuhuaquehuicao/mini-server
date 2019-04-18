var app = require("../main/app");

module.exports = {
    "/alldealUsers": {
        get: function (req, res, next) {
            this.db.getAllDealUsers(req.query,
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
    "/dealUsers": {
        get: function (req, res, next) {
            this.db.getDealUsers(req.query,
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
        },
        post: function (req, res, next) {
            this.db.addDealUser(req.body,
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
        },
        "/:id": {
            get: function (req, res, next) {
                this.db.getDealUser(parseInt(req.params.id),
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
            },
            put: function (req, res, next) {
                this.db.updateDealUser(parseInt(req.params.id), req.body,
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
    }
};