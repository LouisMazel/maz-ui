serve-docs:
	pnpm --filter maz-ui dev
serve-testing:
	pnpm --filter docs dev

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
	pnpm --filter maz-ui lint

build-docs:
	pnpm --filter docs build

build-lib:
	pnpm --filter maz-ui clean
	pnpm --filter maz-ui build
build-watch-lib:
	pnpm --filter maz-ui clean
	pnpm --filter maz-ui build:watch
build-js-lib:
	pnpm --filter maz-ui build:js
build-modules-lib:
	pnpm --filter maz-ui build:modules
build-components-lib:
	pnpm --filter maz-ui build:gen-components-entry
	pnpm --filter maz-ui build:components
build-component-lib:
	pnpm --filter maz-ui build:gen-components-entry
	pnpm --filter maz-ui build:component $(component)"
build-css-lib:
	pnpm --filter maz-ui build:css
build-types-lib:
	pnpm --filter maz-ui build:types
build-watch-lib:
	pnpm --filter maz-ui build:watch

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

lint-staged: ## lint-staged
	pnpm pre-commit
lint-staged-lib: ## lint-staged lib
	pnpm --filter maz-ui pre-commit

test-unit:
	pnpm --filter maz-ui test:unit
test-unit-watch:
	pnpm --filter maz-ui test:unit:watch
test-unit-coverage:
	pnpm --filter maz-ui test:unit:coverage
test-unit-coverage-watch:
	pnpm --filter maz-ui test:unit:coverage:watch
test-unit-coverage-master:
	pnpm --filter maz-ui test:unit:coverage:master

release:
	pnpm lerna:version
