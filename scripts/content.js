let highlights = [];
let matchIndex = -1;

chrome.runtime.onMessage.addListener(request => {
    switch (request.type) {
        case "find":
            unhighlight()
            const textNodes = [];
            findTextNodes(document.body, textNodes);

            textNodes.forEach(node => {
                const reg = new RegExp(request.keyword, "gi");
                const matches = node.textContent.match(reg);
                if (matches) {
                    highlightTextNode(node, matches);
                }
            });
            break;
        case "prev":
            if (matchIndex > 0) {
                inactiveHighlightTextNode(highlights[matchIndex]);
                activeHighlightTextNode(highlights[matchIndex - 1]);
                matchIndex--;
            }
            break;
        case "next":
            if (matchIndex < highlights.length - 1) {
                if (matchIndex >= 0) {
                    inactiveHighlightTextNode(highlights[matchIndex]);
                }
                activeHighlightTextNode(highlights[matchIndex + 1]);
                matchIndex++;
            }
            break;
        case "close":
            unhighlight()
            break;
    }
});

function activeHighlightTextNode(node) {
    node.classList.remove("highlight-inactive");
    node.classList.add("highlight-active");
}

function inactiveHighlightTextNode(node) {
    node.classList.remove("highlight-active");
    node.classList.add("highlight-inactive");
}

function unhighlight() {
    highlights = [];
    matchIndex = -1;

    const highlightedNodes = document.querySelectorAll("span.highlight-inactive,span.highlight-active");
    highlightedNodes.forEach(node => {
        const parent = node.parentNode;
        parent.replaceChild(document.createTextNode(node.textContent), node);
        parent.normalize();
    });
}

function highlightTextNode(node, matches) {
    const text = node.textContent;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    matches.forEach(match => {
        const index = text.indexOf(match, lastIndex);
        if (index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
        }
        const span = document.createElement("span");
        span.classList.add("highlight-inactive");
        span.textContent = match;
        fragment.appendChild(span);
        highlights.push(span);
        lastIndex = index + match.length;
    });
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
    node.parentNode.replaceChild(fragment, node);
}

function findTextNodes(root, textNodes) {
    if (root.nodeType === Node.TEXT_NODE && root.textContent.trim().length > 0) {
        textNodes.push(root);
    } else {
        for (let i = 0; i < root.childNodes.length; i++) {
            findTextNodes(root.childNodes[i], textNodes);
        }
    }
}
