deploy:
	yarn build
	firebase deploy

emulate:
	yarn build
	firebase emulators:start --import=path/to/export --export-on-exit