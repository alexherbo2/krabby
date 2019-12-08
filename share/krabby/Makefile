static ?= no
extensions ?= yes

all: chrome firefox

chrome: fetch
	scripts/build-target chrome

firefox: fetch
	scripts/build-target firefox

fetch:
	cd packages; ../fetch

update:
	cd extensions/krabby; git pull; make static="$(static)" extensions="$(extensions)"

.PHONY: build fetch
