import Vue from "vue";
import axios from "axios";
import store from "../store/";

const RLPlugin = {
  install(Vue, options) {
    // We call Vue.mixin() here to inject functionality into all components.
    Vue.mixin({
      mounted() {
        //console.log("RLPlugin Mounted!");
      }
    });
    axios.defaults.timeout = 6000;
    Vue.http = function(method, url, data, cb) {
      if (window.cordova && !(window.cordova instanceof HTMLElement)) {
        console.log("cordova defined");
        url = "https://dev.patronmobile.com" + url;
      } else {
        // var api_prefix = "/demo1";
        //url = api_prefix + url;
      }
      axios({
        method: method,
        url: url,
        data: data,
        headers: {
          "X-Patron-POS-Access-Token": store.state.token
        }
      })
        .then(function(res) {
          if (cb != null) cb(true, res.data);
        })
        .catch(function(res) {
          if (cb != null) {
            if (res.response.status == 400) {
              var result = {
                code: res.response.data.code,
                message: res.response.data.message
              };
              cb(false, result);
            } else {
              var result = {
                code: res.response.status,
                message: ""
              };
              cb(false, result);
            }
          }
        });
    };
    Vue.prototype.$util = {
      showPrice: function(price) {
        return "$" + Number(price / 100).toFixed(2);
      },
      showImage: function(image) {
        if (image != null) return store.state.s3 + image;
        return "";
      },
      listWraperStyle: function(top, bottom) {
        if (this.hideNavBar()) top = top - 46;
        return {
          width: "100%",
          position: "absolute",
          top: top + "px",
          bottom: bottom + "px",
          overflow: "scroll"
        };
      },
      getHeightByClassName: function(cn) {
        var x = document.getElementsByClassName(cn);
        for (var i = 0; i < x.length; i++) {
          var element = x[i];
          return element === window
            ? element.innerHeight
            : element.getBoundingClientRect().height;
        }
        return 0;
      },
      formatTimestamp: function(t) {
        var newDate = new Date();
        newDate.setTime(t);
        return newDate.toLocaleString();
      },
      hideNavBar: function() {
        return false; //store.state.clientType == 1;
      }
    };
  }
};

export default RLPlugin;
