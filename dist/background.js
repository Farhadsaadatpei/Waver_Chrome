/**
 * Data Bus
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    // Request for Block List
    if (request.method == "blockList"){
        // Get popup Block List Storage
        chrome.storage.local.get(['WaverBlockList'], function(data) {
            // Pass the data to Content Script
            sendResponse(data.WaverBlockList);
        });
    }
});