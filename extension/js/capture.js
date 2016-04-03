function suMain() {
    // ゲーム部分の Canvas を取得
    var gameCanvas = document.getElementById("gameCanvas");
    if (gameCanvas == null) {
        return;
    }
    // ここでは保存できないので background ページに送信
    chrome.runtime.sendMessage({ imageDataURL: gameCanvas.toDataURL() });
}
suMain();
