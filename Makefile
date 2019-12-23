static ?= no
extensions ?= yes
interactive ?= yes

install:
	STATIC_BUILD="$(static)" BUILD_EXTENSIONS="$(extensions)" INTERACTIVE="$(interactive)" scripts/install

uninstall:
	scripts/uninstall

site:
	scripts/build-site
