// null -> website didn't tell us the language
const UNKNOWN_LANGS = [null];
const STRICT_DE_LANGS = ["de"];
const DE_LANGS = STRICT_DE_LANGS.concat(UNKNOWN_LANGS);

// https://stackoverflow.com/a/18474626
function getAllTextNodes() {
    var result = [];

    (function scanSubTree(node){
        if (node.nodeName == "SCRIPT" || node.nodeName == "STYLE") {
            // Don't touch these
            ;
        } else if (node.childNodes.length) {
            for(var i = 0; i < node.childNodes.length; i++) {
                scanSubTree(node.childNodes[i]);
            }
        } else if (node.nodeType == Node.TEXT_NODE) {
            result.push(node);
        }
  })(document);

  return result;
}

function getNodeLang(node) {
    // Is node an element?
    if (node.nodeType == 1) {
        nodeLang = node.getAttribute("lang");
    } else {
        nodeLang = null;
    }
    if (nodeLang == null || nodeLang == "") {
        if (node.parentNode == null) {
            return null;
        } else {
            return getNodeLang(node.parentNode);
        }
    } else {
        return nodeLang;
    }
}

function shouldHandle(node, lang_list) {
    if (lang_list == null) {
        return true;
    }
    lang = getNodeLang(node);
    return lang_list.includes(lang);
}

function doReplace(options) {
    // Escape $ in replacement string
    replacement_sg_de = options.singular_de.replace("$", "$$$$");
    replacement_pl_de = options.plural_de.replace("$", "$$$$");
    neutral_articles_de = options.neutral_articles_de;
    binnen_i_de = options.binnen_i_de;
    aggressive_de = options.aggressive_de;
    switch(options.lang_select_de) {
        case "strict":
            lang_list_de = STRICT_DE_LANGS;
            break;
        case "any":
            lang_list_de = null;
            break;
        case "unknown":
        default:
            lang_list_de = DE_LANGS;
            break;
    }
    // In case we support other languages than german in the future,
    // we need to move the per-node language detection in here
    getAllTextNodes().forEach(function(node){
        replacement = node.nodeValue;
        if (shouldHandle(node, lang_list_de)) {
            if (aggressive_de) {
                // Aggressive mode features '/' and '_' in addition to normal mode substitutions,
                // and also variants that replace 'i' with '!' or 'ï'
                replacement = replacement
                        // Plural first for maximum munch
                        .replace(/[\*:_\/](-)?innen/gi, replacement_pl_de)
                        .replace(/[\*:_\/](-)?in/gi, replacement_sg_de)
                        // replaced 'i' variants
                        .replace(/[!ï/]nnen/gi, replacement_pl_de)
                        .replace(/[!ï/]n/gi, replacement_sg_de);
            } else {
                replacement = replacement
                        // Plural first for maximum munch
                        .replace(/[\*:](-)?innen/gi, replacement_pl_de)
                        .replace(/[\*:](-)?in/gi, replacement_sg_de);
            }
            replacement = replacement
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
    "aggressive_de": false,
    "lang_select_de": "unknown",
});
getting.then(doReplace, onError);
