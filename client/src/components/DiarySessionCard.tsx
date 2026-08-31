import type { ReadingSession } from "../types/users";

interface Props {
  session: ReadingSession;
}

export default function DiarySessionCard({ session }: Props) {
  const date = new Date(session.logged_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
      {/* cover buku */}
      <img
        src={`http://localhost:8080/images/${session.cover}`}
        alt={session.title}
        className="w-12 h-16 rounded-xl object-cover shrink-0"
      />

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text line-clamp-1">
          {session.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>

        {/* progress bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Page {session.current_page}</span>
            <span>{session.total_pages} pages</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-dark-green rounded-full"
              style={{
                width: `${Math.min(
                  (session.current_page / session.total_pages) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
