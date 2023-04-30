const {exec} = require('child_process');
const fs = require('fs');

function watchFile(fileName, signal) {
  fs.cp(fileName, `dist/${fileName}`, {recursive: true}, () => {});
  fs.watch(fileName, {signal}, () => {
    fs.cp(fileName, `dist/${fileName}`, {recursive: true}, () => {});
  });
}

function main() {
  const serverChild = exec('npx http-server dist -c-1 -p4200');
  const esbuildChild = exec('npx esbuild src/main.ts --bundle --outdir=dist --watch');

  const abortController = new AbortController();

  watchFile('index.html', abortController.signal);
  watchFile('styles.css', abortController.signal);
  watchFile('assets', abortController.signal);

  serverChild.stdout?.on('data', console.log);
  esbuildChild.stdout?.on('data', console.log);

  process.on('exit', () => {
    abortController.abort();
    serverChild.kill('SIGKILL');
    esbuildChild.kill('SIGKILL');
  })
}


main();
