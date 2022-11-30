.PHONY: lint build install reinstall lint-staged

lint:
	npm run lint

build:
	make clean-build && npm run build

build-js:
	npm run build:js

build-modules:
	npm run build:modules

build-components:
	npm run build:gen-components-entry && npm run build:components

build-component:
	npm run build:gen-components-entry && npm run build:component -- $(component)

build-types:
	npm run build:types

build-css:
	npm run build:css

clean-build:
	npm run clean

build-watch:
	npm run build:watch

install:
	npm i

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

reinstall:
	rm -rf ./node_modules
	npm i

lint-staged: ## lint-staged
	npm run pre-commit

define GetFromPkg
	$(shell node -p "require('./package.json').$(1)")
endef

define push-version
	make clean-build
	make build
	# npm publish
	# git add .
	# git commit -m "chore(lib): bump-version to $(call GetFromPkg,version)"
	# git push origin HEAD
endef

define push-version-tag
	make clean-build
	make build
	npm publish --tag $(1)
	# git add .
	# git commit -m "chore(lib): bump-version to $(call GetFromPkg,version)"
	# git push origin HEAD
endef

publish-version-tag:
	@$(call push-version-tag,$(tag))

publish-version:
	@$(call push-version,patch)

publish-version-minor:
	@$(call push-version,minor)

publish-version-major:
	@$(call push-version,major)