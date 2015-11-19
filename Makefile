

.PHONY: build test

build: node_modules

# Install node modules with NPM
node_modules:
	npm install

# Test library with Mocha framework
test:
	mocha --bail

# Generate documentation with JSDoc
docs:
	jsdoc -d docs **/*.js
