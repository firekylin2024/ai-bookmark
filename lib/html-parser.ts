import { ParsedWebsite } from "./url-parser"
import { generateSmartName, generateSmartDescription, generateSmartNotes } from "./smart-naming"

// 解析HTML书签文件
export function parseHtmlBookmarks(htmlContent: string): ParsedWebsite[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, "text/html")
  const websites: ParsedWebsite[] = []

  // 查找所有书签链接
  const links = doc.querySelectorAll("a")
  links.forEach((link) => {
    const url = link.getAttribute("href")
    if (!url) return

    // 获取书签信息
    const name = link.textContent?.trim() || ""
    const addDate = link.getAttribute("add_date")
    const lastModified = link.getAttribute("last_modified")
    const icon = link.getAttribute("icon")
    
    // 获取父级文件夹作为分类
    let category = ""
    const parentFolder = link.closest("dl")
    if (parentFolder) {
      const folderName = parentFolder.previousElementSibling?.textContent?.trim()
      if (folderName) {
        category = folderName
      }
    }

    // 生成智能名称和描述
    const smartName = generateSmartName(url, name, "")
    const smartDescription = generateSmartDescription(url, smartName, "")
    const smartNotes = generateSmartNotes("", url, smartName)

    websites.push({
      url,
      name: smartName,
      category: category || "",
      notes: "", // HTML导入不生成注释
    })
  })

  return websites
}

// 验证HTML内容是否为书签文件
export function isValidBookmarkFile(htmlContent: string): boolean {
  return htmlContent.includes("<!DOCTYPE NETSCAPE-Bookmark-file-1>") || 
         htmlContent.includes("<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=UTF-8\">")
} 