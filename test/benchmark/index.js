import calmcard from 'calmcard'
import { genTester } from '../../src/util/whiteList'

const target = 'medium.com/google-developer-experts/angular-2-testing-guide-a485b6cb1ef0'

function test1() {
  console.time('reg')

  for (let i = 0; i < 100000; i++) {
    const tester = genTester('medium.com/*')
    tester(target)
  }

  console.timeEnd('reg')
}

function test2() {
  console.time('calmcard')
  for (let i = 0; i < 100000; i++) {
    calmcard('medium.com/*', target)
  }

  console.timeEnd('calmcard')
}

test1()

test2()
