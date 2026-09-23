/**
 * Time utility functions configured for Indian Standard Time (IST / Asia/Kolkata).
 */

export const formatISTTime = (isoString?: string | number | Date | null): string => {
  if (!isoString) return '--:--:-- IST';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    
    return d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' IST';
  } catch {
    return String(isoString);
  }
};

export const formatISTDateTime = (isoString?: string | number | Date | null): string => {
  if (!isoString) return '--:--:--';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return String(isoString);
  }
};
