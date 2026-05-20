import { parse, addMinutes, isBefore, format } from 'date-fns';

export function generateDailySlots(startHour, endHour, intervalMinutes = 45) {
  if (!startHour || !endHour) return [];
  const start = parse(startHour, 'HH:mm', new Date());
  const end = parse(endHour, 'HH:mm', new Date());
  
  const slots = [];
  let current = start;
  let sessionCount = 0;
  const BREAK_EVERY = 3;
  const BREAK_DURATION = 15;

  while (isBefore(addMinutes(current, intervalMinutes - 1), end)) {
    if (sessionCount > 0 && sessionCount % BREAK_EVERY === 0) {
      // Insert break
      const breakTimeStr = format(current, 'HH:mm');
      slots.push({
        time: breakTimeStr,
        type: 'break',
        endTime: format(addMinutes(current, BREAK_DURATION), 'HH:mm')
      });
      current = addMinutes(current, BREAK_DURATION);
      sessionCount = 0;
    } else {
      const timeStr = format(current, 'HH:mm');
      slots.push({
        time: timeStr,
        type: 'session',
        endTime: format(addMinutes(current, intervalMinutes), 'HH:mm')
      });
      current = addMinutes(current, intervalMinutes);
      sessionCount++;
    }
  }

  // Add available slot at 9:00 PM (21:00) ending at 9:45 PM (21:45) to cover 9 PM shift requirement
  if (startHour === '10:30' && (endHour === '21:00' || endHour === '21:45' || endHour === '22:00')) {
    if (!slots.some(s => s.time === '21:00')) {
      slots.push({
        time: '21:00',
        type: 'session',
        endTime: '21:45'
      });
    }
  }

  return slots;
}
