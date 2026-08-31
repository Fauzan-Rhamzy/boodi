interface Props {
  year: number;
  month: number; // 0-11
  sessionDates: Set<number>; // tanggal session
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DiaryCalendar({ year, month, sessionDates }: Props) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  // buat array cells — null untuk padding sebelum hari pertama
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((day) => (
          <p
            key={day}
            className="text-center text-xs font-medium text-gray-400"
          >
            {day}
          </p>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, index) => {
          if (date === null) {
            return <div key={`empty-${index}`} />;
          }

          const isToday = isCurrentMonth && date === today.getDate();
          const hasSession = sessionDates.has(date);

          return (
            <div
              key={date}
              className="flex flex-col items-center justify-center py-1"
            >
              <p
                className={`text-xs font-medium w-10 h-15 flex items-center justify-center rounded
                  ${isToday ? "bg-dark-green text-white" : "bg-light-green text-text"}`}
              >
                {date}
              </p>
              {/* dot kalau ada session */}
              {hasSession && (
                <div className="w-1 h-1 rounded-full bg-dark-green mt-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
