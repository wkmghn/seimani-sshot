chrome.runtime.onInstalled.addListener(function () {
    console.log("add listener.")
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=763917/" }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


/*
 * キャプチャしたスクリーンショットの保存関係
 */

function makeFilename() {
    function padZero(s, n) {
        var zeros = "";
        for (var i = 0; i < n; ++i) {
            zeros += "0";
        }
        return (zeros + s).substr(-n);
    }
    var now = new Date();
    var s = "seimani-util/"
    s += padZero(now.getFullYear(), 4) + "-" + padZero(now.getMonth() + 1, 2) + "-" + padZero(now.getDate(), 2) + "-" + padZero(now.getHours(), 2) + padZero(now.getMinutes(), 2) + padZero(now.getSeconds(), 2);
    s += ".png";
    return s;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 送られてきたイメージを保存
    if (message.imageDataURL) {
        var dataURL = message.imageDataURL;
        var filename = makeFilename();
        console.log(filename);
        chrome.downloads.download({ url: dataURL, filename: filename });
    }
})