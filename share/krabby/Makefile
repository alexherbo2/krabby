static ?= no
interactive ?= yes

all: chrome firefox

chrome: fetch
	extensions/krabby/scripts/build-target chrome

firefox: fetch
	extensions/krabby/scripts/build-target firefox

fetch:
	./fetch

update:
	cd extensions/krabby; git pull; make static="$(static)" interactive="$(interactive)"

.PHONY: build fetch
