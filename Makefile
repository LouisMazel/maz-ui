version := $(shell jq -r .version packages/lib/package.json)
pretype := 'prerelease'
preid := 'alpha'

clean:
	find . -name 'node_modules' -type d -prune -exec rm -rf {} +
	find . -name 'dist' -type d -prune -exec rm -rf {} +
	find . -name 'coverage' -type d -prune -exec rm -rf {} +
	find . -name '.nx' -type d -prune -exec rm -rf {} +
	find . -name '.nuxt' -type d -prune -exec rm -rf {} +
	find . -name '.output' -type d -prune -exec rm -rf {} +
	find . -name '.DS_Store' -type f -delete
	find . -name '*.log' -type f -delete
	find . -name '*.tsbuildinfo' -type f -delete
	find . -name 'auto-imports.d.ts' -type f -delete
	find . -name 'components.d.ts' -type f -delete