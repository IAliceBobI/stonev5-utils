import { removeXAndAfter, removeAfter } from '../src/array';

describe('array test', () => {
  test('removeXAndAfter', () => {
    const a = ["a", "b", "c", "d"];
    removeXAndAfter(a, (v) => v == "b");
    expect(a).toStrictEqual(["a"])
  });
  test('removeAfter', () => {
    const a = ["a", "b", "c", "d"];
    removeAfter(a, (v) => v == "b");
    expect(a).toStrictEqual(["a", "b"])
  });
});

