
.PHONY: clean resintall install-lib install-doc install serve start publish

clean: ## Clean node modules
	rm -rf ./node_modules
	rm -rf ./documentation/node_modules

reinstall: ## Reinstall dependencies without package-lock.json
	npm i
	npm i documentation

install-lib: ## Install node modules of library
	npm ci

install-doc: ## Install node modules of documentation
	npm ci documentation

install: ## Install node modules
	make install-lib
	make install-doc

serve: ## Run dev server
	npm run serve

start: ## Install node modules, build app and run dev server
	make clean
	make install
	make serve

publish:
	npm version $(version) && npm run pre-publish && gaa && gc -m "[build][$(version)]" && ggp && npm publish
