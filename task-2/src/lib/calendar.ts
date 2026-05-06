// Generate an ICS file for "Add to Calendar"
export function buildICS(opts: {
  title: string; description: string; location: string;
  startsAt: string; endsAt: string; uid: string;
}) {
  const fmt = (d: string) => new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = (s: string) => s.replace(/[\\,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gather//EN", "BEGIN:VEVENT",
    `UID:${opts.uid}@gather`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(opts.startsAt)}`,
    `DTEND:${fmt(opts.endsAt)}`,
    `SUMMARY:${esc(opts.title)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    `LOCATION:${esc(opts.location)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
