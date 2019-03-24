var app = require("../main/app");

module.exports = {
    "/records": {
        get: function (req, res, next) {
            this.db.getRecords(req.query,
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
            this.db.addRecord(req.body,
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
                this.db.getRecord(parseInt(req.params.id),
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
                this.db.updateRecord(parseInt(req.params.id), req.body,
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