import { SuggestHeader } from "./header"
import { SuggestHelperText } from "./helper-text"
import { SuggestItem } from "./item"

import type {
  SuggestionLevel,
  SuggestionOption,
} from "../types"

interface SuggestProps {
  options: SuggestionOption[]
  value: SuggestionLevel
  onChange: (value: SuggestionLevel) => void
  onDemo?: () => void
}

export function Suggest({
  options,
  value,
  onChange,
  onDemo,
}: SuggestProps) {
  return (
    <div className="space-y-3">
      <SuggestHeader />

      <div className="space-y-1">
        {options.map((option) => (
          <SuggestItem
            key={option.id}
            title={option.title}
            describe={option.describe}
            isLocked={option.isLocked}
            selected={value === option.id}
            onSelect={() => onChange(option.id)}
            onDemo={onDemo}
          />
        ))}
      </div>

      <SuggestHelperText />
    </div>
  )
}