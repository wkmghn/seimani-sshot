chrome.runtime.onInstalled.addListener(function () {
    // PageAction アイコンの表示/非表示切り替え
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

    // クリック時の動作
    chrome.pageAction.onClicked.addListener(function (tab) {
        // キャプチャを実行
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            var tab = tabs[0];
            chrome.tabs.executeScript(tab.tabId, { file: "js/capture.js", allFrames: true });
        });
    });
});

/*
 * キャプチャしたスクリーンショットのダウンロード(保存)関係
 */

// ダウンロードの監視
var progressingDownloadIds = []
chrome.downloads.onChanged.addListener(function (downloadDelta) {
    var downloadId = downloadDelta.id;
    var indexInArray = progressingDownloadIds.indexOf(downloadId);

    // 管理対象のダウンロードではない？
    if (indexInArray < 0) {
        return;
    }

    // ダウンロードが終わった？
    if (downloadDelta.state && downloadDelta.state.current == "complete") {
        progressingDownloadIds.splice(indexInArray, 1);

        // エクスプローラで開く(設定で有効になっている場合のみ)
        chrome.storage.local.get({
            openAfterSave: true
        }, function (options) {
            if (options.openAfterSave) {
                chrome.downloads.show(downloadId);
            }
        });
    }
});

// スクリーンショットのファイル名を作成する。
// ダウンロードディレクトリからの相対パスを返す。
function makeFilename() {
    function padZero(s, n) {
        var zeros = "";
        for (var i = 0; i < n; ++i) {
            zeros += "0";
        }
        return (zeros + s).substr(-n);
    }
    var now = new Date();
    var s = "seimani-sshot/"
    s += padZero(now.getFullYear(), 4) + "-" + padZero(now.getMonth() + 1, 2) + "-" + padZero(now.getDate(), 2) + "-" + padZero(now.getHours(), 2) + padZero(now.getMinutes(), 2) + padZero(now.getSeconds(), 2);
    s += ".png";
    return s;
}

// キャプチャ処理から送られてきたスクリーンショットイメージを受け取る
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 送られてきたイメージをダウンロード
    if (message.imageDataURL) {
        var dataURL = message.imageDataURL;
        var filename = makeFilename();
        console.log("save to \"" + filename + "\".");
        chrome.downloads.download({ url: dataURL, filename: filename }, function (downloadId) {
            progressingDownloadIds.push(downloadId);
        });
    }
})