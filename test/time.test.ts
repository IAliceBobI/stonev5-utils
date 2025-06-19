import { now, formatDate, formatDateYYYYMMDDHHmmss, getDateFromYYYYMMDDHHmmss, convertMinutesToTimeFormat } from "../src/time"

describe('时间工具函数测试', () => {
    test('now()基础功能', () => {
        const date = now();
        expect(date).toBeInstanceOf(Date);
        expect(date.getTime()).toBeCloseTo(Date.now(), -2);
    });

    test('时区偏移测试', () => {
        const local = now();
        const nyTime = now(0, null, -5);
        expect(Math.abs(nyTime.getTime() - local.getTime())).toBeCloseTo(5 * 60 * 60 * 1000);
    });

    test('formatDate格式验证', () => {
        const testDate = new Date('2023-03-15T09:30:45');
        expect(formatDate(0, testDate)).toBe('2023-03-15 09:30:45');
    });

    test('YYYYMMDDHHmmss格式', () => {
        const testDate = new Date('2024-12-31T23:59:59');
        expect(formatDateYYYYMMDDHHmmss(0, testDate)).toBe('20241231235959');
    });

    test('getDateFromYYYYMMDDHHmmss解析', () => {
        const date = getDateFromYYYYMMDDHHmmss('20211231000000');
        expect(date.getFullYear()).toBe(2021);
        expect(date.getMonth()).toBe(11); // 十二月
    });

    test('分钟转时间格式', () => {
        expect(convertMinutesToTimeFormat(90)).toBe('1h30m');
        expect(convertMinutesToTimeFormat(45)).toBe('45m');
    });
});