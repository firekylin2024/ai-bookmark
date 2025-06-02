// URL解析和清理工具库

import { generateSmartName, generateSmartDescription, generateSmartNotes } from "./smart-naming"

export interface ParsedWebsite {
  url: string
  name: string
  category?: string
  notes?: string
}

// 清理和验证URL
export function cleanUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== "string") {
    return null
  }

  let url = rawUrl.trim()

  // 移除常见的前缀文字
  url = url.replace(/^(网址|链接|地址|URL|网站)[:：]\s*/i, "")

  // 如果没有协议，添加https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // 检查是否看起来像域名
    if (url.includes(".") && !url.includes(" ")) {
      url = "https://" + url
    }
  }

  try {
    const urlObj = new URL(url)

    // 验证域名格式
    if (!urlObj.hostname || !urlObj.hostname.includes(".")) {
      return null
    }

    // 返回清理后的URL（移除fragment和一些参数）
    const cleanedUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`
    return cleanedUrl.endsWith("/") ? cleanedUrl.slice(0, -1) : cleanedUrl
  } catch {
    return null
  }
}

// 从文本中提取URL
export function extractUrlFromText(text: string): string | null {
  if (!text || typeof text !== "string") {
    return null
  }

  // URL正则表达式 - 匹配http(s)://开头的URL，遇到空格即结束
  const urlRegex = /https?:\/\/[\S]+/i
  const match = text.match(urlRegex)

  if (match) {
    let url = match[0]
    // 移除URL末尾的标点符号
    url = url.replace(/[.,;:!?'\")\]}]+$/, "")
    return cleanUrl(url)
  }

  // 如果没有找到完整URL，尝试查找域名模式
  const domainRegex = /(?:^|\s)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?=\s|$|[.,;:!?'\")\]}])/ 
  const domainMatch = text.match(domainRegex)

  if (domainMatch) {
    const domain = domainMatch[0].trim()
    return cleanUrl(domain)
  }

  return null
}

function isUrl(line: string): boolean {
  return /^https?:\/\//.test(line.trim())
}

export function parseSmartBatchInput(text: string): ParsedWebsite[] {
  const lines = text.split(/\r?\n/)
  let currentCategory = ""
  let currentUrl = ""
  let currentNotes: string[] = []
  const result: ParsedWebsite[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    if (isUrl(line)) {
      // 如果有上一个网址，先保存
      if (currentUrl) {
        result.push({ url: currentUrl, name: "", category: currentCategory, notes: currentNotes.join("\n") })
        currentNotes = []
      }
      currentUrl = line
    } else if (!isUrl(line) && !currentUrl) {
      // 作为分组名
      currentCategory = line
    } else {
      // 作为当前网址的notes
      currentNotes.push(line)
    }
  }
  // 收尾
  if (currentUrl) {
    result.push({ url: currentUrl, name: "", category: currentCategory, notes: currentNotes.join("\n") })
  }
  return result
}

// 解析单行网站信息 - 使用智能命名
export function parseWebsiteLine(line: string): ParsedWebsite | null {
  if (!line || typeof line !== "string") {
    return null
  }

  const trimmed = line.trim()

  // 支持的格式：
  // 1. 标准格式: https://www.google.com | Google搜索 [搜索引擎] # 日常搜索工具
  // 2. 简单格式: https://www.google.com Google搜索
  // 3. 反向格式: Google搜索 https://www.google.com
  // 4. 书签格式: Google搜索 - https://www.google.com
  // 5. 纯URL: https://www.google.com

  let url = ""
  let rawName = ""
  let category = ""
  let rawNotes = ""

  // 首先尝试标准格式解析
  const standardResult = parseStandardFormat(trimmed)
  if (standardResult) {
    url = standardResult.url
    rawName = standardResult.name || ""
    category = standardResult.category || ""
    rawNotes = standardResult.notes || ""
  } else {
    // 尝试提取URL
    url = extractUrlFromText(trimmed)
    if (!url) {
      return null
    }

    // 提取原始名称和注释
    rawName = extractRawNameFromText(trimmed, url)
    rawNotes = extractRawNotesFromText(trimmed)

    // 尝试从文本中提取分类（方括号内容）
    const categoryMatch = trimmed.match(/\[([^\]]+)\]/)
    if (categoryMatch) {
      category = categoryMatch[1].trim()
    }
  }

  // 使用智能命名生成最终名称
  const smartName = generateSmartName(url, rawName, rawNotes)
  const smartDescription = generateSmartDescription(url, smartName, rawNotes)
  const smartNotes = generateSmartNotes(rawNotes, url, smartName)

  return {
    url,
    name: smartName,
    category: category || "",
    notes: smartNotes && smartNotes.trim() ? smartNotes : "",
  }
}

// 提取原始名称
function extractRawNameFromText(text: string, url: string): string {
  if (!text || !url) {
    return ""
  }

  // 移除URL本身
  let nameText = text.replace(url.replace("https://", "").replace("http://", ""), "").trim()

  // 移除常见的分隔符和前缀
  nameText = nameText.replace(/^[-|–—:：\s]+/, "").replace(/[-|–—:：\s]+$/, "")

  // 移除括号内容（通常是描述）
  nameText = nameText.replace(/$$[^)]*$$/, "").trim()

  // 移除方括号内容
  nameText = nameText.replace(/\[[^\]]*\]/, "").trim()

  // 移除#后面的注释
  nameText = nameText.replace(/#.*$/, "").trim()

  return nameText
}

// 提取原始注释
function extractRawNotesFromText(text: string): string {
  // 尝试从文本中提取注释（#后面的内容）
  const notesMatch = text.match(/#\s*(.+)$/)
  if (notesMatch) {
    return notesMatch[1].trim()
  }

  return text
}

// 解析标准格式
function parseStandardFormat(line: string): ParsedWebsite | null {
  // 标准格式: URL | 名称 [分类] # 注释

  let url = ""
  let name = ""
  let category = ""
  let notes = ""

  // 提取注释 (# 后面的内容)
  const notesMatch = line.match(/(.+?)\s*#\s*(.+)$/)
  if (notesMatch) {
    notes = notesMatch[2].trim()
    line = notesMatch[1].trim()
  }

  // 提取分类 ([] 中的内容)
  const categoryMatch = line.match(/(.+?)\s*\[([^\]]+)\]\s*$/)
  if (categoryMatch) {
    category = categoryMatch[2].trim()
    line = categoryMatch[1].trim()
  }

  // 提取名称 (| 分隔)
  const nameMatch = line.match(/(.+?)\s*\|\s*(.+)$/)
  if (nameMatch) {
    const part1 = nameMatch[1].trim()
    const part2 = nameMatch[2].trim()

    // 判断哪部分是URL
    const url1 = extractUrlFromText(part1)
    const url2 = extractUrlFromText(part2)

    if (url1 && !url2) {
      url = url1
      name = part2
    } else if (url2 && !url1) {
      url = url2
      name = part1
    } else if (url1) {
      // 如果都有URL，选择第一个
      url = url1
      name = part2
    } else {
      return null
    }
  } else {
    // 没有|分隔符，尝试提取URL
    url = extractUrlFromText(line)
    if (url) {
      name = extractRawNameFromText(line, url)
    } else {
      return null
    }
  }

  return url ? { url, name, category, notes } : null
}

// 验证解析结果
export function validateParsedWebsites(websites: ParsedWebsite[]): ParsedWebsite[] {
  return websites.filter((site) => {
    // 确保URL有效
    if (!site.url || !cleanUrl(site.url)) {
      return false
    }

    // 清理URL
    const cleanedUrl = cleanUrl(site.url)
    if (cleanedUrl) {
      site.url = cleanedUrl
    }

    return true
  })
}

// 生成解析统计
export function generateParseStats(originalText: string, parsedWebsites: ParsedWebsite[]) {
  const lines = originalText.split("\n").filter((line) => line.trim())
  const totalLines = lines.length
  const successfullyParsed = parsedWebsites.length
  const failedLines = totalLines - successfullyParsed

  return {
    totalLines,
    successfullyParsed,
    failedLines,
    successRate: totalLines > 0 ? Math.round((successfullyParsed / totalLines) * 100) : 0,
  }
}
