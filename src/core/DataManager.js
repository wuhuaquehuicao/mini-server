var sqlite3 = require('sqlite3').verbose();
var equal = require("deep-equal");
var EventEmitter = require("events").EventEmitter;
var jwt = require('jsonwebtoken');
var Base64 = require("js-base64").Base64;
var Package = require("../../package.json");
var util = require("util");
const Store = require("data-store");
// ~/.config/data-store/
const store = new Store({
    name: "sync"
});

var fs = require('fs');
var file = 'record.db';
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

function DataManager() {
    var self = this;
    EventEmitter.call(self);

    //https://github.com/auth0/node-jsonwebtoken
    //https://github.com/auth0/express-jwt
    self.privateCert = Base64.decode(Package.setting.jwt.privateKey);
    self.publicCert = Base64.decode(Package.setting.jwt.publicKey);

    self.on("httpError", function (req, res, err) {
        console.log(err);
    });

    self.on("wsError", function (ws, message, err) {
        console.log(err);
    });

    if (!exists) {
        fs.openSync(file, "w");
    }
    db.serialize(function () {
        if (!exists) {
            db.run("CREATE TABLE IF NOT EXISTS user   (id INTEGER primary key, name TEXT, email TEXT, mobile TEXT, password TEXT, createdDate DATETIME DEFAULT (datetime('now','localtime')), modifiedDate DATETIME DEFAULT (datetime('now','localtime')))");
            db.run("CREATE TABLE IF NOT EXISTS report (id INTEGER primary key, userId INT,currenttask TEXT,nextplan TEXT,blockissue TEXT, createdDate DATETIME DEFAULT (datetime('now','localtime')), modifiedDate DATETIME DEFAULT (datetime('now','localtime')))");
            db.run("CREATE TABLE IF NOT EXISTS record (id INTEGER primary key, name TEXT, plateNumber TEXT, totalWeight INT, tareWeight INT, netWeight INT, price INT, paid INT, unpaid INT, createdDate DATETIME DEFAULT (datetime('now','localtime')), modifiedDate DATETIME DEFAULT (datetime('now','localtime')))");
            var admin = {
                name: "Admin",
                email: "admin@gfan.cn",
                mobile: "13800138000",
                password: "13"
            }
            db.run("INSERT INTO user (name, email,mobile,password) VALUES (?,?,?,?)", admin.name, admin.email, admin.mobile, admin.password);
        }
    });
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        S: this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ?
                    o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length)
            );
    return format;
};

util.inherits(DataManager, EventEmitter);

DataManager.prototype.start = function () {
    var self = this;
    console.log("DataManager start");
};

DataManager.prototype.sign = function (claims) {
    var self = this;
    var token = jwt.sign(claims, self.privateCert, {
        algorithm: Package.setting.jwt.algorithm
    });
    return token;
}

DataManager.prototype.verify = function (token, cb) {
    var self = this;
    // jwt.verify(token, self.publicCert, {
    //     algorithms: [Package.setting.jwt.algorithm]
    // }, function (err, payload) {
    //     console.log("verify");
    // });
    return jwt.verify(token, self.publicCert, {
        algorithms: [Package.setting.jwt.algorithm]
    }, cb);
};

DataManager.prototype.addUser = function (user) {
    db.serialize(function () {
        db.run("INSERT INTO user (name, email,mobile,password) VALUES (?,?,?,?)", user.name, user.email, user.mobile, user.password);
    });

    return user;
};

DataManager.prototype.login = function (user, callback) {
    var self = this;
    db.serialize(function () {
        db.get("SELECT * FROM user WHERE (email = ? or mobile= ?) AND password=? ", [user.email, user.mobile, user.password], function (error, result) {
            if (callback) {
                if (!error) {
                    if (result) {
                        result["token"] = self.sign({
                            id: result.id,
                            role: "admin"
                        });
                    }
                }
                callback(error, result);
            }
        });
    });
};

DataManager.prototype.getUser = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT * FROM user WHERE  id= ?", [id], callback);
    });
};

DataManager.prototype.updateUser = function (id, user, callback) {
    db.serialize(function () {
        db.run("UPDATE user SET email = ?, mobile = ?, password = ? ,modifiedDate=? WHERE id = ?", [user.email, user.mobile, user.password, new Date().format("yyyy-MM-dd hh:mm:ss"), id], function (error, result) {
            if (callback) {
                if (!error) {
                    if (this.changes == 1) {
                        return self.getRecord(id, callback);
                    }
                }
                callback(error, null);
            }
        });
    });
};

DataManager.prototype.addRecord = function (record, callback) {
    var self = this;
    var createdDate = new Date(record.createdDate).format("yyyy-MM-dd hh:mm:ss");
    var modifiedDate =  new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("INSERT INTO record (kilnName, name, plateNumber,totalWeight,tareWeight,netWeight,price,paid,unpaid,createdDate,modifiedDate) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            record.kilnName, record.name, record.plateNumber, record.totalWeight, record.tareWeight, record.netWeight, record.price, record.paid, record.unpaid, createdDate, modifiedDate, function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            record["id"] = this.lastID;
                            return self.getRecord(this.lastID, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.updateRecord = function (id, record, callback) {
    var self = this;
    var modifiedDate = new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("UPDATE record SET kilnName = ?, name = ?, plateNumber = ?, totalWeight = ?, tareWeight= ?,netWeight=?,price=?,paid=?,unpaid=?, createdDate=?,modifiedDate=?  WHERE id = ?",
            [record.kilnName, record.name, record.plateNumber, record.totalWeight, record.tareWeight, record.netWeight, record.price, record.paid, record.unpaid, record.createdDate,
            modifiedDate, id], function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            return self.getRecord(id, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.getRecord = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT * FROM record WHERE id= ?", [id], callback);
    });
};

DataManager.prototype.getRecords = function (query, callback) {
    var self = this;
    var size = 10;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    db.serialize(function () {
        db.all("SELECT * FROM record order by modifiedDate desc limit ? offset ?", [size, offset], function (error, result) {
            if (callback) {
                self.getRecordsCount(NULL, NULL,(err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.searchRecords = function (query, callback) {
    var self = this;
    var size = 50;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var selectedDate = query.date;
    var fromDate = getSearchFromDate(selectedDate);
    var toDate = getSearchToDate(selectedDate);
    var kilnName = query.kilnName;
    db.serialize(function () {
        db.all("SELECT * FROM record WHERE kilnName = ? AND createdDate BETWEEN ? AND ? order by modifiedDate DESC limit ? offset ?", [kilnName, fromDate, toDate, size, offset],  function (error, result) {
            if (callback) {
                self.getRecordsCount(selectedDate, kilnName, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumWeight = 0;
                        var sumPrice = 0;
                        var subItem;
                        for(var i = 0; i< result.length; i++){
                            subItem = result[i]; 
                            sumWeight += subItem.netWeight;
                            sumPrice += subItem.price;
                        };
                        var sumContent = {
                            "sumWeight":sumWeight,
                            "sumPrice":sumPrice
                        };
                        data["sumContent"] = sumContent;
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.getRecordsCount = function (date, kilnName, callback) {
    db.serialize(function () {
        var searchString;
        var fromDate;
        var toDate;
        if(date){
            fromDate = getSearchFromDate(date);
            toDate = getSearchToDate(date);
            searchString = "SELECT count(*) as total FROM record WHERE kilnName = ? AND createdDate BETWEEN ? AND ? order by modifiedDate DESC";
            db.get(searchString, [kilnName, fromDate, toDate], function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });
        }
        else{
            searchString = "SELECT count(*) as total FROM record";
            db.get(searchString, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });
        }
        
    });
};

DataManager.prototype.addCaoUser = function (caoUser, callback) {
    var self = this;
    db.serialize(function () {
        db.run("INSERT INTO caoUser (name, phone,address) VALUES (?,?,?)",
            caoUser.name, caoUser.phone, caoUser.address, function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            caoUser["id"] = this.lastID;
                            return self.getCaoUser(this.lastID, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.updateCaoUser = function (id, caoUser, callback) {
    var self = this;
    db.serialize(function () {
        db.run("UPDATE caoUser SET name = ?, phone = ?, address = ? WHERE id = ?",
            [caoUser.name, caoUser.phone, caoUser.address, id], function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            return self.getCaoUser(id, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.getCaoUser = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT * FROM caoUser WHERE id= ?", [id], callback);
    });
};

DataManager.prototype.getAllCaoUsers = function(query, callback){
    var self = this;
    db.serialize(function () {
        db.all("SELECT * FROM caoUser order by id desc", function (error, result) {
            if (callback) {
                callback(error, result);
            }
        });
    });
};

DataManager.prototype.getCaoUsers = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    db.serialize(function () {
        db.all("SELECT * FROM caoUser order by id desc limit ? offset ?", [size, offset], function (error, result) {
            if (callback) {
                self.getCaoUsersCount((err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.getCaoUsersCount = function (callback) {
    db.serialize(function () {
        db.get("SELECT count(*) as total FROM caoUser", function (error, result) {
            if (callback) {
                callback(error, result);
            }
        });
    });
};

//kiln
DataManager.prototype.getKilns = function (query, callback) {
    db.serialize(function () {
        db.all("SELECT * FROM kiln order by id ASC", function (error, result) {
            if (callback) {
                callback(error, result);
            }
        });
    });
};

getSearchFromDate = function(date){
    var searchFromDate = new Date(date).format("yyyy-MM-dd");
    return searchFromDate;
};

getSearchToDate = function(date){
    var toDate = new Date(new Date(date).getTime() + 24*60*60*1000);
    var searchToDate= new Date(toDate).format("yyyy-MM-dd");
    return searchToDate;
}

module.exports = DataManager;