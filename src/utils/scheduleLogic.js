import { parse, addMinutes, isBefore, format } from 'date-fns';

export function generateDailySlots(startHour, endHour, intervalMinutes = 45) {
  if (!startHour || !endHour) return [];
  const start = parse(startHour, 'HH:mm', new Date());
  const end = parse(endHour, 'HH:mm', new Date());
  
  const slots = [];
  let current = start;

  while (isBefore(addMinutes(current, intervalMinutes - 1), end)) {
    const timeStr = format(current, 'HH:mm');
    slots.push(timeStr);
    current = addMinutes(current, intervalMinutes);
  }

  return slots;
}
