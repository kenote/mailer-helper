
all: install

clear:
	@rm -rf dist
	@rm -rf node_modules

publish:
	@rm -rf dist
	@rm -rf node_modules
	@npm set registry https://registry.npmjs.org
	@npm publish

install:
	@npm set registry https://registry.npm.taobao.org
	@npm install
	
update:
	@npm set registry https://registry.npm.taobao.org
	@npm update