static ?= no
extensions ?= yes

install:
	STATIC_BUILD="$(static)" BUILD_EXTENSIONS="$(extensions)" scripts/install

uninstall:
	scripts/uninstall

site:
	scripts/build-site
