function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    singular_de: document.querySelector("#singular_de").value,
    plural_de: document.querySelector("#plural_de").value
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
    updatePreview_de(result);
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get({"singular_de": "wesen", "plural_de": "wesen"});
  getting.then(setOptions, onError);
}


// Example texts

function updatePreview_de(e) {
    document.getElementById("ex_sg_de").innerText = document.getElementById("singular_de").value;
    document.getElementById("ex_pl_de").innerText = document.getElementById("plural_de").value;
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
    "label_plural_de": "labelPlural"
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
