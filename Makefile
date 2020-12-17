define pre-publish
	npm run gen:docs && \
	npm run lint:fix && \
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		var j = require('./package.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./package.json', s);" && \
	git add --all && \
	git commit -m "chore(v$$NEXT_VERSION): pre-build"
	# git push origin HEAD
endef

define publish
	npm run gen:docs && \
	npm run pre-publish && \
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		var j = require('./package.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./package.json', s);" && \
	git add --all && \
	git commit -m "release(v$$NEXT_VERSION): $(1)" && \
	git tag "v$$NEXT_VERSION" -m "v$$NEXT_VERSION" && \
	git push origin HEAD && \
	npm publish && \
	make deploy-doc
endef

clean: ## Clean node modules
	rm -rf ./node_modules
	rm -rf ./documentation/node_modules

reinstall: ## Reinstall dependencies without package-lock.json
	make reinstall-lib reinstall-doc

reinstall-lib: ## Install node modules of library
	rm package-lock.json
	rm -rf node_modules
	npm i

reinstall-doc: ## Install node modules of documentation
	cd documentation && rm package-lock.json
	cd documentation && rm -rf node_modules
	cd documentation && npm i

install: ## Install node modules
	make install-lib install-doc

install-lib: ## Install node modules of library
	npm ci

install-doc: ## Install node modules of documentation
	cd documentation && npm ci

serve: ## Run dev server
	cd documentation && npm run serve

gen-vuese:
	npm run gen:docs

deploy-doc:
	cd documentation && npm run build:gh-pages && npm run export:gh-pages
	cd documentation && npm run deploy

publish-beta:
	npm version $(version) --allow-same-version
	npm run pre-publish
	npm publish --tag beta
	git push origin HEAD

pre-publish:
	@$(call pre-publish,patch)

publish:
	@$(call release,patch)

publish-minor:
	@$(call release,minor)

publish-major:
	@$(call release,major)
