.PHONY: test

test:
	npm run build
	npm run build-test
	npm run test
