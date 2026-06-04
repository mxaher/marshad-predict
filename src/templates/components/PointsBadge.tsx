import { FC } from 'hono/jsx';

interface PointsBadgeProps {
  points: number | null;
}

const PointsBadge: FC<PointsBadgeProps> = ({ points }) => {
  if (points === null || points === undefined) {
    return (
      <span class="inline-flex items-center gap-1 bg-gray-700 text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
        ⚪ <span>Pending</span>
      </span>
    );
  }

  if (points === 3) {
    return (
      <span class="inline-flex items-center gap-1 bg-green-600/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full border border-green-500/30">
        🟢 <span>+3</span>
      </span>
    );
  }

  if (points === 2) {
    return (
      <span class="inline-flex items-center gap-1 bg-yellow-600/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full border border-yellow-500/30">
        🟡 <span>+2</span>
      </span>
    );
  }

  return (
    <span class="inline-flex items-center gap-1 bg-red-600/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full border border-red-500/30">
      🔴 <span>0</span>
    </span>
  );
};

export default PointsBadge;
