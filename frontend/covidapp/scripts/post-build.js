const { gitDescribeSync } = require('git-describe');
const { name, version } = require('../package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

let path = require('path'), fs = require('fs')

console.log('post-build.js | Generating a Version...');

const gitInfo = gitDescribeSync({
    dirtyMark: false,
    dirtySemver: false
});

gitInfo.version = version;
console.log(`post-build.js | AppName[${name}] - Version[${version}]`);

const distDir = resolve(__dirname, '..', 'dist', name);
console.log(`post-build.js | DistDir[${distDir}]`);

let mainHash = 'Dev Build';
let mainBundleFile = '';
// RegExp to find main.bundle.js, even if it doesn't include a hash in it's name (dev build)
//let mainBundleRegexp = /^main-es.?([a-z0–9]*)?.js$/;
let mainBundleRegexp = /([a-z0–9]*)?.?([a-z0–9]*)?.js$/;
// read the dist folder files and find the one we're looking for

if (!fs.existsSync(distDir)){
    console.log(`post-build.js | DistDir[${distDir}] not found!`);
}
else {
    let files = fs.readdirSync(distDir);
    /*
    files.forEach(file => {
	let filename = path.join(distDir, file);
	console.log(`${filename}`);
    });
    */
    mainBundleFile = files.find(f => mainBundleRegexp.test(f));
    console.log(`post-build.js | main file [${mainBundleFile}]`);
    if (mainBundleFile) {
	mainHash = mainBundleFile.replace('main-es2015.', '').replace('.js', '');
    }
    console.log(`post-build.js | Production Build Hash: ${mainHash}`);
}
gitInfo.build = mainHash;

const file = resolve(__dirname, '..', 'src', 'environments', 'version.ts');
writeFileSync(file,
	      `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });

console.log(`post-build.js | Wrote version info ${JSON.stringify(gitInfo, null, 4)} to ${relative(resolve(__dirname, '..'), file)}`);
