// ==UserScript==
// @name Bundle code replacer
// @description  Modify the bundle code before it's execution
// @version 0.1
// @match https://edrickennardyan.github.io/Regex-protection/
// @run-at document-start
// @grant none
// ==/UserScript==

function START() {

    function applyRegex(code) {

        // You can add a lot of different regular expressions to modify the code
        code = code.replace(/(function START\(\) \{)/, "$1\nconsole.log('Replaced original code!!!');");
        return code;
    }

    function defineProperty(proto, name, value) {
        Object.defineProperty(proto, name, {
            value: value
        })
    }

    async function loadScript(target, script) {

        // fetch code by src and apply our regex to modify the code
        const response = await fetch(script.src);
        let code = await response.text();
        code = applyRegex(code);

        const blob = new Blob([code], { type: "text/plain" })
        const element = document.createElement("script");
        element.src = URL.createObjectURL(blob);

        // Apply protection hooks
        defineProperty(element, "src", script.src);
        defineProperty(element, "innerHTML", "");
        defineProperty(element, "innerText", "");
        defineProperty(element, "outerText", "");
        defineProperty(element, "textContent", "");
        defineProperty(element, "outerHTML", `<script src="${script.src}"></script>`);

        const srcValue = element.attributes.src;
        defineProperty(element.attributes.src, "value", script.src);
        defineProperty(element.attributes.src, "textContent", script.src);
        defineProperty(element.attributes.src, "nodeValue", script.src);

        const d1 = Object.getOwnPropertyNames;
        Object.getOwnPropertyNames = function(target) {
            if (target === element) {
                Object.getOwnPropertyNames = d1;
                return [];
            }
            return d1.call(this, target);
        }

        const d2 = Object.getOwnPropertyDescriptors;
        Object.getOwnPropertyDescriptors = function(target) {
            if (target === element) {
                Object.getOwnPropertyDescriptors = d2;
                return {};
            }
            return d2.call(this, target);
        }

        target.appendChild(element);
        URL.revokeObjectURL(element.src);
    }

    // Intercept when <script> tag is added to the DOM
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === "SCRIPT" && node.src.match(/index\.js$/)) {
                    observer.disconnect();

                    loadScript(mutation.target, node);

                    // Firefox support
                    function scriptExecuteHandler(event) {
                        event.preventDefault();
                        node.removeEventListener("beforescriptexecute", scriptExecuteHandler);
                    }
                    node.addEventListener("beforescriptexecute", scriptExecuteHandler);

                    // Remove script tag
                    node.parentElement.removeChild(node);
                }
            }
        }
    })
    observer.observe(document, {childList: true, subtree: true});
}
START();
