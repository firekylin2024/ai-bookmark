"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit3, Trash2, Save, Info, Sparkles, Wand2, CheckCircle } from "lucide-react"
import { parseWebsiteLine } from "@/lib/url-parser"
import { generateSmartName, generateSmartDescription } from "@/lib/smart-naming"
import { CategoryCombobox } from "./category-combobox"

// 常用分类列表
const COMMON_CATEGORIES = [
  "搜索引擎",
  "开发工具",
  "娱乐媒体",
  "生产力工具",
  "设计工具",
  "沟通协作",
  "社交媒体",
  "学习教育",
  "新闻资讯",
  "电商购物",
  "金融服务",
  "云服务",
  "其他",
]

export interface WebsiteData {
  id: number
  url: string
  name: string
  category: string
  notes: string
  color: string
  description?: string
  frequency?: string
  clicks?: number
}

interface WebsiteEditDialogProps {
  website: WebsiteData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (website: WebsiteData) => void
  onDelete?: (id: number) => void
}

export function WebsiteEditDialog({ website, open, onOpenChange, onSave, onDelete }: WebsiteEditDialogProps) {
  const [editedWebsite, setEditedWebsite] = useState<WebsiteData | null>(
    website ? JSON.parse(JSON.stringify(website)) : null,
  )
  const [smartInput, setSmartInput] = useState("")
  const [parseResult, setParseResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("manual")
  const [categoryHistory, setCategoryHistory] = useState<string[]>([])

  // 判断是否为新增模式
  const isAddMode = website?.id === 0

  useEffect(() => {
    if (open && website) {
      setEditedWebsite(JSON.parse(JSON.stringify(website)))
      setSmartInput("")
      setParseResult(null)
      // 新增模式默认使用智能输入
      setActiveTab(isAddMode ? "smart" : "manual")
    }
  }, [website, open, isAddMode])

  if (!editedWebsite) return null

  const handleChange = (field: keyof WebsiteData, value: string) => {
    setEditedWebsite((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  // 智能解析输入
  const handleSmartInputChange = (input: string) => {
    setSmartInput(input)

    if (!input.trim()) {
      setParseResult(null)
      return
    }

    try {
      // 尝试解析输入
      const parsed = parseWebsiteLine(input.trim())
      if (parsed && parsed.url) {
        setParseResult({
          success: true,
          data: parsed,
          message: "✅ 解析成功！检测到网站信息",
        })

        // 自动填充到表单
        if (editedWebsite) {
          setEditedWebsite({
            ...editedWebsite,
            url: parsed.url,
            name: parsed.name || "",
            category: parsed.category || editedWebsite.category,
            notes: parsed.notes || "",
          })
        }
      } else {
        setParseResult({
          success: false,
          message: "❌ 未能识别有效的网站URL，请检查输入格式",
        })
      }
    } catch (error) {
      setParseResult({
        success: false,
        message: "❌ 解析失败，请检查输入格式",
      })
    }
  }

  // 应用智能解析结果
  const applyParseResult = () => {
    if (parseResult?.success && parseResult.data && editedWebsite) {
      const { url, name, category, notes } = parseResult.data
      setEditedWebsite({
        ...editedWebsite,
        url: url || editedWebsite.url,
        name: name || editedWebsite.name,
        category: category || editedWebsite.category,
        notes: notes || editedWebsite.notes,
      })
      setActiveTab("manual")
    }
  }

  // 智能补全
  const handleSmartComplete = () => {
    if (!editedWebsite?.url) return

    try {
      const smartName = generateSmartName(editedWebsite.url, editedWebsite.name)
      const smartDescription = generateSmartDescription(editedWebsite.url, smartName)

      setEditedWebsite({
        ...editedWebsite,
        name: smartName,
        notes: editedWebsite.notes || smartDescription,
      })
    } catch (error) {
      console.error("智能补全失败:", error)
    }
  }

  const handleSave = () => {
    if (editedWebsite) {
      // 确保必填字段
      if (!editedWebsite.url.trim()) {
        alert("请输入网站地址")
        return
      }
      if (!editedWebsite.name.trim()) {
        alert("请输入网站名称")
        return
      }

      onSave(editedWebsite)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (editedWebsite && onDelete) {
      onDelete(editedWebsite.id)
      onOpenChange(false)
    }
  }

  // 显示当前的AI描述（如果有）
  const hasAIDescription = editedWebsite.description && editedWebsite.description.trim()
  const hasUserNotes = editedWebsite.notes && editedWebsite.notes.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAddMode ? (
              <>
                <Sparkles className="w-5 h-5 text-green-400" />
                添加新网站
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 text-purple-400" />
                编辑网站信息
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger
              value="smart"
              className="flex items-center gap-2 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-300"
            >
              <Wand2 className="w-4 h-4" />
              智能输入
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300"
            >
              <Edit3 className="w-4 h-4" />
              手动编辑
            </TabsTrigger>
          </TabsList>

          <TabsContent value="smart" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label className="text-gray-300">🎯 智能输入 - 支持多种格式</Label>

              {/* 格式说明 */}
              <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                <p className="text-sm text-green-200 mb-2">💡 支持以下输入格式：</p>
                <div className="text-xs text-green-300 space-y-1 font-mono">
                  <div>
                    • <code>https://github.com/user/repo GitHub项目</code>
                  </div>
                  <div>
                    • <code>https://example.com 网站名称，用途说明</code>
                  </div>
                  <div>
                    • <code>网站名称 - https://example.com</code>
                  </div>
                  <div>
                    • <code>https://example.com | 名称 [分类] # 注释</code>
                  </div>
                </div>
              </div>

              <Textarea
                placeholder="粘贴网址和描述，例如：&#10;https://github.com/jamez-bondos/awesome-gpt4o-images?tab=readme-ov-file#cases-97&#10;目前有99个出图案例，&#10;&#10;https://raphael.app/zh&#10;ai文生图，"
                value={smartInput}
                onChange={(e) => handleSmartInputChange(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white min-h-[120px] font-mono text-sm"
              />

              {/* 解析结果 */}
              {parseResult && (
                <div
                  className={`p-3 rounded-lg border ${
                    parseResult.success ? "bg-green-900/30 border-green-500/30" : "bg-red-900/30 border-red-500/30"
                  }`}
                >
                  <p className={`text-sm mb-2 ${parseResult.success ? "text-green-200" : "text-red-200"}`}>
                    {parseResult.message}
                  </p>

                  {parseResult.success && parseResult.data && (
                    <div className="space-y-2">
                      <div className="text-xs text-green-300">
                        <div>
                          <strong>网址:</strong> {parseResult.data.url}
                        </div>
                        {parseResult.data.name && (
                          <div>
                            <strong>名称:</strong> {parseResult.data.name}
                          </div>
                        )}
                        {parseResult.data.category && (
                          <div>
                            <strong>分类:</strong> {parseResult.data.category}
                          </div>
                        )}
                        {parseResult.data.notes && (
                          <div>
                            <strong>注释:</strong> {parseResult.data.notes}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={applyParseResult}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        应用解析结果
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* 示例按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSmartInputChange(
                      "https://github.com/jamez-bondos/awesome-gpt4o-images?tab=readme-ov-file#cases-97\n目前有99个出图案例，",
                    )
                  }
                  className="border-green-300/50 text-green-200 hover:bg-green-800/30"
                >
                  📝 示例1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSmartInputChange("https://raphael.app/zh\nai文生图，")}
                  className="border-green-300/50 text-green-200 hover:bg-green-800/30"
                >
                  🎨 示例2
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="website-name" className="text-gray-300">
                    网站名称
                  </Label>
                  {editedWebsite.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSmartComplete}
                      className="border-purple-300/50 text-purple-200 hover:bg-purple-800/30"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      智能补全
                    </Button>
                  )}
                </div>
                <Input
                  id="website-name"
                  value={editedWebsite.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="输入网站名称或用途"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website-url" className="text-gray-300">
                  网站地址
                </Label>
                <Input
                  id="website-url"
                  value={editedWebsite.url}
                  onChange={(e) => handleChange("url", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website-category" className="text-gray-300">
                  分类
                </Label>
                <CategoryCombobox
                  value={editedWebsite.category}
                  onChange={(value) => {
                    handleChange("category", value)
                    if (value && !categoryHistory.includes(value)) setCategoryHistory([value, ...categoryHistory])
                  }}
                  recommended={COMMON_CATEGORIES}
                  history={categoryHistory}
                  placeholder="请输入或选择分类"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website-notes" className="text-gray-300">
                  个人注释
                </Label>

                {/* 显示AI描述作为参考 */}
                {hasAIDescription && !hasUserNotes && (
                  <div className="mb-2 p-2 bg-blue-900/30 rounded border border-blue-500/30">
                    <div className="flex items-start gap-2">
                      <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-300 mb-1">AI生成的描述：</p>
                        <p className="text-xs text-blue-200">{editedWebsite.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Textarea
                  id="website-notes"
                  value={editedWebsite.notes ?? ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white min-h-[80px] font-mono text-sm"
                  placeholder=""
                />

                <p className="text-xs text-gray-400">💡 个人注释会替换AI生成的描述。留空则显示AI描述。</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div>
            {onDelete && !isAddMode && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="bg-red-900 hover:bg-red-800 text-white"
              >
                <Trash2 className="w-4 h-4 mr-1" /> 删除
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600 text-gray-300">
              取消
            </Button>
            <Button onClick={handleSave} className="theme-gradient">
              <Save className="w-4 h-4 mr-1" /> {isAddMode ? "添加" : "保存"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
