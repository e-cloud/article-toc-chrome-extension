// from http://stackoverflow.com/a/24558913/3326749
export function glob(pattern, input) {
  const re = new RegExp(pattern.replace(/([.?+^$[\]\\(){}|/-])/g, '\\$1').replace(/\*/g, '.*'));
  return re.test(input);
}

export function genTester(pattern) {
  return function (input) {
    return glob(pattern, input)
  }
}
