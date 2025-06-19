/**
 * 获取当前时间
 * @param deltaSecs 时间偏移量，单位秒
 * @param date 基准日期
 * @param offsetHours 时区偏移量，单位小时
 * @returns 
 */
export function now(deltaSecs = 0, date?: Date | null | undefined, offsetHours = 0) {
    if (date == null) date = new Date();
    deltaSecs += offsetHours * 60 * 60
    if (deltaSecs != 0) {
        date = new Date(date.getTime() + deltaSecs * 1000)
    }
    return date;
}

/**
 * 获取当前日期时间组件
 * @param deltaSecs 时间偏移量，单位秒
 * @param date 基准日期
 * @param offsetHours 时区偏移量，单位小时
 * @returns 
 */
export function getCurrentDateTimeComponents(deltaSecs = 0, date?: Date | null | undefined, offsetHours = 0) {
    date = now(deltaSecs, date, offsetHours);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1); // Month value needs +1 as it starts from 0.
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return {
        year,
        month, monthPad: month.toString().padStart(2, "0"),
        day, dayPad: day.toString().padStart(2, "0"),
        hours, hoursPad: hours.toString().padStart(2, "0"),
        minutes, minutesPad: minutes.toString().padStart(2, "0"),
        seconds, secondsPad: seconds.toString().padStart(2, "0"),
    };
}

/**
 * 格式化日期为字符串 2021-01-01 00:00:00
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function formatDate(deltaSecs = 0, date?: Date | null | undefined, offsetHours = 0) {
    const { year, monthPad, dayPad, hoursPad, minutesPad, secondsPad } = getCurrentDateTimeComponents(deltaSecs, date, offsetHours);
    return year + "-" + monthPad + "-" + dayPad + " " + hoursPad + ":" + minutesPad + ":" + secondsPad;
}

/**
 * 格式化日期为字符串 20210101000000
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function formatDateYYYYMMDDHHmmss(deltaSecs = 0, date?: Date | null | undefined, offsetHours = 0) {
    const { year, monthPad, dayPad, hoursPad, minutesPad, secondsPad } = getCurrentDateTimeComponents(deltaSecs, date, offsetHours);
    return year + monthPad + dayPad + hoursPad + minutesPad + secondsPad;
}

/**
 * 获取日期中的天
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function getDayStr(deltaSecs = 0, date?: Date | null | undefined, offsetHours = 0) {
    const { year, monthPad, dayPad } = getCurrentDateTimeComponents(deltaSecs, date, offsetHours);
    return `${year}-${monthPad}-${dayPad};`
}

/**
 * 获取日期中的时间
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function getTimeStr(deltaSecs = 0, date?: Date | null | undefined, offsetHours = 0) {
    const { hoursPad, minutesPad, secondsPad } = getCurrentDateTimeComponents(deltaSecs, date, offsetHours);
    return `${hoursPad}:${minutesPad}:${secondsPad}`;
}

/**
 * 从字符串 中获取日期
 * @param dateStr 日期字符串: YYYYMMDDHHmmss
 * @returns 日期
 */
export function getDateFromYYYYMMDDHHmmss(dateStr: string) {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hours = dateStr.slice(8, 10);
    const minutes = dateStr.slice(10, 12);
    const seconds = dateStr.slice(12);
    return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
}

export function convertMinutesToTimeFormat(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours == 0) {
        return `${remainingMinutes}m`;
    }
    return `${hours}h${remainingMinutes}m`;
}

export function setTimeouts(cb: Func, start: number, end: number, step: number) {
    for (; start <= end; start += step) {
        setTimeout(cb, start);
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
