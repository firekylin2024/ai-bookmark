import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// 添加 Website 类型定义
interface Website {
  id: string;
  url: string;
  title: string;
  category: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const ImportDialog: React.FC = () => {
  const [batchText, setBatchText] = useState('');
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [recommendedCategories, setRecommendedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [parsePreview, setParsePreview] = useState<Website[]>([]);
  const [parseError, setParseError] = useState<string>("");

  // 格式说明
  <div className="mb-3 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
    <p className="text-sm text-blue-200 mb-2">网址必须单独成行，注释必须另起一行。示例：</p>
    <div className="text-xs text-blue-300 space-y-1 font-mono">
      <div>https://www.example.com</div>
      <div>这是该网站的注释（可多行）</div>
      <div>https://www.example2.com</div>
      <div>（下一个网站注释）</div>
    </div>
  </div>

  // 导入前检测格式
  function isBatchInputValid(text: string): boolean {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let lastIsUrl = false;
    for (const line of lines) {
      if (/^(https?:\/\/|www\.)/i.test(line)) {
        lastIsUrl = true;
      } else {
        if (!lastIsUrl) return false; // 注释前必须有网址
        lastIsUrl = false;
      }
    }
    return true;
  }

  function parseBatchInput(text: string): Website[] | null {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let currentCategory = '';
    let currentUrl = '';
    let currentNotes = '';
    const result: Website[] = [];
    let lastIsUrl = false;
    for (const line of lines) {
      if (/^(https?:\/\/|www\.)/i.test(line)) {
        if (currentUrl) {
          result.push({
            id: Date.now().toString() + Math.random(),
            url: currentUrl,
            title: currentUrl,
            category: currentCategory,
            notes: currentNotes.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        currentUrl = line;
        currentNotes = '';
        lastIsUrl = true;
      } else {
        if (!lastIsUrl) return null; // 注释前必须有网址
        currentNotes += (currentNotes ? '\n' : '') + line;
        lastIsUrl = false;
      }
    }
    if (currentUrl) {
      result.push({
        id: Date.now().toString() + Math.random(),
        url: currentUrl,
        title: currentUrl,
        category: currentCategory,
        notes: currentNotes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return result;
  }

  const handlePreview = () => {
    setParseError("");
    const preview = parseBatchInput(batchText);
    if (!preview) {
      setParseError('格式错误：网址必须单独成行，注释必须另起一行。');
      setParsePreview([]);
    } else {
      setParsePreview(preview);
    }
  };

  const handleGenerate = () => {
    if (parseError || parsePreview.length === 0) return;
    onImport(parsePreview);
    setBatchText('');
    setShowBatchImport(false);
    setParsePreview([]);
  };

  useEffect(() => {
    setRecommendedCategories(['推荐分类1', '推荐分类2', '推荐分类3']);
  }, []);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {recommendedCategories.map((category) => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => setNewCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

// 添加 onImport 和 setNewCategory 的声明
const onImport = (sites: Website[]) => {
  // 处理导入逻辑
};

export default ImportDialog; 