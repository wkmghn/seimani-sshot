chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    var tab = tabs[0];
    chrome.tabs.executeScript(tab.tabId, { file: "js/capture.js", allFrames: true });
});
