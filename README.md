# Regex-protection
A practical example of how to protect your `<script>` element and bypass its protection.
  
  The most known extension for creating userscripts is Tampermonkey.

  With its help, user can intercept your script element and by fetching the src create a new modified code on the page.
  
  This is method is called as code replacement (regular expression hooks)
  
  How to test userscript
  ---------------
  - Download tampermonkey extension in your browser
  - Create a new userscript [#anti-regex-protection](./anti-regex-protection.js) in tampermonkey
  - Open demo version: https://edrickennardyan.github.io/Regex-protection/
