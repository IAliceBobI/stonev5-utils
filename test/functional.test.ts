import '../src/functional'; // 假设你的数组扩展方法在这个文件中

// 测试asyncMap
describe('asyncMap', () => {
  test('基础用法: 处理同步回调', async () => {
    const a = [1, 2, 3, 4];
    const result = await a.asyncMap(num => num * 2);
    expect(result).toStrictEqual([2, 4, 6, 8]);
  });

  test('处理异步回调', async () => {
    const a = [1, 2, 3, 4];
    const result = await a.asyncMap(async num => {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 10));
      return num * 2;
    });
    expect(result).toStrictEqual([2, 4, 6, 8]);
  });

  test('使用postMap处理结果', async () => {
    const a = [1, 2, 3, 4];
    const result = await a.asyncMap(
      num => num * 2,
      (value) => value + 1
    );
    expect(result).toStrictEqual([3, 5, 7, 9]);
  });

  test('空数组: 返回空数组', async () => {
    const a: number[] = [];
    const result = await a.asyncMap(num => num * 2);
    expect(result).toStrictEqual([]);
  });

  test('处理Promise元素', async () => {
    const a = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const result = await (a as unknown as number[]).asyncMap(num => num * 2);
    expect(result).toStrictEqual([2, 4, 6]);
  });

  test('保持索引正确', async () => {
    const a = [10, 20, 30];
    const result = await a.asyncMap((num, index) => num + index);
    expect(result).toStrictEqual([10, 21, 32]);
  });
});

// 测试uniq
describe('uniq', () => {
  test('基础用法: 无回调函数', () => {
    const a = [1, 2, 2, 3, 3, 3, 4];
    expect(a.uniq()).toStrictEqual([1, 2, 3, 4]);
  });

  test('使用回调函数', () => {
    const a = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alicia' },
      { id: 3, name: 'Charlie' },
      { id: 2, name: 'Bobby' }
    ];
    // 根据id去重
    expect(a.uniq(item => item.id)).toStrictEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]);
  });

  test('严格相等比较', () => {
    const a = [1, '1', 2, '2', 1];
    // 1 === '1' 为 false，所以都会保留
    expect(a.uniq()).toStrictEqual([1, '1', 2, '2']);
  });

  test('处理对象引用', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 1 };
    const a = [obj1, obj2, obj1];
    // 不同引用即使内容相同也会被视为不同
    expect(a.uniq()).toStrictEqual([obj1, obj2]);
  });

  test('空数组: 返回空数组', () => {
    const a: number[] = [];
    expect(a.uniq()).toStrictEqual([]);
  });

  test('所有元素都相同: 返回单个元素', () => {
    const a = ['a', 'a', 'a', 'a'];
    expect(a.uniq()).toStrictEqual(['a']);
  });

  test('回调函数返回不同类型', () => {
    const a = [
      { value: '10' },
      { value: 10 },
      { value: '10' },
      { value: 20 }
    ];
    // 回调返回数字类型，10 === 10 为 true
    expect(a.uniq(item => parseInt(item.value as any))).toStrictEqual([
      { value: '10' },
      { value: 20 }
    ]);
  });
});
