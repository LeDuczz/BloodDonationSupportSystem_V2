import dayjs from "dayjs";
export function formatDate(date) {
    if (!(date instanceof Date)) return "format date error";

    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;


}

export function stringifyLocalDate(date) {
    return JSON.stringify(formatDate(date));
    
}

export function dayjsToLocalTimeObject(time) {
    const t = dayjs(time);
  return {
    hour: t.hour(),
    minute: t.minute(),
    second: 0,
    nano: 0,
  };
}

export function formatTimeToString(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = '00';
  return `${h}:${m}:${s}`;
}

export function formatTimeToStringFunc(time) {
  return dayjs(time).format("HH:mm:ss");
}