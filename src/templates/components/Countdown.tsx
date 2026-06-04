import { FC } from 'hono/jsx';

interface CountdownProps {
  matchDatetime: string;
  lang: 'ar' | 'en';
}

const Countdown: FC<CountdownProps> = ({ matchDatetime, lang }) => {
  const now = new Date();
  const matchTime = new Date(matchDatetime);
  const diffMs = matchTime.getTime() - now.getTime();

  if (diffMs <= 0) {
    const riyadhTime = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-SA', {
      timeZone: 'Asia/Riyadh',
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(matchTime);
    return <span class="text-xs text-gray-400">{riyadhTime}</span>;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const label = lang === 'ar'
    ? `${days}ي ${hours}س ${minutes}د`
    : `${days}d ${hours}h ${minutes}m`;

  return (
    <span class="text-xs font-mono text-accent" data-countdown={matchDatetime}>
      {label}
    </span>
  );
};

export default Countdown;
