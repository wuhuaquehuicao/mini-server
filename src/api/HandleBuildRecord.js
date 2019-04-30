var app = require("../main/app");

module.exports = {
    "/buildrecord": {
        post: function (req, res, next) {
            this.db.addBuildRecord(req.body,
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
                this.db.getBuildRecord(parseInt(req.params.id),
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
                this.db.updateBuildRecord(parseInt(req.params.id), req.body,
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
                this.db.deleteBuildRecord(parseInt(req.params.id),
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
    "/searchBuildRecord": {
        get: function (req, res, next) {
            this.db.searchBuildRecords(req.query,
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
    "/searchFactoryBuildRecord": {
        get: function (req, res, next) {
            this.db.searchFactoryBuildRecords(req.query,
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