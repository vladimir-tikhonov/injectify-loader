.PHONY: test

setup:
	yarn install

lint:
	npm run eslint

test:
	npm run build
	npm run build-test
	npm run test
