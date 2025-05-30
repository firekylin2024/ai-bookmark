"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Wand2, CheckCircle, X } from "lucide-react"
import { parseWebsiteLine } from "@/lib/url-parser"
import type { WebsiteData } from "./website-edit-dialog"

interface QuickAddWidgetProps {
  onAddWebsite: (website: WebsiteData) => void
}

export function QuickAddWidget({ onAddWebsite }: QuickAddWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [parseResults, setParseResults] = useState<any[]>([])

  const handleInputChange = (value: string) => {
    setInput(value)

    if (!value.trim()) {
      setParseResults([])
      return
    }

    // 按行分割并解析
    const lines = value.split("\n").filter((line) => line.trim())
    const results = lines.map((line, index) => {
      try {
        const parsed = parseWebsiteLine(line.trim())
        if (parsed && parsed.url) {
          return {
            id: index,
            success: true,
            data: parsed,
            originalLine: line,
          }
        } else {
          return {
            id: index,
            success: false,
            originalLine: line,
            error: "未能识别有效的网站URL",
          }
        }
      } catch (error) {
        return {
          id: index,
          success: false,
          originalLine: line,
          error: "解析失败",
        }
      }
    })

    setParseResults(results)
  }

  const handleAddAll = () => {
    const successResults = parseResults.filter((r) => r.success)
    successResults.forEach((result, index) => {
      const newWebsite: WebsiteData = {
        id: Date.now() + index, // 临时ID，会在添加时重新分配
        url: result.data.url,
        name: result.data.name || "未命名网站",
        category: result.data.category || "其他",
        notes: result.data.notes || "",
        color: "bg-blue-500",
        frequency: "中",
        clicks: 0,
      }
      onAddWebsite(newWebsite)
    })

    // 清空并关闭
    setInput("")
    setParseResults([])
    setIsOpen(false)
  }

  const handleAddSingle = (result: any) => {
    const newWebsite: WebsiteData = {
      id: Date.now(),
      url: result.data.url,
      name: result.data.name || "未命名网站",
      category: result.data.category || "其他",
      notes: result.data.notes || "",
      color: "bg-blue-500",
      frequency: "中",
      clicks: 0,
    }
    onAddWebsite(newWebsite)

    // 从结果中移除已添加的项
    setParseResults(parseResults.filter((r) => r.id !== result.id))

    // 从输入中移除对应行
    const lines = input.split("\n")
    const newLines = lines.filter((_, index) => index !== result.id)
    setInput(newLines.join("\n"))
  }

  if (!isOpen) {
    return (
      <Card className="border-dashed border-2 border-green-400/30 bg-green-900/20 hover:bg-green-900/30 transition-colors cursor-pointer">
        <CardContent className="p-4" onClick={() => setIsOpen(true)}>
          <div className="flex items-center justify-center gap-2 text-green-300">
            <Plus className="w-5 h-5" />
            <span className="font-medium">快速添加网站</span>
          </div>
          <p className="text-xs text-green-400 text-center mt-1">支持粘贴多种格式</p>
        </CardContent>
      </Card>
    )
  }

  const successCount = parseResults.filter((r) => r.success).length
  const totalCount = parseResults.length

  return (
    <Card className="border-green-400/30 bg-green-900/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-green-400" />
            <span className="font-medium text-green-300">快速添加网站</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false)
              setInput("")
              setParseResults([])
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Textarea
          placeholder="粘贴网址和描述，支持多行：&#10;https://github.com/user/repo 项目描述&#10;https://example.com 网站说明&#10;..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="bg-gray-800/50 border-green-400/30 text-white min-h-[100px] font-mono text-sm"
        />

        {parseResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-300">
                解析结果: {successCount}/{totalCount} 成功
              </div>
              {successCount > 0 && (
                <Button size="sm" onClick={handleAddAll} className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  添加全部 ({successCount})
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {parseResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded border ${
                    result.success ? "bg-green-900/30 border-green-500/30" : "bg-red-900/30 border-red-500/30"
                  }`}
                >
                  {result.success ? (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-green-200 truncate">
                            {result.data.name || "未命名"}
                          </div>
                          <div className="text-xs text-green-300 font-mono truncate">{result.data.url}</div>
                          {result.data.category && (
                            <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-400/30">
                              {result.data.category}
                            </Badge>
                          )}
                          {result.data.notes && <div className="text-xs text-green-400 mt-1">{result.data.notes}</div>}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddSingle(result)}
                          className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-red-200">
                      <div className="font-mono text-xs text-red-300 mb-1">{result.originalLine}</div>
                      <div className="text-red-400">❌ {result.error}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-green-400">💡 支持格式: URL + 描述、名称 + URL、标准格式等</div>
      </CardContent>
    </Card>
  )
}
