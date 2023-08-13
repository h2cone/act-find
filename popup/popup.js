const keywordInput = document.getElementById("keyword-input");
const resultSpan = document.getElementById("result-span");
const closeBtn = document.getElementById("close-btn");
const prevMatchBtn = document.getElementById("prev-match-btn");
const nextMatchBtn = document.getElementById("next-match-btn");

var tabId;

async function getTabId() {
  if (tabId !== undefined) {
    return tabId;
  }
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;
  return tab.id;
}

keywordInput.addEventListener("input", async function () {
  var keyword = keywordInput.value;
  if (keyword.length === 0) {
    chrome.tabs.sendMessage(await getTabId(), {
      type: "clear",
    });
    return;
  }
  tabId = await getTabId()
  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    files: ["highlight.css"]
  });
  chrome.tabs.sendMessage(tabId, {
    type: "find",
    keyword: keyword
  });
});

prevMatchBtn.addEventListener("click", async function () {
  if (keywordInput.value === 0) {
    return;
  }
  chrome.tabs.sendMessage(await getTabId(), {
    type: "prev",
  });
});

nextMatchBtn.addEventListener("click", async function () {
  if (keywordInput.value.length === 0) {
    return;
  }
  chrome.tabs.sendMessage(await getTabId(), {
    type: "next",
  });
});

closeBtn.addEventListener("click", async function () {
  chrome.tabs.sendMessage(await getTabId(), {
    type: "close",
  });
  window.close();
});
