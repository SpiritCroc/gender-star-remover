function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    singular_de: document.querySelector("#singular_de").value,
    plural_de: document.querySelector("#plural_de").value,
    neutral_articles_de: document.getElementById("neutral_articles_de").checked,
    binnen_i_de: document.getElementById("binnen_i_de").checked,
    aggressive_de: document.getElementById("aggressive_de").checked,
  });
}

function clearOptions(e) {
  e.preventDefault();
  browser.storage.sync.clear();
  location.reload();
}

function restoreOptions() {

  function setOptions(result) {
    document.querySelector("#singular_de").value = result.singular_de;
    document.querySelector("#plural_de").value = result.plural_de;
    document.getElementById("neutral_articles_de").checked = result.neutral_articles_de;
    document.getElementById("binnen_i_de").checked = result.binnen_i_de;
    document.getElementById("aggressive_de").checked = result.aggressive_de;
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
    "aggressive_de": false
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
