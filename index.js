function START() {
    const scripts = document.querySelector(".script-holder").children;

    // Default example of the script tag
    // <script src="index.js">/script>
    function checkElement(script) {
        if (script.tagName !== "SCRIPT") return false;
        if (!("src" in script)) return false;

        const textTypes = ["innerHTML", "innerText", "outerText", "textContent"];
        for (const type of textTypes) {
            if (script[type] !== "" || script[type].length) return false;
        }
        //console.log(Object.getOwnPropertyDescriptor(script));
        return true;
    }
    
    const isSafe = [...scripts].every(script => checkElement(script));
    console.log(isSafe ? "✅ Nothing suspicious found!" : "⚠️ Original bundle code was replaced!!");
}
START();
