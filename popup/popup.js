const keywordInput = document.getElementById("keyword-input");
const resultSpan = document.getElementById("result-span");
const closeBtn = document.getElementById("close-btn");
const prevMatchBtn = document.getElementById("prev-match-btn");
const nextMatchBtn = document.getElementById("next-match-btn");

keywordInput.addEventListener("input", function () {
  var keyword = keywordInput.value;
  if (keyword.length === 0) {
    return;
  }
  chrome.runtime.sendMessage({
    type: "find",
    keyword: keyword
  });
});

prevMatchBtn.addEventListener("click", function () {
  if (keywordInput.value === 0) {
    return;
  }
  chrome.runtime.sendMessage({
    type: "prev",
  });
});

nextMatchBtn.addEventListener("click", function () {
  if (keywordInput.value.length === 0) {
    return;
  }
  chrome.runtime.sendMessage({
    type: "next",
  });
});

closeBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({
    type: "close",
  });
  window.close();
});
