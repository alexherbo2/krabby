static ?= no
extensions ?= yes

all: chrome firefox

chrome: fetch
	extensions/krabby/scripts/build-target chrome

firefox: fetch
	extensions/krabby/scripts/build-target firefox

surf: fetch
	extensions/krabby/scripts/build-surf

fetch:
	cd packages; ../fetch

update:
	cd extensions/krabby; git pull; make static="$(static)" extensions="$(extensions)"

.PHONY: build fetch
