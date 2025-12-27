import React, { useState, useEffect } from 'react';
import { Tag, TagList, TagInput } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface TagData {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface TagManagerProps {
  fileId?: string;
  onTagsChange?: (tags: string[]) => void;
  trigger?: React.ReactNode;
}

export function TagManager({ fileId, onTagsChange, trigger }: TagManagerProps) {
  const [userTags, setUserTags] = useState<TagData[]>([]);
  const [fileTags, setFileTags] = useState<Array<{ id: string; name: string; color: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取用户所有标签
  const fetchUserTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setUserTags(data.tags || []);
      }
    } catch (error) {
      console.error('Error fetching user tags:', error);
    }
  };

  // 获取文件标签
  const fetchFileTags = async () => {
    if (!fileId) return;
    
    try {
      const response = await fetch(`/api/files/${fileId}/tags`);
      if (response.ok) {
        const data = await response.json();
        setFileTags(data.tags || []);
        setSelectedTags(data.tags?.map((tag: any) => tag.name) || []);
      }
    } catch (error) {
      console.error('Error fetching file tags:', error);
    }
  };

  useEffect(() => {
    fetchUserTags();
    if (fileId) {
      fetchFileTags();
    }
  }, [fileId]);

  // 添加标签到文件
  const addTagsToFile = async (tagNames: string[]) => {
    if (!fileId || tagNames.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/files/${fileId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagNames }),
      });

      if (response.ok) {
        await fetchFileTags();
        onTagsChange?.(tagNames);
      }
    } catch (error) {
      console.error('Error adding tags to file:', error);
    } finally {
      setLoading(false);
    }
  };

  // 从文件移除标签
  const removeTagsFromFile = async (tagIds?: string[]) => {
    if (!fileId) return;

    setLoading(true);
    try {
      const url = tagIds 
        ? `/api/files/${fileId}/tags?tagIds=${tagIds.join(',')}`
        : `/api/files/${fileId}/tags`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchFileTags();
        onTagsChange?.([]);
      }
    } catch (error) {
      console.error('Error removing tags from file:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建新标签
  const createTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: fileId || '',
          tagNames: [newTagName.trim()],
        }),
      });

      if (response.ok) {
        setNewTagName('');
        setIsAddDialogOpen(false);
        await fetchUserTags();
        if (fileId) {
          await fetchFileTags();
        }
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  // 更新标签
  const updateTag = async (tagId: string, updates: { name?: string; color?: string }) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setEditingTag(null);
        await fetchUserTags();
        if (fileId) {
          await fetchFileTags();
        }
      }
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  // 删除标签
  const deleteTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUserTags();
        if (fileId) {
          await fetchFileTags();
        }
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleTagSelection = (tagNames: string[]) => {
    setSelectedTags(tagNames);
    if (fileId) {
      addTagsToFile(tagNames);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus size={16} className="mr-1" />
      管理标签
    </Button>
  );

  return (
    <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>标签管理</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 当前文件标签 */}
          {fileId && (
            <div>
              <Label className="text-sm font-medium">当前文件标签</Label>
              <div className="mt-2">
                {fileTags.length > 0 ? (
                  <TagList
                    tags={fileTags}
                    removable
                    onRemoveTag={(tagId) => {
                      const tagToRemove = fileTags.find(t => t.id === tagId);
                      if (tagToRemove) {
                        removeTagsFromFile([tagId]);
                      }
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-sm">暂无标签</div>
                )}
              </div>
            </div>
          )}

          {/* 添加标签 */}
          <div>
            <Label className="text-sm font-medium">添加标签</Label>
            <TagInput
              value={selectedTags}
              onChange={handleTagSelection}
              suggestions={userTags.map(tag => tag.name)}
              placeholder="输入标签名称或从现有标签中选择..."
            />
          </div>

          {/* 标签列表 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">所有标签</Label>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus size={16} className="mr-1" />
                    新建标签
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建新标签</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tagName">标签名称</Label>
                      <Input
                        id="tagName"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="输入标签名称"
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagColor">标签颜色</Label>
                      <Input
                        id="tagColor"
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-20 h-10"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        取消
                      </Button>
                      <Button onClick={createTag}>创建</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {userTags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Tag name={tag.name} color={tag.color} size="sm" />
                    <span className="text-xs text-gray-500">{tag.count} 个文件</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTag(tag)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTag(tag.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}