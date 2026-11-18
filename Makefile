FIND = find . -name 'node_modules' -prune -o

clean:
	find . -name 'node_modules' -type d -prune -exec rm -rf {} +
	$(FIND) -name 'dist' -type d -prune -exec rm -rf {} +
	$(FIND) -name 'coverage' -type d -prune -exec rm -rf {} +
	$(FIND) -name 'cache' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.nx' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.nuxt' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.output' -type d -prune -exec rm -rf {} +
	find ./packages -maxdepth 2 -name 'agent-docs' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.DS_Store' -type f -delete
	$(FIND) -name '*.log' -type f -delete
	$(FIND) -name '*.tsbuildinfo' -type f -delete
	$(FIND) -name 'auto-imports.d.ts' -type f -delete
	$(FIND) -name 'components.d.ts' -type f -delete

clean-output:
	$(FIND) -name 'dist' -type d -prune -exec rm -rf {} +
	$(FIND) -name 'coverage' -type d -prune -exec rm -rf {} +
	$(FIND) -name 'cache' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.nx' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.nuxt' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.output' -type d -prune -exec rm -rf {} +
	find ./packages -maxdepth 2 -name 'agent-docs' -type d -prune -exec rm -rf {} +
	$(FIND) -name '.DS_Store' -type f -delete
	$(FIND) -name '*.log' -type f -delete
	$(FIND) -name '*.tsbuildinfo' -type f -delete
	$(FIND) -name 'auto-imports.d.ts' -type f -delete
	$(FIND) -name 'components.d.ts' -type f -delete