install:
	scripts/setup

uninstall:
	scripts/uninstall

netlify:
	mkdir -p website/packages; cd website/packages; ../../scripts/fetch
