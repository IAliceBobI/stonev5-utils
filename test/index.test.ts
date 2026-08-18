import { newID, getMd5, pinyinLongShort, copy2clipboard } from '../src/index';

describe('index 主入口', () => {
    test('newID 应从主入口可用', () => {
        expect(newID()).toMatch(/^ID[0-9a-f]{32}$/);
    });

    test('getMd5 应从主入口可用', () => {
        expect(getMd5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
    });

    test('pinyinLongShort 应从主入口可用', () => {
        const r = pinyinLongShort('中心');
        expect(r.long).toBe('zhongxin');
        expect(r.short).toBe('zx');
    });

    test('copy2clipboard 应从主入口可用', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined);
        Object.assign(globalThis, { navigator: { clipboard: { writeText } } });
        await copy2clipboard('hello');
        expect(writeText).toHaveBeenCalledWith('hello');
    });
});
