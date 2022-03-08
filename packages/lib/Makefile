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

define push-version
	make install
	make clean-build
	make build
	# npm publish
	# git add .
	# git commit -m "chore(lib): bump-version to $(call GetFromPkg,version)"
	# git push origin HEAD
endef

define push-version-tag
	make install
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