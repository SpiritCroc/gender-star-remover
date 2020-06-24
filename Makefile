.PHONY: all clean

GEN_ICONS := icons/icon_16dp.png icons/icon_32dp.png icons/icon_48dp.png icons/icon_96dp.png icons/icon_128dp.png

EXTENSION_OUT := gremove@spiritcroc.de.xpi
EXTENSION_CONTENT := manifest.json $(wildcard *.html) $(wildcard *.js) $(wildcard _locales/**/*) $(wildcard icons/*) $(GEN_ICONS)

all: $(EXTENSION_OUT)

icons/icon_%dp.png: graphics/icon.svg
	inkscape $< --export-filename=$@ -C --export-width=$(patsubst icons/icon_%dp.png,%,$@)

$(EXTENSION_OUT): $(EXTENSION_CONTENT)
	zip -r -FS $@ $^

clean:
	rm -f $(EXTENSION_OUT) $(GEN_ICONS)
