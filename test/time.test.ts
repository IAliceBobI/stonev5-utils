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

    test('readableDuration - 1 second', () => {
        expect(readableDuration(1000)).toBe("1m");
    });

    test('readableDuration - 1 minute', () => {
        expect(readableDuration(60 * 1000)).toBe("1h");
    });

    test('readableDuration - 1 hour', () => {
        expect(readableDuration(3600 * 1000)).toBe("1d");
    });

    test('readableDuration - 1 day', () => {
        expect(readableDuration(24 * 3600 * 1000)).toBe("1M");
    });

    test('readableDuration - 1 year', () => {
        expect(readableDuration(365 * 24 * 3600 * 1000)).toBe("1y");
    });

    test('readableDuration - 1 year and 1 day', () => {
        expect(readableDuration(366 * 24 * 3600 * 1000)).toBe("1y 1M");
    });

    test('readableDuration - 1 hour, 1 minute, 1 second', () => {
        expect(readableDuration(3600 * 1000 + 60 * 1000 + 1000)).toBe("1d 1h 1m");
    });

    test('readableDuration - 0 milliseconds', () => {
        expect(readableDuration(0)).toBe("0s");
    });

    test('readableDuration - negative milliseconds', () => {
        expect(readableDuration(-3600 * 1000)).toBe("1d");
    });

    test('readableDuration - complex duration', () => {
        const ms = 2 * 365 * 24 * 3600 * 1000 + // 2 years
            120 * 24 * 3600 * 1000 +     // 120 days
            5 * 3600 * 1000 +            // 5 hours
            45 * 60 * 1000 +             // 45 minutes
            30 * 1000;                   // 30 seconds
        expect(readableDuration(ms)).toBe("2y 120M 5d 45h 30m");
    });
});
