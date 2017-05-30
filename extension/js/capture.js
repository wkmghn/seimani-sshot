// background.js から全 frame に対してインジェクトされるスクリプト。
// gameCanvas の bounds の計算に必要な矩形情報を返す。
// 計算に不要なフレームに対して実行された場合は null を返す。

function makeResult(name, bounds) {
    return { name: name, top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height };
}

function core() {
    var e;
    if (e = document.querySelector("canvas#gameCanvas.gameCanvas")) {
        return makeResult("gameCanvas", e.getBoundingClientRect());
    }
    else if (e = document.querySelector("iframe#cocos")) {
        return makeResult("cocos", e.getBoundingClientRect());
    }
    else if (e = document.querySelector("iframe#game_frame")) {
        return makeResult("game_frame", e.getBoundingClientRect());
    }
    else {
        return null;
    }
}
core();