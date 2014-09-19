userscript: target core
	cat src/userscript-head.js target/core.js src/userscript-tail.js > target/single.user.js

core: target
	cat src/util.js src/movement.js src/sequences.js > target/core.js

target: clean
	mkdir -p target

clean:
	rm -rf target
