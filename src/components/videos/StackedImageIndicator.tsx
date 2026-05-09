import { Images } from "lucide-react";

interface StackedImageIndicatorProps {
  count: number;
}

export function StackedImageIndicator({ count }: StackedImageIndicatorProps) {
  if (count === 0) return null;

  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 backdrop-blur-sm">
      <Images className="h-3 w-3 text-white/90" />
      <span className="text-[10px] font-semibold leading-none text-white">+{count}</span>
    </div>
  );
}
