.PHONY: test

setup:
	yarn install

lint:
	npm run eslint

test:
	npm run build
	npm run build-test
	npm run test

release:
	cp -f ./tmp/index.js ./dist/index.js
