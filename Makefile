static ?= no

install:
	STATIC_BUILD="$(static)" scripts/install

uninstall:
	scripts/uninstall

site:
	scripts/build-site
