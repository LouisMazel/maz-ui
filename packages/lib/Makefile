.PHONY: lint build install reinstall lint-staged

lint:
	npm run lint

build:
	make clean-build && npm run build

build-js:
	npm run build:js

clean-build:
	npm run clean

build-watch:
	npm run build:watch

install:
	npm i

reinstall:
	rm -rf ./node_modules
	rm package-lock.json
	npm i

lint-staged: ## lint-staged
	npm run pre-commit

define GetFromPkg
	$(shell node -p "require('./package.json').$(1)")
endef

define bump-version
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	npm version $$NEXT_VERSION
endef

define bump-version-tag
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", 'prerelease', '$(1)')"` && \
	npm version $$NEXT_VERSION
endef

define push-version
	make install
	make clean-build
	make build
	# @$(call bump-version,$(1))
	# npm publish
	git add .
	git commit -m "chore(lib): bump-version to $(shell node -p "require('./package.json').version")"
	# git push origin HEAD
endef

define push-version-tag
	make install
	make clean-build
	make build
	@$(call bump-version-tag,$(1))
	npm publish --tag $(1)
	git add .
	git commit -m "chore(lib): bump-version to $(shell node -p "require('./package.json').version")"
	git push origin HEAD
endef

publish-version-tag:
	@$(call push-version-tag,$(tag))

publish-version:
	@$(call push-version,patch)

publish-version-minor:
	@$(call push-version,minor)

publish-version-major:
	@$(call push-version,major)