// ゲーム部分の Canvas を取得
console.log("BeginCapture in " + document.URL);
var gameCanvas = document.getElementById("gameCanvas");
if (gameCanvas != null) {
    //console.log("Found gameCanvas in " + document.URL);
    // ここでは保存できないので background ページに送信
    chrome.runtime.sendMessage({ imageDataURL: gameCanvas.toDataURL() });
}
else {
    //console.log("NOT FOUND gameCanvas in " + document.URL);
}
