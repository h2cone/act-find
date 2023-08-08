const REQUEST_TYPES = ["find", "prev", "next", "close"];

chrome.runtime.onMessage.addListener((request) => {
    if (REQUEST_TYPES.includes(request.type)) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length > 0) {
                tabId = tabs[0].id;
                chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: ["highlight.css"]
                });
                chrome.tabs.sendMessage(tabId, request);
            } else {
                console.error("No tab found");
            }
        });
    }
});