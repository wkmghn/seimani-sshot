chrome.runtime.onInstalled.addListener(function () {
    // PageAction アイコンの表示/非表示切り替え
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: "http://pc-play.games.dmm.com/play/seiken/" }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
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

// クリック時の動作
chrome.pageAction.onClicked.addListener(function (tab) {
    // キャプチャを実行
    chrome.tabs.captureVisibleTab({ format: "png" }, function (screenshotUrl) {
        // ゲーム部分の位置情報を収集
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            chrome.tabs.executeScript(tabs[0].tabId, { file: "js/capture.js", allFrames: true }, function (results) {
                var gameCanvasBounds = null;
                var totalOffset = { left: 0, top: 0 };
                for (var result of results) {
                    if (result) {
                        if (result.name == "gameCanvas") {
                            gameCanvasBounds = result;
                        }
                        else {
                            totalOffset.left += result.left;
                            totalOffset.top += result.top;
                        }
                    }
                }
                // gameCanvas のスクリーンショット内での位置と大きさ
                var x = gameCanvasBounds.left + totalOffset.left;
                var y = gameCanvasBounds.top + totalOffset.top;
                var width = gameCanvasBounds.width;
                var height = gameCanvasBounds.height;

                // 切り出し処理用の canvas を作成
                var cropCanvas = document.createElement("canvas");
                cropCanvas.width = width;
                cropCanvas.height = height;
                var context = cropCanvas.getContext("2d")

                var image = document.createElement("img");
                // イメージがロードされてから保存するために、ハンドラ内で保存処理を行う。
                // src の設定より先にハンドラの設定をしておかないと、ハンドラの設定が間に合わない場合がある。
                image.onload = function () {
                    context.drawImage(image, x, y, width, height, 0, 0, width, height);
                    var filename = makeFilename();
                    console.log("save to \"" + filename + "\".");
                    chrome.downloads.download({ url: cropCanvas.toDataURL(), filename: filename }, function (downloadId) {
                        progressingDownloadIds.push(downloadId);
                    });
                };
                image.src = screenshotUrl;
            });
        });
    });
});

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
