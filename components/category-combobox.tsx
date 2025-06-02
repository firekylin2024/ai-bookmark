import { useState } from "react"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Folder, Tag, Star } from "lucide-react"

interface CategoryComboboxProps {
  value: string
  onChange: (val: string) => void
  recommended?: string[]
  history?: string[]
  placeholder?: string
}

const iconMap: Record<string, React.ReactNode> = {
  推荐: <Star className="text-yellow-400" />,
  历史: <Tag className="text-blue-400" />,
  默认: <Folder className="text-purple-400" />,
}

export function CategoryCombobox({ value, onChange, recommended = [], history = [], placeholder = "请输入或选择分类" }: CategoryComboboxProps) {
  const [input, setInput] = useState("")
  const allHistory = Array.from(new Set(history)).filter(Boolean)
  const allRecommended = recommended.filter(c => !allHistory.includes(c))
  const showCustom = input && ![...allHistory, ...allRecommended].includes(input)

  return (
    <Command className="w-full">
      <CommandInput
        placeholder={placeholder}
        value={input}
        onValueChange={setInput}
      />
      <CommandList>
        <CommandEmpty>无匹配分类</CommandEmpty>
        {allHistory.length > 0 && (
          <CommandGroup heading="历史分类">
            {allHistory.map(c => (
              <CommandItem key={c} onSelect={() => { onChange(c); setInput("") }}>
                {iconMap["历史"]} {c}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {allRecommended.length > 0 && (
          <CommandGroup heading="推荐分类">
            {allRecommended.map(c => (
              <CommandItem key={c} onSelect={() => { onChange(c); setInput("") }}>
                {iconMap["推荐"]} {c}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {showCustom && (
          <CommandGroup heading="自定义">
            <CommandItem onSelect={() => { onChange(input); setInput("") }}>
              {iconMap["默认"]} {input}
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
} 