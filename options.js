function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    singular_de: document.querySelector("#singular_de").value,
    plural_de: document.querySelector("#plural_de").value,
    neutral_articles_de: document.getElementById("neutral_articles_de").checked,
    binnen_i_de: document.getElementById("binnen_i_de").checked,
    aggressive_de: document.getElementById("aggressive_de").checked,
    lang_select_de: getSelection(document.getElementById("lang_select_de")),
  });
}

function clearOptions(e) {
  e.preventDefault();
  browser.storage.sync.clear();
  location.reload();
}

function setSelection(element, choice) {
    for (var opt, j = 0; opt = element.options[j]; j++) {
        if (opt.value == choice) {
            element.selectedIndex = j;
            break;
        }
    }
}

function getSelection(element) {
    return element.options[element.selectedIndex].value;
}

function restoreOptions() {

  function setOptions(result) {
    document.querySelector("#singular_de").value = result.singular_de;
    document.querySelector("#plural_de").value = result.plural_de;
    document.getElementById("neutral_articles_de").checked = result.neutral_articles_de;
    document.getElementById("binnen_i_de").checked = result.binnen_i_de;
    document.getElementById("aggressive_de").checked = result.aggressive_de;
    setSelection(document.getElementById("lang_select_de"), result.lang_select_de);
    updatePreview_de(result);
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
    "lang_select_de": "unknown"
  });
  getting.then(setOptions, onError);
}


// Example texts

function updatePreview_de(e) {
    replacement_sg_de = document.getElementById("singular_de").value;
    replacement_pl_de = document.getElementById("plural_de").value;
    document.getElementById("ex_sg_de").innerText = replacement_sg_de;
    document.getElementById("ex_pl_de").innerText = replacement_pl_de;
    document.getElementById("ex_articles_de").innerText =
                document.getElementById("neutral_articles_de").checked ? "Das" : "Der*die";
    document.getElementById("ex_binnen_i_sg_de").innerText =
                document.getElementById("binnen_i_de").checked ? replacement_sg_de : "In";
    document.getElementById("ex_aggressive_pl_de").innerText =
                document.getElementById("aggressive_de").checked ? replacement_pl_de : "/innen";
}


// Localisation
id_msg_map = {
    "header_save": "headerSave",
    "note_save": "noteSave",
    "button_save": "buttonSave",
    "header_restore": "headerRestore",
    "button_restore": "buttonRestore",
    "header_de": "headerGerman",
    "header_example_de": "headerExample",
    "label_singular_de": "labelSingular",
    "label_plural_de": "labelPlural",
    "label_neutral_articles_de": "labelNeutralArticlePronouns",
    "label_binnen_i_de": "labelBinnenI",
    "label_aggressive_de": "labelAggressive",
    "label_lang_select_de": "labelLangSelect",
    "lang_select_de_strict": "langSelectStrictDe",
    "lang_select_de_unknown": "langSelectUnknownAndDe",
    "lang_select_de_all": "langSelectAll",
}
for (var id in id_msg_map) {
    document.getElementById(id).innerText = browser.i18n.getMessage(id_msg_map[id]);
}

// Event listeners
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("replacement_form").addEventListener("submit", saveOptions);
document.getElementById("restore_form").addEventListener("submit", clearOptions);
document.getElementById("singular_de").addEventListener("input", updatePreview_de);
document.getElementById("plural_de").addEventListener("input", updatePreview_de);
document.getElementById("neutral_articles_de").addEventListener("input", updatePreview_de);
document.getElementById("binnen_i_de").addEventListener("input", updatePreview_de);
document.getElementById("aggressive_de").addEventListener("input", updatePreview_de);
