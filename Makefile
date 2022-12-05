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
audit-all:
	make audit audit-lib audit-docs audit-testing

lint-lib:
	make --directory=packages/lib lint

build-docs:
	make --directory=packages/docs build
build-lib:
	make --directory=packages/lib build
build-watch-lib:
	make --directory=packages/lib build-watch
build-js-lib:
	make --directory=packages/lib build-js
build-modules-lib:
	make --directory=packages/lib build-modules
build-components-lib:
	make --directory=packages/lib build-components
build-component-lib:
	make --directory=packages/lib build-component component="$(component)"
build-css-lib:
	make --directory=packages/lib build-css
build-types-lib:
	make --directory=packages/lib build-types

clean:
	rm -rf node_modules
clean-lib:
	make --directory=packages/lib clean
clean-docs:
	make --directory=packages/docs clean
clean-testing:
	make --directory=packages/testing clean
clean-all:
	make clean clean-lib clean-docs clean-testing

install:
	npm i
install-lib:
	make --directory=packages/lib install
install-docs:
	make --directory=packages/docs install
install-testing:
	make --directory=packages/testing install
install-all:
	make install install-lib install-docs install-testing

reinstall-lib:
	make --directory=packages/lib reinstall
reinstall-docs:
	make --directory=packages/docs reinstall
reinstall-testing:
	make --directory=packages/testing reinstall
reinstall-all:
	make clean-all clean-install-all

lint-staged: ## lint-staged
	npm run pre-commit
lint-staged-lib: ## lint-staged lib
	make --directory=packages/lib lint-staged
lint-staged-testing: ## lint-staged testing
	make --directory=packages/testing lint-staged

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
