/* 
		You can modify its contents.
*/
const Dialog = require("sf-core/ui/dialog");
const Router = require("sf-core/ui/router");
const extend = require('js-base/core/extend');
const Page4Design = require('ui/ui_page4');
const ActivityIndicator = require('sf-core/ui/activityindicator');
const System = require('sf-core/device/system');
const Color = require('sf-core/ui/color');
const Http = require("sf-core/net/http");
const http = new Http();
const config = require("../config.json");

const Button = require('sf-core/ui/button');
const TextBox = require('sf-core/ui/textbox');
const fingerprint = require("sf-extension-utils").fingerprint;

const Page4 = extend(Page4Design)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

    this.onShow = onShow.bind(this, this.onShow.bind(this));
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    this.overlay = new Dialog();
    this.overlay.layout.backgroundColor = Color.create("#00000000");

  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
  const page = this;
  page.aiWait.visible = false;

  global.action = () => {
    let a = 5;
    fingerprint.init({
      userNameTextBox: page.textBox2,
      passwordTextBox: page.textBox3,
      button: page.login,
      autoEvents: true,
      autoLogin: true,
      callback: function(err, fingerprintResult) {
        var password;
        if (err)
          password = page.textBox3.text;
        else
          password = fingerprintResult.password;
        if (!password)
          return alert("password is required");
        loginWithUserNameAndPassword(page, page.textBox2.text, password, function(err) {
          if (err)
            return alert("Cannot login. Check user name and password. Or system is down");
          fingerprintResult && fingerprintResult.success(); //Important!
          //Router.go('dashboard', {
          //    //some data
          //});
        });
      }
    });
  };

  setTimeout(global.action, 100);

}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
  this.layout.removeChild(this.children.textBox1)


  const page = this;

  if (System.OS === "Android") {
    if (System.android.apiLevel >= 21) {
      page.login.nativeObject.setElevation(0);
      page.aiWait.nativeObject.setElevation(9);
    }
  }

  page.imageView1.onTouchEnded = function() {
    if (config.channel === "test") {
      page.textBox3.text = "123456";
      page.textBox2.text = "okan.burcak@etstur.com";
    }
  };



}



function loginWithUserNameAndPassword(page, username, password, callback) {
  http.request({
    url: 'https://mapi.etstur.com/ucuzabilet-hotel-api/api/login/login',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Cache-Control": "no-cache"
    },
    method: 'POST',
    body: JSON.stringify({
      "userName": page.textBox2.text,
      "password": page.textBox3.text
    }),
    onLoad: function(response) {
      closeDialog(page);
      response.body = response.body.toString();
      alert(JSON.stringify(response, null, "\t"), "Response");
      if (response.headers["Content-Type"].startsWith("application/json")) {
        response.body = JSON.parse(response.body.toString());

        callback(null); //to call .success

      }
      else
        callback(response.body);


    },
    onError: function(e) {
      closeDialog(page);
      if (e.statusCode === 500) {
        console.log("Internal Server Error Occurred.");
      }
      else {
        console.log("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
      }
      callback(e);
    }
  });
  page.overlay.show();
  page.aiWait.visible = true;
}

function closeDialog(page) {
  page.overlay.hide();
  page.aiWait.visible = false;
}
module && (module.exports = Page4);
