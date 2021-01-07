static ?= no
interactive ?= yes

install:
	STATIC_BUILD="$(static)" INTERACTIVE="$(interactive)" scripts/install

uninstall:
	scripts/uninstall

site:
	scripts/build-site
