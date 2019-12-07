static ?= no
extensions ?= yes

all: chrome firefox

chrome: fetch

firefox: fetch
	scripts/build-firefox

fetch:
	cd packages; ../fetch

update:
	cd extensions/krabby; git pull; make static="$(static)" extensions="$(extensions)"

.PHONY: build fetch
