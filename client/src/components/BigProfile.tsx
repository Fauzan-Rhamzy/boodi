export default function BigProfile({ pfp }: { pfp: string }) {
  return <img src={pfp} className="w-60 h-60 rounded-full object-cover" />;
}
