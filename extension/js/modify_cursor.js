var modify_cursor = function() {
  chrome.storage.local.get({
    modifyCursor: false,
  }, function (items) {
    if (items.modifyCursor) {
      var gameCanvas = document.getElementById("gameCanvas");
      if (gameCanvas != null) {
        var cursorURL = chrome.extension.getURL("/images/cursors/cursor.png");
        var cursor = "url(" + cursorURL + "), auto";
        gameCanvas.style.cursor = cursor;
        console.log("Cursor modified. (" + gameCanvas.style.cursor + ")");
      }
    }
  });

  if (false) {
    var gameCanvas = document.getElementById("gameCanvas");
    if (gameCanvas != null) {
      var cursorURL = chrome.extension.getURL("/images/cursors/cursor.png");
      var cursor = "url(" + cursorURL + "), auto";
      gameCanvas.style.cursor = cursor;
      console.log("Cursor modified. (" + gameCanvas.style.cursor + ")");
    }
  }
}

modify_cursor();
