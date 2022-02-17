serve:
	make --directory=packages/docs serve

serve-testing:
	make --directory=packages/testing serve

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

install:
	make install-root install-lib install-docs

install-root:
	npm i

install-lib:
	make --directory=packages/lib install

install-docs:
	make --directory=packages/docs install

reinstall:
	make reinstall-lib reinstall-docs

reinstall-lib:
	make --directory=packages/lib reinstall

reinstall-docs:
	make --directory=packages/docs reinstall

lint-staged: ## lint-staged
	npm run pre-commit

lint-staged-lib: ## install lint api packages
	make --directory=packages/lib lint-staged

lint-staged-docs: ## install lint app packages
	make --directory=packages/docs lint-staged

publish-version-tag:
	make --directory=packages/lib publish-version-tag tag="$(tag)"

publish-version:
	make --directory=packages/lib publish-version

publish-version-minor:
	make --directory=packages/lib publish-version-minor

publish-version-major:
	make --directory=packages/lib publish-version-major

commit:
	make --directory=packages/lib commit