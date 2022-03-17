serve-doc:
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

build-modules-lib:
	make --directory=packages/lib build-modules

build-components-lib:
	make --directory=packages/lib build-components

build-css-lib:
	make --directory=packages/lib build-css

build-types-lib:
	make --directory=packages/lib build-types

install:
	make install-root install-lib install-docs install-testing

install-root:
	npm i

install-lib:
	make --directory=packages/lib install

install-docs:
	make --directory=packages/docs install

install-testing:
	make --directory=packages/testing install

reinstall:
	make reinstall-lib reinstall-docs reinstall-testing

reinstall-lib:
	make --directory=packages/lib reinstall

reinstall-docs:
	make --directory=packages/docs reinstall

reinstall-testing:
	make --directory=packages/testing reinstall

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