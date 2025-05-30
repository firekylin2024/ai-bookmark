"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit3, ExternalLink, FileText, Link2, ChevronDown, ChevronUp } from "lucide-react"
import { WebsiteEditDialog, type WebsiteData } from "./website-edit-dialog"

interface WebsiteCardProps {
  website: WebsiteData
  showNotes?: boolean
  onEdit: (website: WebsiteData) => void
  onDelete?: (id: number) => void
  relatedWebsites?: WebsiteData[] // 相关网站列表
  isGrouped?: boolean // 是否显示为分组
}

export function WebsiteCard({
  website,
  showNotes = true,
  onEdit,
  onDelete,
  relatedWebsites = [],
  isGrouped = false,
}: WebsiteCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // 计算透明度
  const getOpacity = (frequency?: string) => {
    switch (frequency?.toLowerCase()) {
      case "高":
        return 0.9
      case "中":
        return 0.7
      case "低":
        return 0.5
      default:
        return 0.7
    }
  }

  const handleSave = (editedWebsite: WebsiteData) => {
    onEdit(editedWebsite)
  }

  // 优先显示用户注释，如果没有则显示AI描述
  const displayNotes = website.notes && website.notes.trim() ? website.notes : website.description || ""
  const hasDisplayNotes = displayNotes.trim().length > 0
  const isUserNotes = website.notes && website.notes.trim().length > 0

  // 提取页面路径用于显示
  const getPagePath = (url: string) => {
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname + urlObj.search + urlObj.hash
      return path === "/" ? "" : path
    } catch {
      return ""
    }
  }

  // 获取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  const mainDomain = getDomain(website.url)
  const hasRelated = relatedWebsites.length > 0

  return (
    <>
      <Card
        className={`group hover:shadow-lg transition-all duration-200 border-0 bg-white/10 backdrop-blur-sm cursor-pointer card-glow-hover border border-white/20 ${
          hasRelated ? "ring-1 ring-purple-400/30" : ""
        }`}
        style={{
          backgroundColor: `${website.color}${Math.round(getOpacity(website.frequency) * 255)
            .toString(16)
            .padStart(2, "0")}`,
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-white group-hover:text-yellow-200 transition-colors">
                  {website.name}
                </h3>
                {hasRelated && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30"
                  >
                    <Link2 className="w-3 h-3 mr-1" />
                    {relatedWebsites.length + 1}个页面
                  </Badge>
                )}
              </div>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                {website.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" asChild className="text-white hover:bg-white/20">
                <a href={website.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* 主URL显示 */}
          <div className="text-sm text-white/80 mb-3">
            <div className="font-medium text-white/90">{mainDomain}</div>
            {getPagePath(website.url) && (
              <div className="text-xs text-white/60 font-mono truncate">{getPagePath(website.url)}</div>
            )}
          </div>

          {/* 统一的注释显示区域 */}
          {showNotes && hasDisplayNotes && (
            <div
              className={`mb-3 p-2 rounded-md border ${
                isUserNotes ? "bg-black/20 border-white/10" : "bg-blue-500/20 border-blue-400/30"
              }`}
            >
              <div className="flex items-start gap-2">
                <FileText
                  className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isUserNotes ? "text-white/60" : "text-blue-300"}`}
                />
                <div className="flex-1">
                  <p className={`text-xs leading-relaxed ${isUserNotes ? "text-white/90" : "text-blue-200"}`}>
                    {displayNotes}
                  </p>
                  {!isUserNotes && <p className="text-xs text-blue-300/60 mt-1">AI生成 · 点击编辑添加个人注释</p>}
                </div>
              </div>
            </div>
          )}

          {/* 相关页面展开/收起 */}
          {hasRelated && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-white/80 hover:bg-white/10 justify-between"
              >
                <span className="text-xs">相关页面 ({relatedWebsites.length})</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {relatedWebsites.map((related) => (
                    <div
                      key={related.id}
                      className="flex items-center justify-between p-2 bg-black/20 rounded border border-white/10"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white/90 truncate">{related.name}</div>
                        <div className="text-xs text-white/60 font-mono truncate">{getPagePath(related.url)}</div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="text-xs text-white/60">{related.clicks || 0}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="h-6 w-6 p-0 text-white/60 hover:bg-white/10"
                        >
                          <a href={related.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <WebsiteEditDialog
        website={website}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSave}
        onDelete={onDelete}
      />
    </>
  )
}
