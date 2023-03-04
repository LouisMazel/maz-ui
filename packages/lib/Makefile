.PHONY: lint build install reinstall lint-staged

lint:
	npm run lint

audit:
	npm audit

clean:
	rm -rf node_modules

install:
	npm i

reinstall:
	make clean install

clean-build:
	npm run clean

build:
	npm run build

test-unit:
	npm run test:unit
test-unit-watch:
	npm run test:unit:watch
test-unit-coverage:
	npm run test:unit:coverage
test-unit-coverage-watch:
	npm run test:unit:coverage:watch
test-unit-coverage-master:
	npm run test:unit:coverage:master

lint-staged: ## lint-staged
	npm run pre-commit