function START() {
    const scripts = document.querySelector(".script-holder").children;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 5 different ways of "".includes, to make sure no one is intercepting it
    function includes(string, value) {
        const index = random(0, 5);
        if (index === 0) return string.indexOf(value) >= 0;
        if (index === 1) return string.search(value) >= 0;
        if (index === 2) return !!string.match(value);
        if (index === 3) return string.split(value).length > 1;
        if (index === 4) return new RegExp(value).exec(string);
        if (index === 5) return new RegExp(value).test(string);
    }
  
    // This is how script tag should look like
    // <script src="index.js">/script>
    function checkElement(script) {
        if (script.tagName !== "SCRIPT") return false;
        if (!("src" in script)) return false;

        // Make sure that nobody is using scriptElemet.innerHTML = code
        const textTypes = ["innerHTML", "innerText", "outerText", "textContent"];
        for (const type of textTypes) {
            if (script[type] !== "" || script[type].length) return false;
        }

        // Check if getters/setters exist
        const d1 = Object && Object.getOwnPropertyNames;
        if (d1 && d1(script).length !== 0) return false;
      
        const d2 = Object && Object.getOwnPropertyDescriptors;
        if (d2 && Object.keys(d2(script)).length !== 0) return false;

        const src = new Error(script.src).toString();
        const outerHTML = new Error(script.outerHTML).toString();
        if (includes(src, "blob:") ||
            !includes(src, ".js") ||
            includes(outerHTML, "blob:") ||
            !includes(outerHTML, ".js")) return false;

        // Check for script src attribute value
        const srcValue = d2(script.attributes).src.value;
        if (includes(srcValue.value, "blob:") ||
            includes(srcValue.textContent, "blob:") ||
            includes(srcValue.nodeValue, "blob:") ||
            !includes(srcValue.value, ".js") ||
            !includes(srcValue.textContent, ".js") ||
            !includes(srcValue.nodeValue, ".js")) return false;
    
        return true;
    }

    // Count is important, to make sure that we have checked all script tags without any errors
    function isProtected(scripts, count) {
        for (const script of scripts) {
            if (!checkElement(script)) return;
            count -= 1;
        }
        return count === 0;
    }

    const protected = isProtected(scripts, 1);
    const text = protected ? "✅ Nothing suspicious found!" : "⚠️ Original bundle code was replaced!!";
  
    const h1 = document.createElement("h1");
    h1.className = protected ? "green" : "yellow";
    h1.textContent = text;
    document.body.appendChild(h1);

    console.log(text);
}
START();
