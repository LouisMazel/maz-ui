serve-docs:
	make --directory=packages/docs serve
serve-testing:
	make --directory=packages/testing serve

audit:
	npm audit
audit-lib:
	make --directory=packages/lib audit
audit-docs:
	make --directory=packages/docs audit
audit-testing:
	make --directory=packages/testing audit
audit-cli:
	make --directory=packages/cli audit
audit-all:
	make audit audit-lib audit-docs audit-testing audit-cli

lint-lib:
	make --directory=packages/lib lint

build-docs:
	make --directory=packages/docs build
build-lib:
	make --directory=packages/lib build
build-cli:
	make --directory=packages/cli build

clean:
	rm -rf node_modules
clean-lib:
	make --directory=packages/lib clean
clean-docs:
	make --directory=packages/docs clean
clean-testing:
	make --directory=packages/testing clean
clean-cli:
	make --directory=packages/cli clean
clean-all:
	make clean clean-lib clean-docs clean-testing clean-cli

install:
	npm i
install-lib:
	make --directory=packages/lib install
install-docs:
	make --directory=packages/docs install
install-testing:
	make --directory=packages/testing install
install-cli:
	make --directory=packages/cli install
install-all:
	make install install-lib install-docs install-testing install-cli

reinstall-lib:
	make --directory=packages/lib reinstall
reinstall-docs:
	make --directory=packages/docs reinstall
reinstall-testing:
	make --directory=packages/testing reinstall
reinstall-cli:
	make --directory=packages/cli reinstall
reinstall-all:
	make clean-all clean-install-all reinstall-cli

lint-staged: ## lint-staged
	npm run pre-commit
lint-staged-lib: ## lint-staged lib
	make --directory=packages/lib lint-staged
lint-staged-testing: ## lint-staged testing
	make --directory=packages/testing lint-staged
lint-staged-cli: ## lint-staged cli
	make --directory=packages/cli lint-staged

test-unit:
	make --directory=packages/lib test-unit
test-unit-watch:
	make --directory=packages/lib test-unit-watch
test-unit-coverage:
	make --directory=packages/lib test-unit-coverage
test-unit-coverage-watch:
	make --directory=packages/lib test-unit-coverage-watch

release:
	npm run lerna:version $(type)

# CLI

create-component-files:
	make --directory=packages/cli create-files -f name=$(name)
generate-components-docs:
	make --directory=packages/cli generate-components-docs
generate-components-docs-watch:
	make --directory=packages/cli generate-components-docs --watch

check-dependencies-updates:
	npx npm-check-updates --interactive --format group