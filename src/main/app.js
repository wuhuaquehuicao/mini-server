"use strict";
//wrk -c 40 -t 4 -d 5 --latency http://localhost:8000/
//http://www.senchalabs.org/connect/compress.html
var express = require("express");
var bodyParser = require('body-parser')
var http = require("http");
var path = require("path");
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var Package = require("../../package.json");
var RegisterApi = require("../utils/RegisterApi");
var DataManager = require("../core/DataManager");

function App() {
    var self = this;
    EventEmitter.call(self);

    var app = express();
    var server = http.createServer(app);

    app.use(bodyParser.json());
    //support parsing of application/x-www-form-urlencoded post data
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    // app.use(express.cookieParser());
    app.use(function (req, res, next) {
        var token = req.headers.authorization;
        var write = res.write,
            end = res.end;
        req.on('close', function () {
            console.log("req.close");
            res.write = res.end = function () { };
        });

        res.write = function (chunk, encoding) {
            return write.call(res, chunk, encoding);
        };

        res.end = function (chunk, encoding) {
            return end.call(res);
        };
        next();
    });

    app.use(function (err, req, res, next) {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    })
    app.use(express.static(path.join(__dirname + "/../portal", "dist")));
    //app.use("/patron", express.static(path.join(__dirname + "/../client", "dist")));
    //app.use(express.static(path.join(__dirname + "/../admin", "dist")));
    app.use(express.static(path.join(__dirname + "/../", "static")));

    self.app = app;
    self.server = server;

    //1. config
    //2. datamanager
    //3. create server
    //4. register api
    self.DataManager = new DataManager();
    self.start();
    return self;
}

util.inherits(App, EventEmitter);

App.prototype.start = function () {
    var self = this;
    RegisterApi(self.app, self.DataManager, __dirname + "/../api", "/api/v:apiVersion");
    //if (process.env.NODE_ENV !== "test")
    self.DataManager.start();

    self.server.listen(3000, function () {
        console.log(
            "%s [%s-%s] listening at %s",
            Package.name,
            process.env.NODE_ENV,
            Package.version,
            3000
        );
    });
    self.DataManager.emit("start");
};
module.exports = new App();