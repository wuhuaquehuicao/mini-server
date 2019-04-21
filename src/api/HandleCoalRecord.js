var app = require("../main/app");

module.exports = {
    "/coalrecords": {
        get: function (req, res, next) {
            this.db.getCoalRecords(req.query,
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
            this.db.addCoalRecord(req.body,
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
                this.db.getCoalRecord(parseInt(req.params.id),
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
                this.db.updateCoalRecord(parseInt(req.params.id), req.body,
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
    },
    "/searchCoalRecords": {
        get: function (req, res, next) {
            this.db.searchCoalRecords(req.query,
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
    },
    "/searchPersonCoalRecords": {
        get: function (req, res, next) {
            this.db.searchPersonCoalRecords(req.query,
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
    },
    "/searchFactoryCoalRecords": {
        get: function (req, res, next) {
            this.db.searchFactoryCoalRecords(req.query,
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
    },
};