
.PHONY: clean resintall install-lib install-doc install serve start publish publish-beta build-doc serve-build deploy-doc gen-vuese

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

install-dep: ## Install node modules
	cd documentation && npm i $(dep) -S

serve: ## Run dev server
	cd documentation && npm run serve

start: ## Install node modules, build app and run dev server
	make clean install serve

build-entries:
	npm run build:entries

build-doc:
	cd documentation && npm run build:gh-pages && npm run export:gh-pages

gen-vuese:
	npm run gen:docs

serve-build:
	cd documentation && npm run serve:build

deploy-doc:
	make build-doc
	cd documentation && npm run deploy

publish:
	npm version $(version) --allow-same-version
	npm run pre-publish
	npm publish
	git push origin HEAD

publish-beta:
	npm version $(version) --allow-same-version
	npm run pre-publish
	npm publish --tag beta
	git push origin HEAD
