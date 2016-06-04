function save_options() {
    var openAfterSaveValue = document.getElementById('openAfterSave').checked;
    var modifyCursorValue = document.getElementById('modifyCursor').checked;
    chrome.storage.local.set({
        openAfterSave: openAfterSaveValue,
        modifyCursor: modifyCursorValue
    }, function () {
    });
    //chrome.runtime.sendMessage({ openAfterSave: openAfterSaveValue });
}

function restore_options() {
    chrome.storage.local.get({
        openAfterSave: true,
        modifyCursor: false,
    }, function (items) {
        document.getElementById('openAfterSave').checked = items.openAfterSave;
        document.getElementById('modifyCursor').checked = items.modifyCursor;
        //chrome.runtime.sendMessage({ openAfterSave: items.openAfterSave });
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('openAfterSave').addEventListener('click', save_options);
document.getElementById('modifyCursor').addEventListener('click', save_options);
