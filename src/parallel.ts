#!/usr/bin/env node

import {event, Workers} from 'codeceptjs';

const PROCESS_ARGV_ARGUMENTS_START = 2;

const grep = process.argv
  .slice(PROCESS_ARGV_ARGUMENTS_START)
  .join('')
  .replace(/-{0,2}grep=?\s*/, '')
  .replace(/^["']/, '')
  .replace(/["']$/, '')
  .trim();

async function runWorkers(threadCount: number) {
  const workerConfigOptions: {verbose: boolean; grep?: string} = {
    verbose: true,
  };
  if (grep) workerConfigOptions.grep = grep;

  const workerConfig = {
    testConfig: __dirname + '/codecept.config.js',
    by: [['/../features/f-001.feature'], ['/../features/f-002.feature'], ['/tests/scenarios.js']],
    options: workerConfigOptions,
  };
  const workers = new Workers(threadCount, workerConfig);
  workers.on(event.test.failed, (failedTest: {title: string}) => {
    console.log('Failed :', failedTest.title);
  });
  workers.on(event.test.passed, (successTest: {title: string}) => {
    console.log('Passed :', successTest.title);
  });
  workers.on(event.all.result, () => {
    workers.printResults();
  });
  try {
    await workers.run();
  } catch (error) {
    console.log('Workers error', error);
  }
}

const THREAD_COUNT = 1;
async function runTests() {
  try {
    await runWorkers(THREAD_COUNT);
  } catch (error) {
    console.error('Error during test execution', error);
  }
}

runTests()
  .then(() => {
    console.log('Tests finished');
  })
  .catch(
    (error: unknown) =>
      `Tests did not finish because:\n${error instanceof Error ? error.toString() : 'Unknown error'}`,
  );
