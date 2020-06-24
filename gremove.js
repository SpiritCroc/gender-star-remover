// https://stackoverflow.com/a/18474626
function getAllTextNodes(){
    var result = [];

    (function scanSubTree(node){
        if(node.childNodes.length) {
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
    getAllTextNodes().forEach(function(node){
        node.nodeValue = node.nodeValue
                // Plural first for maximum munch
                .replace(/[\*:_]innen/gi, replacement_pl_de)
                .replace(/[\*:_]in/gi, replacement_sg_de)
                // bracket variants if appended to word (without space in between)
                .replace(/([a-zäöüß])[\(\[]innen[\)\]]/gi, "$1" + replacement_pl_de)
                .replace(/([a-zäöüß])[\(\[]in[\)\]]/gi, "$1" + replacement_sg_de)
                // directly appended with capitalization variant
                .replace(/([a-zäöüß])Innen/g, "$1" + replacement_pl_de)
                .replace(/([a-zäöüß])In/g, "$1" + replacement_sg_de);
    });
}

function onError(error) {
    console.log(`Error: ${error}`);
}

let getting = browser.storage.sync.get({"singular_de": "wesen", "plural_de": "wesen"});
getting.then(doReplace, onError);
