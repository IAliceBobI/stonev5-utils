import { formatDate, getDate, readableDuration } from "../src/time"

describe('时间工具函数测试', () => {
    test('时区偏移测试1', () => {
        const t1 = new Date(1750324565612).toLocaleString();
        const t2 = getDate(null, new Date(1750324565612), null).toLocaleString();
        // t1 和 t2 应该是相同的
        expect(t1).toBe(t2);
    });

    test('时区偏移测试2', () => {
        const date = new Date(1707091200000) // "2024-02-05 08:00:00"
        expect(formatDate(0, date, null)).toEqual("2024-02-05 08:00:00");
        expect(formatDate(0, date, 8)).toEqual("2024-02-05 08:00:00");
        expect(formatDate(0, date, 0)).toEqual("2024-02-05 00:00:00");
        expect(formatDate(0, date, -1)).toEqual("2024-02-04 23:00:00");
    });

});
