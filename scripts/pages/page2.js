const extend = require("js-base/core/extend");
const Router = require("sf-core/ui/router");
const Color = require("sf-core/ui/color");

// Get generated UI code
var Page2Design = require("../ui/ui_page2");

const Page2 = extend(Page2Design)(
    function(_super) {
        _super(this);
        this._superOnShow = this.onShow;

        this.onShow = onShow.bind(this);
        this.btn.onPress = btn_onPress.bind(this);
    });

function onShow(e) {
    this._superOnShow();
    this.headerBar.itemColor = Color.BLACK;
    if (!e) return;
    console.log(e.message);
}

function btn_onPress() {
    Router.goBack(undefined,{
        mehmet:true
    });
}

module && (module.exports = Page2);
