version := $(shell jq -r .version packages/lib/package.json)
pretype := 'prerelease'
preid := 'alpha'

serve-all:
	pnpm --parallel serve
serve-docs:
	pnpm --filter docs dev
serve-nuxt-app:
	pnpm --filter nuxt-app dev

audit:
	pnpm audit
audit-fix:
	pnpm audit --fix

lint:
	pnpm --parallel lint
lint-lib:
	pnpm --filter maz-ui lint
lint-cli:
	pnpm --filter cli lint

build-all:
	pnpm --parallel build
build-docs:
	pnpm --filter docs build
build-lib:
	pnpm --filter maz-ui build
build-cli:
	pnpm --filter cli build

clean:
	rm -rf node_modules
clean-lib:
	rm -rf packages/lib/node_modules
clean-docs:
	rm -rf packages/docs/node_modules
clean-app:
	rm -rf packages/app/node_modules
clean-cli:
	rm -rf packages/cli/node_modules
clean-all:
	make clean clean-lib clean-docs clean-app clean-cli

install:
	pnpm install
install-docs:
	pnpm --filter docs install
install-cli:
	pnpm --filter cli install
install-lib:
	pnpm --filter maz-ui install
install-nuxt-app:
	pnpm --filter nuxt-app install

reinstall-all:
	make clean-all install

lint-staged: ## lint-staged
	npm run pre-commit
lint-staged-lib: ## lint-staged lib
	pnpm --filter maz-ui lint-staged
lint-staged-nuxt-app: ## lint-staged nuxt-app
	make --directory=packages/nuxt-app lint-staged
lint-staged-cli: ## lint-staged cli
	make --directory=packages/cli lint-staged

check-all-dependencies-update:
	pnpm update -r --interactive --latest
check-dependencies-update-latest:
	pnpm update --interactive --latest
check-docs-dependencies-update-latest:
	pnpm update --filter docs --interactive --latest
check-lib-dependencies-update-latest:
	pnpm update --filter maz-ui --interactive --latest
check-app-dependencies-update-latest:
	pnpm update --filter app --interactive --latest
check-cli-dependencies-update-latest:
	pnpm update --filter cli --interactive --latest

test-unit:
	pnpm --filter maz-ui test:unit
test-unit-silent:
	pnpm --filter maz-ui test:unit --silent
test-unit-watch:
	pnpm --filter maz-ui test:unit:watch
test-unit-coverage:
	pnpm --filter maz-ui test:unit:coverage
test-unit-coverage-watch:
	pnpm --filter maz-ui test:unit:coverage:watch
test-unit-coverage-main:
	pnpm --filter maz-ui test:unit:coverage:master

release:
	pnpm release:bump-version $(type)
	pnpm release:changelogen

print-version-lib:
	@echo "Version is: $(shell pnpm --filter maz-ui exec -- node -p "require('./package.json').version")"

publish-prerelease:
	pnpx lerna version $(pretype) --preid $(preid)
	@NEW_VERSION=$$(pnpm --filter maz-ui exec -- node -p "require('./package.json').version") && \
	git add -u && \
	git commit -m "chore(release): bump version to $$NEW_VERSION" && \
	git push origin HEAD && \
	pnpm --filter maz-ui build && \
	cd packages/lib && pnpm publish --access public --tag $(preid) --no-git-checks && \
	cd ../.. && \
	cd packages/cli && pnpm publish --access public --tag $(preid) --no-git-checks && \
	cd ../.. && \
	cd packages/nuxt-module && pnpm publish --access public --tag $(preid) --no-git-checks && \
	cd ../.. && \
	cd packages/icons && pnpm publish --access public --tag $(preid) --no-git-checks

# CLI
create-component-files:
	pnpm --filter cli cli create-files -f $(name)
generate-components-docs:
	pnpm --filter cli cli generate-components-docs
generate-components-docs-watch:
	pnpm --filter cli cli generate-components-docs --watch

build-all-packages:
	pnpm --filter @maz-ui/icons build
	pnpm --filter @maz-ui/themes build
	pnpm --filter @maz-ui/cli build
	pnpm --filter maz-ui build
	pnpm --filter @maz-ui/nuxt build
	pnpm --filter @maz-ui/eslint-config build

build-all-apps:
	pnpm --filter docs build
	pnpm --filter nuxt-app nuxt-app:build
	pnpm --filter vue-app vue-app:build
