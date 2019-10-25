build: fetch
	zip --recurse-paths package.zip manifest.json config.js packages

fetch:
	cd packages; ../fetch

update:
	cd extensions/krabby; git pull; make

.PHONY: build fetch
