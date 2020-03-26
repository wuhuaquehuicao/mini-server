var app = require("../main/app");

module.exports = {
    "/otherRecords": {
        post: function (req, res, next) {
            this.db.addOtherRecord(req.body,
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
                this.db.getOtherRecord(parseInt(req.params.id),
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
                this.db.updateOtherRecord(parseInt(req.params.id), req.body,
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
                this.db.deleteOtherRecord(parseInt(req.params.id),
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
    "/searchOtherRecords": {
        get: function (req, res, next) {
            this.db.searchOtherRecords(req.query,
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
    "/searchPersonOtherRecords": {
        get: function (req, res, next) {
            this.db.searchPersonOtherRecords(req.query,
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
    "/searchFactoryOtherRecords": {
        get: function (req, res, next) {
            this.db.searchFactoryOtherRecords(req.query,
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