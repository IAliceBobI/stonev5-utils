import '../src/functional'; // 假设你的数组扩展方法在这个文件中

describe('ArrayIterator.prototype.toArray', () => {
  // 基础功能测试
  test('should convert iterator to array with all elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const iterator = arr.values();

    const result = iterator.toArray();

    // 使用断言而不是console.log进行断言
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  // 测试用例
  test('should handle mapped iterators correctly', () => {
    const arr = [1, 2, 3, 4, 5];
    const mappedIterator = arr.map(x => x * 2).values();

    const result = mappedIterator.toArray();

    expect(result).toEqual([2, 4, 6, 8, 10]);
  });

  // 空数组测试
  test('should return empty array for empty iterator', () => {
    const arr: number[] = [];
    const iterator = arr.values();

    const result = iterator.toArray();

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  // 迭代器耗尽测试
  test('should exhaust the iterator after conversion', () => {
    const arr = [1, 2, 3];
    const iterator = arr.values();

    // 第一次转换
    const firstResult = iterator.toArray();
    expect(firstResult).toEqual([1, 2, 3]);

    // 迭代器已耗尽，再次调用应返回空数组
    const secondResult = iterator.toArray();
    expect(secondResult).toEqual([]);
  });

  // 字符串数组测试
  test('should work with string arrays', () => {
    const arr = ['a', 'b', 'c'];
    const iterator = arr.values();

    const result = iterator.toArray();

    expect(result).toEqual(['a', 'b', 'c']);
  });

  // 对象数组测试
  test('should work with object arrays', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const iterator = arr.values();

    const result = iterator.toArray();

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    // 验证引用相等性
    expect(result[0]).toBe(arr[0]);
  });
});

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
    const result1 = await a.asyncMap(num => num * 2).then(a => a.map(v => v + 1))
    const result = await a.asyncMap(
      num => num * 2,
      (value) => value + 1
    );
    expect(result).toStrictEqual([3, 5, 7, 9]);
    expect(result1).toStrictEqual([3, 5, 7, 9]);
  });

  test('使用postMap处理结果2', async () => {
    const a = [1, 2, 3, 4];
    const result = await a.asyncMap(
      num => {
        return { num, v: num * 2 }
      },
      ({ num, v }) => {
        return { num, v: v + 1 }
      }
    );
    expect(result).toStrictEqual([
      { num: 1, v: 3 },
      { num: 2, v: 5 },
      { num: 3, v: 7 },
      { num: 4, v: 9 },
    ]);
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

describe('thenMap方法', () => {
  test('应该正确映射数组中的每个元素', async () => {
    const result = await Promise.resolve([1, 2, 3]).thenMap(num => num * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  test('应该正确处理字符串数组', async () => {
    const result = await Promise.resolve(['a', 'b', 'c']).thenMap(str => str.toUpperCase());
    expect(result).toEqual(['A', 'B', 'C']);
  });

  test('应该正确处理对象数组', async () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 }
    ];

    const result = await Promise.resolve(users).thenMap(user => user.name);
    expect(result).toEqual(['Alice', 'Bob']);
  });

  test('当Promise解析值不是数组时应该抛出错误', async () => {
    await expect(
      Promise.resolve('not an array').thenMap(value => value)
    ).rejects.toThrow('Promise resolved value is not an array');
  });

  test('应该正确处理空数组', async () => {
    const result = await Promise.resolve([]).thenMap(item => item);
    expect(result).toEqual([]);
  });

  test('映射函数应该接收正确的索引和数组参数', async () => {
    const mockCallback = jest.fn((value, index, array) => value);
    const testArray = [10, 20, 30];

    await Promise.resolve(testArray).thenMap(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenNthCalledWith(1, 10, 0, testArray);
    expect(mockCallback).toHaveBeenNthCalledWith(2, 20, 1, testArray);
    expect(mockCallback).toHaveBeenNthCalledWith(3, 30, 2, testArray);
  });

  test('应该处理映射函数返回的Promise', async () => {
    const result = await Promise.resolve([1, 2, 3])
      .thenMap(num => Promise.resolve(num * 3));

    expect(result).toEqual([3, 6, 9]);
  });

  test('当原始Promise被拒绝时应该传播错误', async () => {
    const errorMessage = 'Something went wrong';
    await expect(
      Promise.reject(new Error(errorMessage)).thenMap(value => value)
    ).rejects.toThrow(errorMessage);
  });
});


describe('Array.chunks', () => {
  // 测试正常分割情况
  test('should split array into chunks of specified size', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(arr.chunks(3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    expect(arr.chunks(2)).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9]]);
  });

  // 测试空数组
  test('should return empty array for empty input', () => {
    const arr: number[] = [];
    expect(arr.chunks(5)).toEqual([]);
    expect(arr.chunks(1)).toEqual([]);
  });

  // 测试数组长度小于 chunk 大小
  test('should return single chunk when array length is less than size', () => {
    const arr = ['a', 'b', 'c'];
    expect(arr.chunks(5)).toEqual([['a', 'b', 'c']]);
  });

  // 测试 chunk 大小等于数组长度
  test('should return single chunk when size equals array length', () => {
    const arr = [10, 20, 30];
    expect(arr.chunks(3)).toEqual([[10, 20, 30]]);
  });

  // 测试非整数数组
  test('should work with non-number arrays', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    expect(arr.chunks(2)).toEqual([
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }, { id: 4 }]
    ]);
  });

 
});

describe('Array.shuffle (in-place)', () => {
  // 测试基本功能：元素相同但顺序可能不同，且原数组被修改
  test('should shuffle elements in place and return the same array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr]; // 保存原始状态
    const result = arr.shuffle();

    // 返回的数组应该和原数组是同一个引用
    expect(result).toBe(arr);

    // 长度保持不变
    expect(arr.length).toBe(original.length);

    // 元素集合应该相同（排序后比较）
    expect(arr.slice().sort()).toEqual(original.sort());

    // 原数组应该被修改（大概率与原始状态不同）
    expect(arr).not.toEqual(original);
  });

  // 测试空数组
  test('should handle empty array without changes', () => {
    const arr: number[] = [];
    const result = arr.shuffle();

    // 引用相同
    expect(result).toBe(arr);
    // 仍然为空
    expect(arr).toEqual([]);
  });

  // 测试单元素数组（无法打乱，原数组保持不变）
  test('should not change array with single element', () => {
    const arr = ['only element'];
    const original = [...arr];
    const result = arr.shuffle();

    expect(result).toBe(arr);
    expect(arr).toEqual(original); // 单元素无法打乱，保持原样
  });

  // 测试多次调用随机性（概率性测试）
  test('should produce different orders on multiple calls', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    // 第一次洗牌
    const firstShuffle = [...arr.shuffle()];
    // 第二次洗牌
    const secondShuffle = [...arr.shuffle()];

    // 两次洗牌结果大概率不同
    expect(firstShuffle).not.toEqual(secondShuffle);
  });

  // 测试对象数组（验证引用不变，仅顺序改变）
  test('should preserve object references while shuffling', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const arr = [obj1, obj2, obj3];

    const result = arr.shuffle();

    // 引用相同
    expect(result).toBe(arr);
    // 元素引用不变
    expect(arr).toContain(obj1);
    expect(arr).toContain(obj2);
    expect(arr).toContain(obj3);
    // 元素数量不变
    expect(arr.length).toBe(3);
  });
});

describe('Array.prototype.toMap', () => {
  const testData = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  test('回调函数应该接收正确的参数', () => {
    // 为 mock 函数指定明确的返回类型，确保返回 [K, V] 元组
    const callback = jest.fn<[number, string], [typeof testData[0], number]>(
      (item, index) => [item.id, item.name]
    );

    testData.toMap((item, index) => callback(item, index as number));

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, testData[0], 0);
    expect(callback).toHaveBeenNthCalledWith(2, testData[1], 1);
    expect(callback).toHaveBeenNthCalledWith(3, testData[2], 2);
  });

  test('空数组应该返回空 Map', () => {
    const result = [].toMap(() => [1, 'test']);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });
});

describe('Array.prototype.toSet', () => {
  const testData = [1, 2, 3, 4, 5];

  test('应该将数组正确转换为 Set', () => {
    const result = testData.toSet(item => item * 2);

    expect(result).toBeInstanceOf(Set);
    expect(result.size).toBe(5);
    expect(result.has(2)).toBe(true);
    expect(result.has(4)).toBe(true);
    expect(result.has(10)).toBe(true);
  });

  test('应该自动去重', () => {
    const duplicateData = [1, 2, 2, 3, 3, 3];
    const result = duplicateData.toSet(item => item);

    expect(result.size).toBe(3);
    expect(result.has(1)).toBe(true);
    expect(result.has(2)).toBe(true);
    expect(result.has(3)).toBe(true);
  });

  test('应该忽略值为 null 或 undefined 的项', () => {
    const result = testData.toSet((item, index) => {
      // 让偶数索引的值为 null
      return index !== undefined && index % 2 === 0 ? null as unknown as number : item;
    });

    expect(result.size).toBe(2);
    expect(result.has(2)).toBe(true);
    expect(result.has(4)).toBe(true);
  });

  test('回调函数应该接收正确的参数', () => {
    const callback = jest.fn(item => item);
    testData.toSet(callback);

    expect(callback).toHaveBeenCalledTimes(5);
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0);
    expect(callback).toHaveBeenNthCalledWith(2, 2, 1);
    expect(callback).toHaveBeenNthCalledWith(3, 3, 2);
  });

  test('空数组应该返回空 Set', () => {
    const result = [].toSet(() => 'test');
    expect(result).toBeInstanceOf(Set);
    expect(result.size).toBe(0);
  });
});

describe('Array.prototype.executeSequentially', () => {
  // 清除所有定时器模拟
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // 改用更可靠的定时器处理方式
  it('应该按顺序执行所有任务', async () => {
    // 使用现代的fake timers实现
    jest.useFakeTimers({ legacyFakeTimers: false });

    const executionOrder: number[] = [];

    // 缩短延迟时间，测试只关心顺序不关心实际时长
    const tasks = [
      () => new Promise(resolve => {
        setTimeout(() => {
          executionOrder.push(1);
          resolve(1);
        }, 10);
      }),
      () => new Promise(resolve => {
        setTimeout(() => {
          executionOrder.push(2);
          resolve(2);
        }, 5);
      }),
      () => new Promise(resolve => {
        setTimeout(() => {
          executionOrder.push(3);
          resolve(3);
        }, 8);
      })
    ];

    const promise = tasks.executeSequentially();

    // 分步执行定时器，确保异步流程正确推进
    // 先执行第一个任务的定时器
    jest.advanceTimersByTime(10);
    await Promise.resolve(); // 允许微任务队列处理

    // 再执行第二个任务的定时器
    jest.advanceTimersByTime(5);
    await Promise.resolve();

    // 最后执行第三个任务的定时器
    jest.advanceTimersByTime(8);
    await Promise.resolve();

    const results = await promise;

    // 验证执行顺序
    expect(executionOrder).toEqual([1, 2, 3]);
    // 验证结果
    expect(results).toEqual([1, 2, 3]);
  }, 15000); // 进一步增加超时时间

  it('应该正确处理任务中的错误，并且继续执行后续任务', async () => {
    jest.useFakeTimers({ legacyFakeTimers: false });
    console.error = jest.fn(); // 模拟console.error

    const executionOrder: number[] = [];

    const tasks = [
      () => new Promise(resolve => {
        setTimeout(() => {
          executionOrder.push(1);
          resolve(1);
        }, 10);
      }),
      () => new Promise((_, reject) => {
        setTimeout(() => {
          executionOrder.push(2);
          reject(new Error('任务2失败'));
        }, 20);
      }),
      () => new Promise(resolve => {
        setTimeout(() => {
          executionOrder.push(3);
          resolve(3);
        }, 15);
      })
    ];

    const promise = tasks.executeSequentially();

    // 分步执行定时器
    jest.advanceTimersByTime(10);
    await Promise.resolve();

    jest.advanceTimersByTime(20);
    await Promise.resolve();

    jest.advanceTimersByTime(15);
    await Promise.resolve();

    const results = await promise;

    // 验证错误被捕获
    expect(console.error).toHaveBeenCalledWith('任务执行出错:', expect.any(Error));
    // 验证所有任务都被执行
    expect(executionOrder).toEqual([1, 2, 3]);
    // 验证结果中不包含错误任务的结果
    expect(results).toEqual([1, 3]);
  }, 15000);

  it('当数组包含非函数元素时应该抛出错误', async () => {
    // @ts-ignore 故意传入非函数元素
    const tasks = [() => Promise.resolve(1), 'not a function', () => Promise.resolve(3)];

    await expect(tasks.executeSequentially()).rejects.toThrow('数组元素必须是返回Promise的函数');
  });

  it('空数组应该返回空结果数组', async () => {
    const tasks: Array<() => Promise<unknown>> = [];
    const results = await tasks.executeSequentially();
    expect(results).toEqual([]);
  });

  it('应该正确处理立即完成的Promise', async () => {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3)
    ];

    const results = await tasks.executeSequentially();
    expect(results).toEqual([1, 2, 3]);
  });
});






describe('Array.prototype.groupedParallelExecute', () => {
  // 使用现代定时器实现，避免兼容性问题
  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: false });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // 基本功能测试
  it('should execute tasks in groups with correct results', async () => {
    const tasks = [1, 2, 3, 4, 5, 6];
    const taskHandler = jest.fn((num: number) =>
      Promise.resolve(num * 2)
    );

    const results = await tasks.groupedParallelExecute(2, taskHandler);

    expect(results).toEqual([2, 4, 6, 8, 10, 12]);
    expect(taskHandler).toHaveBeenCalledTimes(6);
  });

  // 并发控制测试 - 使用更可靠的异步处理
  it('should control concurrency with group count', async () => {
    const tasks = [1, 2, 3, 4];
    const executionOrder: number[] = [];
    const delay = 10;

    const taskHandler = (num: number) => {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          executionOrder.push(num);
          resolve(num);
        }, delay);
      });
    };

    // 启动执行
    const promise = tasks.groupedParallelExecute(2, taskHandler);
    
    // 使用jest.runAllTimersAsync确保所有定时器都被处理
    await jest.runAllTimersAsync();
    
    // 等待结果
    const results = await promise;

    expect(results).toEqual(tasks);
    expect(executionOrder).toEqual(expect.arrayContaining(tasks));
    // 验证分组执行顺序：1和2先执行，然后是3和4
    expect(executionOrder.indexOf(1)).toBeLessThan(executionOrder.indexOf(3));
    expect(executionOrder.indexOf(2)).toBeLessThan(executionOrder.indexOf(4));
  }, 10000); // 超时时间设为10秒

  // 边界情况：分组数量为1（全串行）
  it('should execute all tasks sequentially when group count is 1', async () => {
    const tasks = [1, 2, 3];
    const executionOrder: number[] = [];
    const delay = 10;

    const taskHandler = (num: number) => {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          executionOrder.push(num);
          resolve(num);
        }, delay);
      });
    };

    // 启动执行
    const promise = tasks.groupedParallelExecute(1, taskHandler);
    
    // 处理所有定时器
    await jest.runAllTimersAsync();
    
    // 等待结果
    await promise;

    // 串行执行应该严格按照顺序
    expect(executionOrder).toEqual([1, 2, 3]);
  }, 10000); // 超时时间设为10秒

  // 其他测试保持不变...
  it('should handle group count larger than task count', async () => {
    const tasks = [1, 2, 3];
    const taskHandler = jest.fn((num: number) =>
      Promise.resolve(num)
    );

    const results = await tasks.groupedParallelExecute(5, taskHandler);

    expect(results).toEqual([1, 2, 3]);
    expect(taskHandler).toHaveBeenCalledTimes(3);
  });

  it('should handle empty array gracefully', async () => {
    const tasks: number[] = [];
    const taskHandler = jest.fn();

    const results = await tasks.groupedParallelExecute(2, taskHandler);

    expect(results).toEqual([]);
    expect(taskHandler).not.toHaveBeenCalled();
  });

  it('should propagate errors from task handler', async () => {
    const tasks = [1, 2, 3];
    const errorMessage = 'Task failed';

    const taskHandler = (num: number) => {
      if (num === 2) {
        return Promise.reject(new Error(errorMessage));
      }
      return Promise.resolve(num);
    };

    await expect(
      tasks.groupedParallelExecute(2, taskHandler)
    ).rejects.toThrow(errorMessage);
  });
});
