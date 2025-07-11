/**
 * 获取当前时间
 * @param deltaSecs 时间偏移量，单位秒
 * @param date 基准日期
 * @param offsetHours null为本地时间。 时区偏移量，单位小时, 北京时间为 +8
 * @returns 
 */
export function getDate(deltaSecs?: number | null, date?: Date | null, offsetHours?: number | null): Date {
    if (date == null) {
        date = new Date();
    } else {
        date = new Date(date); // 确保不修改原始日期对象
    }
    if (deltaSecs == null) deltaSecs = 0
    if (offsetHours == null) {
        if (deltaSecs == 0) {
            // 如果没有偏移量，直接返回当前时间
            return date;
        } else {
            // 如果没有时区偏移量，直接返回当前时间加上偏移量
            return new Date(date.getTime() + deltaSecs * 1000);
        }
    } else {
        offsetHours = -offsetHours; // 内部计算是 utc-offset，所以这里需要取反
        const ms = date.getTime(); // 获取当前时间的毫秒数
        let tms = ms + date.getTimezoneOffset() * 60 * 1000; // 将本地时间转换为 UTC ms
        tms -= offsetHours * 60 * 60 * 1000; // 将 UTC ms 时间转换为目标时区时间的 ms
        if (tms != ms) {
            date = new Date(tms + deltaSecs * 1000); // 将目标时区时间的 ms 加上偏移量
        } else {
            if (deltaSecs != 0) {
                date = new Date(ms + deltaSecs * 1000); // 如果没有时区偏移量，直接返回当前时间加上偏移量
            }
        }
        return date;
    }
}

/**
 * 获取当前日期时间组件
 * @param deltaSecs 时间偏移量，单位秒
 * @param date 基准日期
 * @param offsetHours 时区偏移量，单位小时
 * @returns 
 */
export function getCurrentDateTimeComponents(deltaSecs?: number | null, date?: Date | null, offsetHours?: number | null) {
    date = getDate(deltaSecs, date, offsetHours);
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
export function formatDate(deltaSecs?: number | null, date?: Date | null, offsetHours?: number | null) {
    const { year, monthPad, dayPad, hoursPad, minutesPad, secondsPad } = getCurrentDateTimeComponents(deltaSecs, date, offsetHours);
    return year + "-" + monthPad + "-" + dayPad + " " + hoursPad + ":" + minutesPad + ":" + secondsPad;
}

/**
 * 格式化日期为字符串 20210101000000
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function formatDateYYYYMMDDHHmmss(deltaSecs?: number | null, date?: Date | null, offsetHours?: number | null) {
    const { year, monthPad, dayPad, hoursPad, minutesPad, secondsPad } = getCurrentDateTimeComponents(deltaSecs, date, offsetHours);
    return year + monthPad + dayPad + hoursPad + minutesPad + secondsPad;
}

/**
 * 获取日期中的天
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function getDayStr(deltaSecs?: number | null, date?: Date | null, offsetHours?: number | null) {
    const { year, monthPad, dayPad } = getCurrentDateTimeComponents(deltaSecs, date, offsetHours);
    return `${year}-${monthPad}-${dayPad};`
}

/**
 * 获取日期中的时间
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function getTimeStr(deltaSecs?: number | null, date?: Date | null, offsetHours?: number | null) {
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

export function readableDuration(ms: number): string {
    if (ms < 0) {
        return readableDuration(-ms);
    }

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    const remainingDays = days % 365;
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    const parts: string[] = [];

    if (years > 0) {
        parts.push(`${years}y`);
    }
    if (remainingDays > 0) {
        parts.push(`${remainingDays}M`);
    }
    if (remainingHours > 0) {
        parts.push(`${remainingHours}d`);
    }
    if (remainingMinutes > 0) {
        parts.push(`${remainingMinutes}h`);
    }
    if (remainingSeconds > 0) {
        parts.push(`${remainingSeconds}m`);
    }
    if (parts.length === 0) {
        return '0s';
    }

    return parts.join(' ');
}