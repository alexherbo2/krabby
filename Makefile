install:
	scripts/setup

uninstall:
	rm -Rf ~/.config/krabby

netlify:
	mkdir -p website/packages; cd website/packages; ../../scripts/fetch
