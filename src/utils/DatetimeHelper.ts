export const getHMfromDate = (date: Date | null) => {
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getYMDfromDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const _date = date.getDate();
  return `${year}-${month}-${_date}`;
};

export const getMDWfromDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const _date = date.getDate();
  const day = date.toLocaleDateString("zh-CN", { weekday: "short" });
  return `${month}月${_date}号 ${day}`;
};

export const getCurrentTime = () => {
  const rawTime = new Date();
  const step = 5;
  const minutes = rawTime.getMinutes();
  const alignedMinutes = Math.round(minutes / step) * step;
  rawTime.setMinutes(alignedMinutes);
  return rawTime;
};

export const getWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 当前星期几（0-6，0是周日）
  const diffToMonday = day === 0 ? 6 : day - 1; // 计算与周一的差值

  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday); // 回推到周一

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // 周日 = 周一 + 6天

  return {
    monday: resetTimewithDate(monday),
    sunday: new Date(sunday.setHours(23, 59, 59)),
  };
};

export const getDayRange = (date: Date) => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

  return { startOfDay: new Date(startOfDay), endOfDay: new Date(endOfDay) };
};

export const compareHM = (startTime: Date, endTime: Date) => {
  const startHM = startTime.getHours() * 60 + startTime.getMinutes();
  const endHM = endTime.getHours() * 60 + endTime.getMinutes();

  return endHM > startHM;
};

// 保持 oldDate 的日期，将其时间重置到一天的开始
export const resetTimewithDate = (oldDate: Date) => {
  const year = oldDate.getFullYear();
  const month = oldDate.getMonth();
  const date = oldDate.getDate();

  return new Date(year, month, date);
};

// 保持 time 的时间，将其日期与已经选择的日期同步
export const alignDateWithTime = (date: Date, time: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const day = date.getDate();

  // 保留原时间，精确到分钟
  const hours = time.getHours();
  const minutes = time.getMinutes();

  // 创建新 Date
  return new Date(year, month, day, hours, minutes);
};

export const getSmartTime = (time: Date) => {
  const date = new Date(time);
  const now = new Date();

  const padZero = (n) => (n < 10 ? "0" + n : n);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isYesterday = (d) => {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(d, yesterday);
  };

  const getWeekdayName = (d) => {
    const days = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    return days[d.getDay()];
  };

  const formatTime = (d) =>
    `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;

  const daysDiff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isSameDay(date, now)) {
    return formatTime(date);
  }

  if (isYesterday(date)) {
    return `昨天 ${formatTime(date)}`;
  }

  if (daysDiff < 7) {
    return `${getWeekdayName(date)} ${formatTime(date)}`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${formatTime(date)}`;
  }

  return `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日 ${formatTime(date)}`;
};
