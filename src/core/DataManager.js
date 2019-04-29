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
var file = 'recordData.db';
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
            db.run("CREATE TABLE IF NOT EXISTS report (id INTEGER primary key, userId INT,currenttask TEXT,nextplan TEXT,blockissue TEXT, createdDate DATETIME DEFAULT (datetime('now','localtime')), modifiedDate DATETIME)");
            var admin = {
                name: "Admin",
                email: "admin@gfan.cn",
                mobile: "13800138000",
                password: "13"
            }
            db.run("INSERT INTO user (name, email,mobile,password) VALUES (?,?,?,?)", admin.name, admin.email, admin.mobile, admin.password);
        }

        db.run("CREATE TABLE IF NOT EXISTS dealUser (id INTEGER primary key, name TEXT, plateNumber TEXT, phone TEXT, address TEXT, type TEXT, modifiedDate DATETIME)");
        db.run("CREATE TABLE IF NOT EXISTS coalrecord (id INTEGER primary key, name TEXT, plateNumber TEXT, totalWeight INT, tareWeight INT, netWeight INT, price INT, paid INT, unpaid INT, note TEXT,type TEXT, createdDate DATETIME, modifiedDate DATETIME)");
        db.run("CREATE TABLE IF NOT EXISTS stonerecord (id INTEGER primary key, name TEXT, plateNumber TEXT, type TEXT, recordUser TEXT, netWeight INT, createdDate DATETIME, modifiedDate DATETIME)");
        db.run("CREATE TABLE IF NOT EXISTS record (id INTEGER primary key, name TEXT, plateNumber TEXT, totalWeight INT, tareWeight INT, netWeight INT, ashWeight INT, price INT, cashpaid INT, wxpaid INT, unpaid INT,kilnName TEXT, type TEXT, createdDate DATETIME, modifiedDate DATETIME)");
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
                    else{
                        return callback(error, {message:"请输入正确的账号或密码"})
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

//Handle cao record
DataManager.prototype.addRecord = function (record, callback) {
    var self = this;
    var createdDate = new Date(record.createdDate).format("yyyy-MM-dd hh:mm:ss");
    var modifiedDate =  new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("INSERT INTO record (kilnName, type, name, plateNumber,totalWeight,tareWeight,netWeight,ashWeight,price,cashpaid, wxpaid,unpaid,createdDate,modifiedDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            record.kilnName, record.type, record.name, record.plateNumber, record.totalWeight, record.tareWeight, record.netWeight, record.ashWeight,record.price, record.cashpaid,record.wxpaid, record.unpaid, createdDate, modifiedDate, function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            record["id"] = this.lastID;
                            self.updateDealUserUpdateTime(record.name);
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
    var createdDate = new Date(record.createdDate).format("yyyy-MM-dd hh:mm:ss")
    var modifiedDate = new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("UPDATE record SET kilnName = ?, type = ?, name = ?, plateNumber = ?, totalWeight = ?, tareWeight= ?,netWeight=?, ashWeight=?,price=?,cashpaid=?,wxpaid=?,unpaid=?, createdDate=?,modifiedDate=?  WHERE id = ?",
            [record.kilnName,record.type, record.name, record.plateNumber, record.totalWeight, record.tareWeight, record.netWeight, record.ashWeight, record.price, record.cashpaid,record.wxpaid, record.unpaid, createdDate,
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

DataManager.prototype.deleteRecord = function (id, callback) {
    var self = this;
    db.serialize(function () {
        db.get("DELETE FROM record WHERE id= ?", [id], function (error, result){
            if (callback) {
                if (!error) {
                    return callback(null, {});
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

DataManager.prototype.searchRecords = function (query, callback) {
    var self = this;
    var size = 100;
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
        db.all("SELECT * FROM record WHERE kilnName = ? AND createdDate BETWEEN ? AND ? order by type DESC, createdDate ASC limit ? offset ?", [kilnName, fromDate, toDate, size, offset],  function (error, result) {
            if (callback) {
                self.getRecordsCount(selectedDate, kilnName, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
                            "sumAshWeight":res.sumAshWeight,
                            "sumPrice":res.sumPrice,
                            "sumCashpaid":res.sumCashpaid,
                            "sumWxpaid":res.sumWxpaid,
                            "sumUnpaid":res.sumUnpaid
                        };
                        data["sumContent"] = [sumContent];
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
            searchString = "SELECT count(*) as total, SUM(netWeight) AS sumNetWeight , SUM(ashWeight) AS sumAshWeight, SUM(cashpaid) AS sumCashpaid ,SUM(wxpaid) AS sumWxpaid ,SUM(unpaid) AS sumUnpaid , SUM(price) AS sumPrice FROM record WHERE kilnName = ? AND createdDate BETWEEN ? AND ? order by modifiedDate DESC";
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

//search personRecord
DataManager.prototype.searchPersonRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var userName = query.userName;
    var plateNumber = query.plateNumber;

    var searchStr = "SELECT * FROM record WHERE ";
    var searchData = [];
    if(userName){
        searchStr += "name = ? AND ";
        searchData.push(userName);
    }

    if(plateNumber){
        searchStr += "plateNumber = ? AND ";
        searchData.push(plateNumber);
    }
    
    var caoType = query.type;
    if(caoType){
        searchStr += "type = ? AND ";
        searchData.push(caoType);
    }

    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC limit ? offset ?";
    searchData.push(fromDate);
    searchData.push(toDate);
    searchData.push(size);
    searchData.push(offset);
    db.serialize(function () {
        db.all(searchStr, searchData,  function (error, result) {
            if (callback) {
                self.getPersonRecordsCount(query, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
                            "sumAshWeight":res.sumAshWeight,
                            "sumPrice":res.sumPrice,
                            "sumCashpaid":res.sumCashpaid,
                            "sumWxpaid":res.sumWxpaid,
                            "sumUnpaid":res.sumUnpaid
                        };
                        data["sumContent"] = [sumContent];
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.getPersonRecordsCount = function (query, callback) {
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var userName = query.userName;
    var plateNumber = query.plateNumber;
    
    var searchStr = "WHERE ";
    var searchData = [];
    if(userName){
        searchStr += "name = ? AND ";
        searchData.push(userName);
    }

    if(plateNumber){
        searchStr += "plateNumber = ? AND ";
        searchData.push(plateNumber);
    }

    var caoType = query.type;
    if(caoType){
        searchStr += "type = ? AND ";
        searchData.push(caoType);
    }

    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC";
    searchData.push(fromDate);
    searchData.push(toDate);

    db.serialize(function () {
        var searchString;
        searchString = "SELECT count(*) as total, SUM(netWeight) AS sumNetWeight ,SUM(ashWeight) AS sumAshWeight, SUM(cashpaid) AS sumCashpaid ,SUM(wxpaid) AS sumWxpaid ,SUM(unpaid) AS sumUnpaid , SUM(price) AS sumPrice FROM record " + searchStr;
            db.get(searchString, searchData, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });    
    });
};

//Search factoryRecord
DataManager.prototype.searchFactoryRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var kilnName = query.kilnName;
    
    var searchStr = "SELECT name AS name, SUM(netWeight) AS netWeight ,SUM(ashWeight) AS sumAshWeight,SUM(cashpaid) AS cashpaid ,SUM(wxpaid) AS wxpaid ,SUM(unpaid) AS unpaid , SUM(price) AS price FROM record WHERE ";
    var searchData = [];
    if(kilnName){
        searchStr += "kilnName = ? AND ";
        searchData.push(kilnName);
    }

    var caoType = query.type;
    if(caoType){
        searchStr += "type = ? AND ";
        searchData.push(caoType);
    }

    searchStr +="createdDate BETWEEN ? AND ? GROUP BY name order by createdDate DESC limit ? offset ?";
    searchData.push(fromDate);
    searchData.push(toDate);
    searchData.push(size);
    searchData.push(offset);
    db.serialize(function () {
        db.all(searchStr, searchData,  function (error, result) {
            if (callback) {
                self.getFactoryRecordsCount(query, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = 2;//res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
                            "sumAshWeight":res.sumAshWeight,
                            "sumPrice":res.sumPrice,
                            "sumCashpaid":res.sumCashpaid,
                            "sumWxpaid":res.sumWxpaid,
                            "sumUnpaid":res.sumUnpaid
                        };
                        data["sumContent"] = [sumContent];
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.getFactoryRecordsCount = function (query, callback) {
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var kilnName = query.kilnName;
    
    var searchStr = "WHERE ";
    var searchData = [];
    if(kilnName){
        searchStr += "kilnName = ? AND ";
        searchData.push(kilnName);
    }

    var caoType = query.type;
    if(caoType){
        searchStr += "type = ? AND ";
        searchData.push(caoType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC";
    searchData.push(fromDate);
    searchData.push(toDate);

    db.serialize(function () {
        var searchString;
        searchString = "SELECT count(DISTINCT name) as total, SUM(netWeight) AS sumNetWeight ,SUM(ashWeight) AS sumAshWeight,SUM(cashpaid) AS sumCashpaid ,SUM(wxpaid) AS sumWxpaid ,SUM(unpaid) AS sumUnpaid , SUM(price) AS sumPrice FROM record " + searchStr;
            db.get(searchString, searchData, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });    
    });
};

//Handle stone record
DataManager.prototype.addStoneRecord = function (stoneRecord, callback) {
    var self = this;
    var createdDate = new Date(stoneRecord.createdDate).format("yyyy-MM-dd hh:mm:ss");
    var modifiedDate =  new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("INSERT INTO stonerecord (name, plateNumber,netWeight,type,recordUser,createdDate,modifiedDate) VALUES (?,?,?,?,?,?,?)",
            stoneRecord.name, stoneRecord.plateNumber, stoneRecord.netWeight, stoneRecord.type, stoneRecord.recordUser, createdDate, modifiedDate, function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            stoneRecord["id"] = this.lastID;
                            return self.getStoneRecord(this.lastID, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.updateStoneRecord = function (id, stoneRecord, callback) {
    var self = this;
    var createdDate = new Date(stoneRecord.createdDate).format("yyyy-MM-dd hh:mm:ss");
    var modifiedDate = new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("UPDATE stonerecord SET name = ?, plateNumber = ?, type = ?, netWeight=?, recordUser=?,createdDate=?,modifiedDate=?  WHERE id = ?",
            [stoneRecord.name, stoneRecord.plateNumber, stoneRecord.type, stoneRecord.netWeight, stoneRecord.recordUser, createdDate,
            modifiedDate, id], function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            return self.getStoneRecord(id, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.getStoneRecord = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT * FROM stonerecord WHERE id= ?", [id], callback);
    });
};

DataManager.prototype.deleteStoneRecord = function (id, callback) {
    var self = this;
    db.serialize(function () {
        db.get("DELETE FROM stonerecord WHERE id= ?", [id], function (error, result){
            if (callback) {
                if (!error) {
                    return callback(null, {});
                }
                callback(error, null);
            }
        });   
    });
};

DataManager.prototype.searchStoneRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var selectedDate = query.date;
    var fromDate = getSearchFromDate(selectedDate);
    var toDate = getSearchToDate(selectedDate);
    db.serialize(function () {
        db.all("SELECT * FROM stonerecord WHERE createdDate BETWEEN ? AND ? order by createdDate ASC limit ? offset ?", [fromDate, toDate, size, offset],  function (error, result) {
            if (callback) {
                self.getStoneRecordsCount(selectedDate, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
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

DataManager.prototype.getStoneRecordsCount = function (date, callback) {
    db.serialize(function () {
        var searchString;
        var fromDate;
        var toDate;
        if(date){
            fromDate = getSearchFromDate(date);
            toDate = getSearchToDate(date);
            searchString = "SELECT count(*) as total, SUM(netWeight) AS sumNetWeight FROM stonerecord WHERE createdDate BETWEEN ? AND ?";
            db.get(searchString, [fromDate, toDate], function (error, result) {
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

//search personStoneRecord
DataManager.prototype.searchPersonStoneRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var userName = query.userName;
    var plateNumber = query.plateNumber;
    var stoneType = query.type;
    
    var searchStr = "SELECT * FROM stonerecord WHERE ";
    var searchData = [];
    if(userName){
        searchStr += "name = ? AND ";
        searchData.push(userName);
    }

    if(plateNumber){
        searchStr += "plateNumber = ? AND ";
        searchData.push(plateNumber);
    }

    if(stoneType){
        searchStr += "type = ? AND ";
        searchData.push(stoneType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC limit ? offset ?";
    searchData.push(fromDate);
    searchData.push(toDate);
    searchData.push(size);
    searchData.push(offset);
    db.serialize(function () {
        db.all(searchStr, searchData,  function (error, result) {
            if (callback) {
                self.getPersonStoneRecordsCount(query, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
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

DataManager.prototype.getPersonStoneRecordsCount = function (query, callback) {
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var userName = query.userName;
    var plateNumber = query.plateNumber;
    
    var searchStr = "WHERE ";
    var searchData = [];
    var stoneType = query.type;

    if(userName){
        searchStr += "name = ? AND ";
        searchData.push(userName);
    }

    if(plateNumber){
        searchStr += "plateNumber = ? AND ";
        searchData.push(plateNumber);
    }

    if(stoneType){
        searchStr += "type = ? AND ";
        searchData.push(stoneType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC";
    searchData.push(fromDate);
    searchData.push(toDate);

    db.serialize(function () {
        var searchString;
        searchString = "SELECT count(*) as total, SUM(netWeight) AS sumNetWeight FROM stonerecord " + searchStr;
            db.get(searchString, searchData, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });    
    });
};

//Search factoryStoneRecord
DataManager.prototype.searchFactoryStoneRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var stoneType = query.type;

    var searchStr = "SELECT name AS name, SUM(netWeight) AS netWeight FROM stonerecord WHERE ";
    var searchData = [];
    if(stoneType){
        searchStr += "type = ? AND ";
        searchData.push(stoneType);
    }
    searchStr +="createdDate BETWEEN ? AND ? GROUP BY name order by createdDate DESC limit ? offset ?";
    searchData.push(fromDate);
    searchData.push(toDate);
    searchData.push(size);
    searchData.push(offset);
    db.serialize(function () {
        db.all(searchStr, searchData,  function (error, result) {
            if (callback) {
                self.getFactoryStoneRecordsCount(query, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
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

DataManager.prototype.getFactoryStoneRecordsCount = function (query, callback) {
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var stoneType = query.type;
    
    var searchStr = "WHERE ";
    var searchData = [];
    if(stoneType){
        searchStr += "type = ? AND ";
        searchData.push(stoneType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC";
    searchData.push(fromDate);
    searchData.push(toDate);

    db.serialize(function () {
        var searchString;
        searchString = "SELECT count(DISTINCT name) as total, SUM(netWeight) AS sumNetWeight FROM stonerecord " + searchStr;
            db.get(searchString, searchData, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });    
    });
};

//Handle coal record
DataManager.prototype.addCoalRecord = function (record, callback) {
    var self = this;
    var createdDate = new Date(record.createdDate).format("yyyy-MM-dd hh:mm:ss");
    var modifiedDate =  new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("INSERT INTO coalrecord (name, plateNumber, type, totalWeight,tareWeight,netWeight,price,paid,unpaid,note,createdDate,modifiedDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            record.name, record.plateNumber, record.type, record.totalWeight, record.tareWeight, record.netWeight, record.price, record.paid, record.unpaid, record.note,createdDate, modifiedDate, function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            record["id"] = this.lastID;
                            self.updateDealUserUpdateTime(record.name);
                            return self.getCoalRecord(this.lastID, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.updateCoalRecord = function (id, record, callback) {
    var self = this;
    var createdDate = new Date(record.createdDate).format("yyyy-MM-dd hh:mm:ss");
    var modifiedDate = new Date().format("yyyy-MM-dd hh:mm:ss");
    db.serialize(function () {
        db.run("UPDATE coalrecord SET name = ?, plateNumber = ?, type = ?, totalWeight = ?, tareWeight= ?,netWeight=?,price=?,paid=?,unpaid=?, createdDate=?,modifiedDate=? ,note=? WHERE id = ?",
            [record.name, record.plateNumber, record.type, record.totalWeight, record.tareWeight, record.netWeight, record.price, record.paid, record.unpaid, createdDate,
            modifiedDate, record.note, id], function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            return self.getCoalRecord(id, callback);
                        }
                    }
                    callback(error, null);
                }
            });
    });
};

DataManager.prototype.getCoalRecord = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT * FROM coalrecord WHERE id= ?", [id], callback);
    });
};

DataManager.prototype.deleteCoalRecord = function (id, callback) {
    var self = this;
    db.serialize(function () {
        db.get("DELETE FROM coalrecord WHERE id= ?", [id], function (error, result){
            if (callback) {
                if (!error) {
                    return callback(null, {});
                }
                callback(error, null);
            }
        });   
    });
};

DataManager.prototype.searchCoalRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var selectedDate = query.date;
    var fromDate = getSearchFromDate(selectedDate);
    var toDate = getSearchToDate(selectedDate);
    db.serialize(function () {
        db.all("SELECT * FROM coalrecord WHERE createdDate BETWEEN ? AND ? order by createdDate ASC limit ? offset ?", [fromDate, toDate, size, offset],  function (error, result) {
            if (callback) {
                self.getCoalRecordsCount(selectedDate, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
                            "sumPrice":res.sumPrice,
                            "sumPaid":res.sumPaid,
                            "sumUnpaid":res.sumUnpaid
                        };
                        data["sumContent"] = [sumContent];
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.getCoalRecordsCount = function (date, callback) {
    db.serialize(function () {
        var searchString;
        var fromDate;
        var toDate;
        if(date){
            fromDate = getSearchFromDate(date);
            toDate = getSearchToDate(date);
            searchString = "SELECT count(*) as total, SUM(netWeight) AS sumNetWeight ,SUM(paid) AS sumPaid ,SUM(unpaid) AS sumUnpaid , SUM(price) AS sumPrice FROM coalrecord WHERE createdDate BETWEEN ? AND ?";
            db.get(searchString, [fromDate, toDate], function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });
        }
        else{
            searchString = "SELECT count(*) as total FROM coalrecord";
            db.get(searchString, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });
        }
        
    });
};

//search personRecord
DataManager.prototype.searchPersonCoalRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var userName = query.userName;
    var plateNumber = query.plateNumber;
    var coalType = query.type;
    
    var searchStr = "SELECT * FROM coalrecord WHERE ";
    var searchData = [];
    if(userName){
        searchStr += "name = ? AND ";
        searchData.push(userName);
    }

    if(plateNumber){
        searchStr += "plateNumber = ? AND ";
        searchData.push(plateNumber);
    }

    if(coalType){
        searchStr += "type = ? AND ";
        searchData.push(coalType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC limit ? offset ?";
    searchData.push(fromDate);
    searchData.push(toDate);
    searchData.push(size);
    searchData.push(offset);
    db.serialize(function () {
        db.all(searchStr, searchData,  function (error, result) {
            if (callback) {
                self.getPersonCoalRecordsCount(query, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
                            "sumPrice":res.sumPrice,
                            "sumPaid":res.sumPaid,
                            "sumUnpaid":res.sumUnpaid
                        };
                        data["sumContent"] = [sumContent];
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.getPersonCoalRecordsCount = function (query, callback) {
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var userName = query.userName;
    var plateNumber = query.plateNumber;
    var coalType = query.type;

    var searchStr = "WHERE ";
    var searchData = [];
    if(userName){
        searchStr += "name = ? AND ";
        searchData.push(userName);
    }

    if(plateNumber){
        searchStr += "plateNumber = ? AND ";
        searchData.push(plateNumber);
    }

    if(coalType){
        searchStr += "type = ? AND ";
        searchData.push(coalType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC";
    searchData.push(fromDate);
    searchData.push(toDate);

    db.serialize(function () {
        var searchString;
        searchString = "SELECT count(*) as total, SUM(netWeight) AS sumNetWeight ,SUM(paid) AS sumPaid ,SUM(unpaid) AS sumUnpaid , SUM(price) AS sumPrice FROM coalrecord " + searchStr;
            db.get(searchString, searchData, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });    
    });
};

//Search factoryRecord
DataManager.prototype.searchFactoryCoalRecords = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var coalType = query.type;

    var searchStr = "SELECT name AS name, SUM(netWeight) AS netWeight ,SUM(paid) AS paid ,SUM(unpaid) AS unpaid , SUM(price) AS price FROM coalrecord WHERE ";
    var searchData = [];
    if(coalType){
        searchStr += "type = ? AND ";
        searchData.push(coalType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? GROUP BY name order by createdDate DESC limit ? offset ?";
    searchData.push(fromDate);
    searchData.push(toDate);
    searchData.push(size);
    searchData.push(offset);
    db.serialize(function () {
        db.all(searchStr, searchData,  function (error, result) {
            if (callback) {
                self.getFactoryCoalRecordsCount(query, (err, res) => {
                    if (!error) {
                        var data = {};
                        data["content"] = result;
                        data["total"] = res.total;
                        var sumContent = {
                            "sumNetWeight":res.sumNetWeight,
                            "sumPrice":res.sumPrice,
                            "sumPaid":res.sumPaid,
                            "sumUnpaid":res.sumUnpaid
                        };
                        data["sumContent"] = [sumContent];
                        return callback(error, data);
                    }
                    callback(error, result);
                });
            }
        });
    });
};

DataManager.prototype.getFactoryCoalRecordsCount = function (query, callback) {
    var fromDate = getSearchFromDate(query.fromDate);
    var toDate = getSearchToDate(query.toDate);
    var coalType = query.type;
    
    var searchStr = "WHERE ";
    var searchData = [];
    if(coalType){
        searchStr += "type = ? AND ";
        searchData.push(coalType);
    }
    
    searchStr +="createdDate BETWEEN ? AND ? order by createdDate DESC";
    searchData.push(fromDate);
    searchData.push(toDate);

    db.serialize(function () {
        var searchString;
        searchString = "SELECT count(DISTINCT name) as total, SUM(netWeight) AS sumNetWeight ,SUM(paid) AS sumPaid ,SUM(unpaid) AS sumUnpaid , SUM(price) AS sumPrice FROM coalrecord " + searchStr;
            db.get(searchString, searchData, function (error, result) {
                if (callback) {
                    callback(error, result);
                }
            });    
    });
};

//Handle deal user
DataManager.prototype.addDealUser = function (dealUser, callback) {
    var self = this;
    var modifiedDate =  new Date().format("yyyy-MM-dd hh:mm:ss"); 
    db.serialize(function () {
        db.get("SELECT * FROM dealUser WHERE name= ?", [dealUser.name], function (error, result){
            if(result){
                callback(null, {error:"已经存在该用户，请用其他名字。"})
            }
            else{
                db.run("INSERT INTO dealUser (name, type,phone, plateNumber,address,modifiedDate) VALUES (?,?,?,?,?,?)",
            dealUser.name, dealUser.type, dealUser.phone, dealUser.plateNumber, dealUser.address, modifiedDate, function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            dealUser["id"] = this.lastID;
                            return self.getDealUser(this.lastID, callback);
                        }
                    }
                    callback(error, null);
                }
            });
            }
        });  
    });
};

DataManager.prototype.updateDealUser = function (id, dealUser, callback) {
    var self = this;
    var modifiedDate =  new Date().format("yyyy-MM-dd hh:mm:ss"); 
    db.serialize(function () {
        db.get("SELECT * FROM dealUser WHERE name= ?", [dealUser.name], function (error, result){
            if(result && result.id != id){
                callback(null, {error:"已经存在该用户，请用其他名字。"})
            }
            else{
                db.run("UPDATE dealUser SET name = ?, type=?, phone = ?, plateNumber =?, address = ?, modifiedDate = ? WHERE id = ?",
            [dealUser.name, dealUser.type, dealUser.phone, dealUser.plateNumber, dealUser.address, modifiedDate, id], function (error, result) {
                if (callback) {
                    if (!error) {
                        if (this.changes == 1) {
                            return self.getDealUser(id, callback);
                        }
                    }
                    callback(error, null);
                }
            });
            }
        });   
    });
};

DataManager.prototype.deleteDealUser = function (id, callback) {
    var self = this;
    db.serialize(function () {
        db.get("DELETE FROM dealUser WHERE id= ?", [id], function (error, result){
            if (callback) {
                if (!error) {
                    return callback(null,{});
                }
                callback(error, null);
            }
        });   
    });
};

DataManager.prototype.getDealUser = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT * FROM dealUser WHERE id= ?", [id], callback);
    });
};

DataManager.prototype.updateDealUserUpdateTime = function (name, callback) {
    db.serialize(function () {
        db.get("SELECT * FROM dealUser WHERE name= ?", [name], function (error, result){
        var id = result.id;
        var modifiedDate =  new Date().format("yyyy-MM-dd hh:mm:ss"); 
        db.serialize(function () {
            db.run("UPDATE dealUser SET modifiedDate = ? WHERE id = ?",
                [modifiedDate, id]);
            });
        });
    });
};

DataManager.prototype.getAllDealUsers = function(query, callback){
    var self = this;
    var userType = query.type;
    db.serialize(function () {
        db.all("SELECT * FROM dealUser WHERE type = ? order by modifiedDate desc", [userType],function (error, result) {
            if (callback) {
                callback(error, result);
            }
        });
    });
};

DataManager.prototype.getDealUsers = function (query, callback) {
    var self = this;
    var size = 100;
    var page = 0;
    if ("size" in query)
        size = parseInt(query.size);
    if ("page" in query)
        page = parseInt(query.page);
    var offset = page * size;
    var userType = query.type;
    db.serialize(function () {
        db.all("SELECT * FROM dealUser WHERE type = ? order by id desc limit ? offset ?", [userType, size, offset], function (error, result) {
            if (callback) {
                self.getDealUsersCount(userType,(err, res) => {
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

DataManager.prototype.getDealUsersCount = function (type, callback) {
    db.serialize(function () {
        db.get("SELECT count(*) as total FROM dealUser WHERE type = ?", [type],function (error, result) {
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