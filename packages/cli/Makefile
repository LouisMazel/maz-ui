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

lint-staged: ## lint-staged
	npm run pre-commit

create-component-files:
	npm run maz-cli create-files -f $(name)

generate-components-docs:
	npm run maz-cli generate-components-docs

generate-components-docs-watch:
	npm run maz-cli generate-components-docs --watch

check-dependencies-updates:
	npx npm-check-updates --interactive --format group
