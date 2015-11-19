

.PHONY: all build clean test

all: clean build test

# Install modules and build the doc
build: node_modules docs

# Install node modules with NPM
node_modules:
	npm install

# Clean built directories
clean:
	-rm -rf docs
	-rm -rf node_modules

# Test library with Mocha framework
test: build
	mocha --bail

# Generate documentation with JSDoc
docs:
	jsdoc -d docs **/*.js
