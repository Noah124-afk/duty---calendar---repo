/**
 * 当前显示的日期
 * @type {Date}
 */
let currentDate = new Date(2025, 1, 15); // 设置开始日期为2025年2月15日

/**
 * 值班开始日期
 * @type {Date}
 */
const startDutyDate = new Date(2025, 1, 15);

/**
 * 节假日数据
 * @type {Object}
 */
const holidays = {
    // 2025年法定节假日
    '2025-01-01': { name: '元旦', isHoliday: true },
    '2025-01-28': { name: '除夕', isHoliday: true },
    '2025-01-29': { name: '春节', isHoliday: true },
    '2025-01-30': { isHoliday: true },
    '2025-01-31': { isHoliday: true },
    '2025-02-01': { isHoliday: true },
    '2025-02-02': { isHoliday: true },
    '2025-02-03': { isHoliday: true },
    '2025-04-04': { name: '清明节', isHoliday: true },
    '2025-05-01': { name: '劳动节', isHoliday: true },
    '2025-05-02': { isHoliday: true },
    '2025-05-03': { isHoliday: true },
    '2025-05-04': { isHoliday: true },
    '2025-05-05': { isHoliday: true },
    '2025-06-02': { name: '端午节', isHoliday: true },
    '2025-09-19': { name: '中秋节', isHoliday: true },
    '2025-10-01': { name: '国庆节', isHoliday: true },
    '2025-10-02': { isHoliday: true },
    '2025-10-03': { isHoliday: true },
    '2025-10-04': { isHoliday: true },
    '2025-10-05': { isHoliday: true },
    '2025-10-06': { isHoliday: true },
    '2025-10-07': { isHoliday: true }
};

/**
 * 检查日期是否为节假日
 * @param {Date} date - 要检查的日期
 * @returns {Object} 节假日信息
 */
function getHoliday(date) {
    // 修正日期格式化方法，确保月份和日期都是两位数
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${date.getFullYear()}-${month}-${day}`;
    return holidays[dateStr] || null;
}

/**
 * 获取农历日期
 * @param {Date} date - 日期
 * @returns {string} 农历日期
 */
function getLunarDate(date) {
    // 这里可以添加农历转换逻辑
    // 暂时返回示例数据
    const lunarDates = {
        '2025-02-01': '初四',
        '2025-02-02': '初五',
        '2025-02-03': '初六',
        '2025-02-04': '初七',
        // ... 添加更多日期
    };
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${date.getFullYear()}-${month}-${day}`;
    return lunarDates[dateStr] || '';
}

/**
 * 生成日历数据
 * @param {Date} date - 当前日期
 * @returns {Array} 日历数据数组
 */
function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDate();
    
    const days = [];
    
    // 上个月的日期
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(year, month, 1 - i);
        days.push({
            date: prevDate,
            isCurrentMonth: false,
            isDutyDay: isDutyDay(prevDate)
        });
    }
    
    // 当前月的日期
    for (let i = 1; i <= lastDayIndex; i++) {
        const currentDate = new Date(year, month, i);
        days.push({
            date: currentDate,
            isCurrentMonth: true,
            isDutyDay: isDutyDay(currentDate)
        });
    }
    
    // 下个月的日期
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({
            date: nextDate,
            isCurrentMonth: false,
            isDutyDay: isDutyDay(nextDate)
        });
    }
    
    return days;
}

/**
 * 判断是否为值班日
 * @param {Date} date - 要检查的日期
 * @returns {boolean} 是否为值班日
 */
function isDutyDay(date) {
    const timeDiff = date.getTime() - startDutyDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return dayDiff >= 0 && dayDiff % 5 === 0;
}

/**
 * 判断是否为当前日期
 * @param {Date} date - 要检查的日期
 * @returns {boolean} 是否为当前日期
 */
function isCurrentDay(date) {
    const today = new Date();
    return date.getDate() === 19 && 
           date.getMonth() === 1 && // 2月
           date.getFullYear() === 2025;
}

/**
 * 更新日历显示
 */
function updateCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarDays = document.getElementById('calendar-days');
    
    monthDisplay.textContent = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`;
    
    const days = generateCalendar(currentDate);
    calendarDays.innerHTML = '';
    
    days.forEach(day => {
        const dayElement = document.createElement('div');
        const holiday = getHoliday(day.date);
        const isToday = isCurrentDay(day.date);
        
        // 添加当前日期的类名
        dayElement.className = `calendar-day${day.isCurrentMonth ? '' : ' other-month'}${day.isDutyDay ? ' duty-day' : ''}${holiday ? ' holiday' : ''}${isToday ? ' current-day' : ''}`;
        
        const dateNumber = document.createElement('div');
        dateNumber.className = 'date-number';
        dateNumber.textContent = day.date.getDate();
        dayElement.appendChild(dateNumber);
        
        const lunarDate = document.createElement('div');
        lunarDate.className = 'lunar-date';
        lunarDate.textContent = getLunarDate(day.date);
        dayElement.appendChild(lunarDate);
        
        if (holiday) {
            lunarDate.textContent = holiday.name || '假';
        }
        
        calendarDays.appendChild(dayElement);
    });
}

// 修改事件监听器
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    updateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    updateCalendar();
});

// 初始化日历
updateCalendar(); 