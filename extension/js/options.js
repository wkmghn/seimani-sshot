function save_options() {
    var openAfterSaveValue = document.getElementById('openAfterSave').checked;
    chrome.storage.local.set({
        openAfterSave: openAfterSaveValue
    }, function () {
    });
    chrome.runtime.sendMessage({ openAfterSave: openAfterSaveValue });
}

function restore_options() {
    chrome.storage.local.get({
        openAfterSave: true
    }, function (items) {
        document.getElementById('openAfterSave').checked = items.openAfterSave;
        chrome.runtime.sendMessage({ openAfterSave: items.openAfterSave });
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('openAfterSave').addEventListener('click', save_options);
