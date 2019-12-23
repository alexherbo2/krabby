static ?= no
extensions ?= yes
interactive ?= yes

all: chrome firefox surf

chrome: fetch
	extensions/krabby/scripts/build-target chrome

firefox: fetch
	extensions/krabby/scripts/build-target firefox

surf: fetch
	extensions/krabby/scripts/build-surf

fetch:
	cd packages; ../fetch

update:
	cd extensions/krabby; git pull; make static="$(static)" extensions="$(extensions)" interactive="$(interactive)"

.PHONY: build fetch
