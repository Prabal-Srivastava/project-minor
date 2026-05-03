import { Smile, Frown, Meh, Sparkles } from "lucide-react"
import { cn } from "../lib/utils"

const VIBE_OPTIONS = [
  { value: "all", label: "All News", icon: Sparkles, color: "gray" },
  { value: "positive", label: "Positive", icon: Smile, color: "green" },
  { value: "critical", label: "Critical", icon: Frown, color: "red" },
  { value: "neutral", label: "Balanced", icon: Meh, color: "blue" },
]

export default function VibeFilter({ selectedVibe, onVibeChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Vibe:
      </span>
      {VIBE_OPTIONS.map(({ value, label, icon: Icon, color }) => {
        const isSelected = selectedVibe === value
        
        const colorClasses = {
          gray: {
            selected: "bg-gray-900 text-white border-gray-900",
            unselected: "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
          },
          green: {
            selected: "bg-green-600 text-white border-green-600",
            unselected: "bg-white text-green-600 border-green-200 hover:border-green-400",
          },
          red: {
            selected: "bg-red-600 text-white border-red-600",
            unselected: "bg-white text-red-600 border-red-200 hover:border-red-400",
          },
          blue: {
            selected: "bg-blue-600 text-white border-blue-600",
            unselected: "bg-white text-blue-600 border-blue-200 hover:border-blue-400",
          },
        }

        return (
          <button
            key={value}
            onClick={() => onVibeChange(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer",
              isSelected ? colorClasses[color].selected : colorClasses[color].unselected
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
