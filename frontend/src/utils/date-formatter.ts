export function dateConverter(date: string) {
  const datetime = new Date(date);

  const formattedDate = datetime.toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
}

export function dateTimeConverter(date: string) {
  const datetime = new Date(date);

  const formattedDate = datetime.toLocaleTimeString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return formattedDate;
}
