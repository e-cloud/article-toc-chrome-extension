import calmcard from 'calmcard'
import { genTester } from '../../../src/util/whiteList'


describe('Test whitelist', () => {
  it('should pass tests', () => {
    const tester = genTester('medium.com/*')
    let target = 'https://medium.com/google-developer-experts/angular-2-testing-guide-a485b6cb1ef0'
    expect(tester(target)).to.equal(true)

    target = 'https://test.medium.com/google-developer-experts/angular-2-testing-guide-a485b6cb1ef0'
    expect(tester(target)).to.equal(true)

    target = 'medium.com.co/google-developer-experts/angular-2-testing-guide-a485b6cb1ef0'
    expect(tester(target)).to.equal(false)
  });

  it('should test calmcard', function () {
    expect(calmcard('*foobar', 'foobar')).to.equal(false)
    expect(calmcard('*bar', 'foobar')).to.equal(true)
    expect(calmcard('medium.com/*', 'medium.com/google-developer-experts/angular-2-testing-guide-a485b6cb1ef0')).to.equal(true)
  })
});
