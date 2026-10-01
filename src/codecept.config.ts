import fs from 'node:fs';
import path from 'node:path';

function readFilesRecursively(directory: string) {
    let results: string[] = [];
    const list = fs.readdirSync(directory);
    for (const file of list) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory())
            results = [...results, ...readFilesRecursively(filePath)];
        else results.push(filePath);
    }
    return results.map((element) =>
        element.replace('.ts', '.js').replaceAll('\\', '/').replace('src', '.'),
    );
}

export const config = {
  output: '../output',
  helpers: {
    Playwright: {
      url: 'https://example.com/',
      browser: 'chromium',
    },
  },
  tests: './tests/*.js',
  gherkin: {
    steps: readFilesRecursively('./src/step-definitions/'),
    features: ['../features/*.feature'],
  },
  grep: process.env.GREP ?? '.*',
  name: 'codeceptjs_parallel_bdd',
};
