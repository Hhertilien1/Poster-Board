export function formatDateTime(iso: string | null | undefined) {
  if (!iso) {
    return "No timestamp";
  }

  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) {
    return "No timestamp";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(value);
}
