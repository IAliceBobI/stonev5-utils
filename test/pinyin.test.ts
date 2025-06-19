import { pinyinLongShort, pinyinAll } from '../src/pinyin';

describe('pinyinLongShort', () => {
    it('should return correct long and short pinyin for 汉字', async () => {
        const result = pinyinLongShort('汉字');
        expect(result.long).toBe('hanzi');
        expect(result.short).toBe('hz');
    });

    it('should return empty for empty input', async () => {
        const result = pinyinLongShort('');
        expect(result.long).toBe('');
        expect(result.short).toBe('');
    });
});

describe('pinyinAll', () => {
    it('should return all pinyin variations for 重阳', async () => {
        const result = pinyinAll('重阳');
        expect(result.allPY).toContain('重chóng/zhòng     阳yáng');
        expect(result.onePY).toContain('重chóng     阳yáng');
        expect(result.pyOnly).toContain('chóng     yáng');
        expect(result.originOnly).toContain('重     阳');
    });

    it('should return empty object for empty input', async () => {
        const result = pinyinAll('');
        expect(result).toEqual({});
    });
});
