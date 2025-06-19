import { newID } from '../src/id';

describe('ID Generation', () => {
  test('生成的ID应以ID开头', () => {
    expect(newID()).toMatch(/^ID/);
  });

  test('ID长度应为34字符（UUIDv4去横杠+2前缀）', () => {
    expect(newID().length).toBe(34);
  });

  test('不同参数应生成不同ID', () => {
    const id1 = newID();
    const id2 = newID();
    expect(id1).not.toBe(id2);
  });

  test('应生成合法UUID结构（去横杠后）', () => {
    const id = newID().substring(2);
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });
});
