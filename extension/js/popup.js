chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // スクリーンショットをプレビュー用の img タグに流し込む
    if (message.imageDataURL) {
        var dataURL = message.imageDataURL;
        var node = document.getElementById("preview_image");
        node.setAttribute("src", dataURL);
        node.setAttribute("width", "300px");
        //node.setAttribute("height", "60px");
        console.log(node);
        console.log("Set preview.");
    }
})

// キャプチャを実行
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    var tab = tabs[0];
    chrome.tabs.executeScript(tab.tabId, { file: "js/capture.js", allFrames: true });
});
