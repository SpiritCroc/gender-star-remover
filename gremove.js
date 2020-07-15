// https://stackoverflow.com/a/18474626
function getAllTextNodes(){
    var result = [];

    (function scanSubTree(node){
        if (node.nodeName == "SCRIPT" || node.nodeName == "STYLE") {
            // Don't touch these
            ;
        } else if(node.childNodes.length) {
            for(var i = 0; i < node.childNodes.length; i++) {
                scanSubTree(node.childNodes[i]);
            }
        } else if(node.nodeType == Node.TEXT_NODE) {
            result.push(node);
        }
  })(document);

  return result;
}

function doReplace(options) {
    // Escape $ in replacement string
    replacement_sg_de = options.singular_de.replace("$", "$$$$");
    replacement_pl_de = options.plural_de.replace("$", "$$$$");
    neutral_articles_de = options.neutral_articles_de;
    binnen_i_de = options.binnen_i_de;
    getAllTextNodes().forEach(function(node){
        replacement = node.nodeValue;
        replacement = replacement
                // Plural first for maximum munch
                .replace(/[\*:_\/](-)?innen/gi, replacement_pl_de)
                .replace(/[\*:_\/](-)?in/gi, replacement_sg_de)
                // bracket variants if appended to word (without space in between)
                .replace(/([a-zäöüß])[\(\[](-)?innen[\)\]]/gi, "$1" + replacement_pl_de)
                .replace(/([a-zäöüß])[\(\[](-)?in[\)\]]/gi, "$1" + replacement_sg_de);
        // Binnen-I
        if (binnen_i_de) {
            replacement = replacement
                    .replace(/([a-zäöüß])(-)?Innen/g, "$1" + replacement_pl_de)
                    .replace(/([a-zäöüß])(-)?In/g, "$1" + replacement_sg_de);
        }
        // Articles and Pronouns
        if (neutral_articles_de) {
            replacement = replacement
                    // er/sie and variations
                    .replace(/(E|e)r[\*\/][Ss]ie([\*\/][Ee]s)?/g, "$1s")
                    .replace(/Sie[\*\/][Ee]r([\*\/][Ee]s)?/g, "Es")
                    .replace(/sie[\*\/]er([\*\/]es)?/g, "es")
                    // der/die and variations
                    .replace(/(D|d)er[\*\/][Dd]ie([\*\/][Dd]as)?/g, "$1as")
                    .replace(/(D|d)ie[\*\/][Dd]er([\*\/][Dd]as)?/g, "$1as")
                    // des/der and variations
                    .replace(/(D|d)es[\*\/][Dd]er([\*\/][Dd]es)?/g, "$1es")
                    .replace(/(D|d)er[\*\/][Dd]es([\*\/][Dd]es)?/g, "$1es")
                    // sein[e]/ihr[e] and variations
                    .replace(/(S|s)eine[\*\/][Ii]hre/g, "$1eine")
                    .replace(/(S|s)ein[\*\/][Ii]hr/g, "$1ein")
                    .replace(/Ihre[\*\/][Ss]eine/g, "Seine")
                    .replace(/Ihr[\*\/][Ss]ein/g, "Sein")
                    .replace(/ihre[\*\/]seine/g, "seine")
                    .replace(/ihr[\*\/]sein/g, "sein");
        }
        if (replacement != node.nodeValue) {
            //alert(node.parentNode.nodeName + ": " + node.nodeValue + " -> " + replacement);
            node.nodeValue = replacement;
        }
    });
}

function onError(error) {
    console.log(`Error: ${error}`);
}

let getting = browser.storage.sync.get({
    "singular_de": "wesen",
    "plural_de": "wesen",
    "neutral_articles_de": true,
    "binnen_i_de": false,
});
getting.then(doReplace, onError);
