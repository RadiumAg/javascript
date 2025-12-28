'use client';
import React, { useState, useEffect } from 'react';
import { Tag, TagList, TagInput } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { trpcClientReact } from '@/utils/api';

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
  const [fileTags, setFileTags] = useState<
    Array<{ id: string; name: string; color: string }>
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('#3b82f6');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // tRPC 查询
  const {
    data: userTagsData,
    isLoading: isLoadingUserTags,
    error: userTagsError,
    refetch: refetchUserTags,
  } = trpcClientReact.tags.getUserTags.useQuery();

  const {
    data: fileTagsData,
    isLoading: isLoadingFileTags,
    error: fileTagsError,
    refetch: refetchFileTags,
  } = trpcClientReact.tags.getFileTags.useQuery(
    { fileId },
    { enabled: !!fileId }
  );

  // Mutations
  const createTagMutation = trpcClientReact.tags.createTag.useMutation();
  const updateTagMutation = trpcClientReact.tags.updateTag.useMutation();
  const deleteTagMutation = trpcClientReact.tags.deleteTag.useMutation();
  const addTagsToFileMutation = trpcClientReact.tags.addTagsToFile.useMutation();
  const removeTagsFromFileMutation = trpcClientReact.tags.removeTagsFromFile.useMutation();

  // 更新本地状态
  useEffect(() => {
    if (userTagsData) {
      setUserTags(userTagsData);
      setError(null);
    } else if (userTagsError) {
      setError('获取标签列表失败');
    }
  }, [userTagsData, userTagsError]);

  useEffect(() => {
    if (fileTagsData) {
      setFileTags(fileTagsData);
      setSelectedTags(fileTagsData?.map((tag: any) => tag.name) || []);
      setError(null);
    } else if (fileTagsError) {
      setError('获取文件标签失败');
    }
  }, [fileTagsData, fileTagsError, fileId]);

  // 创建新标签
  const createTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const result = await createTagMutation.mutateAsync({
        name: newTagName.trim(),
        color: newTagColor,
      });

      setNewTagName('');
      setNewTagColor('#3b82f6');
      setIsAddDialogOpen(false);
      
      // 更新本地状态
      setUserTags(prev => [...prev, result]);
      await refetchUserTags();

      if (fileId) {
        await addTagsToFileMutation.mutateAsync({
          fileId,
          tagNames: [result.name],
        });
        await refetchFileTags();
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      setError('创建标签失败');
    }
  };

  // 更新标签
  const updateTag = async (
    tagId: string,
    updates: { name?: string; color?: string },
  ) => {
    try {
      const result = await updateTagMutation.mutateAsync({
        tagId,
        ...updates,
      });

      setEditingTag(null);
      
      // 更新本地状态
      setUserTags(prev => 
        prev.map(tag => tag.id === tagId ? { ...tag, ...updates } : tag)
      );
      setFileTags(prev => 
        prev.map(tag => tag.id === tagId ? { ...tag, ...updates } : tag)
      );
      
      await refetchUserTags();
      await refetchFileTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      setError('更新标签失败');
    }
  };

  // 删除标签
  const deleteTag = async (tagId: string) => {
    if (!window.confirm('确定要删除这个标签吗？这将同时从所有文件中移除此标签。')) {
      return;
    }

    try {
      await deleteTagMutation.mutateAsync({ tagId });

      // 更新本地状态
      const deletedTag = userTags.find(tag => tag.id === tagId);
      setUserTags(prev => prev.filter(tag => tag.id !== tagId));
      setFileTags(prev => prev.filter(tag => tag.id !== tagId));
      setSelectedTags(prev => prev.filter(name => name !== deletedTag?.name));
      
      await refetchUserTags();
      await refetchFileTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      setError('删除标签失败');
    }
  };

  // 从文件移除标签
  const removeTagsFromFile = async (tagIds?: string[]) => {
    if (!fileId) return;

    try {
      await removeTagsFromFileMutation.mutateAsync({
        fileId,
        tagIds,
      });

      // 更新本地状态
      if (tagIds) {
        const removedTagIds = new Set(tagIds);
        setFileTags((prev) =>
          prev.filter((tag) => !removedTagIds.has(tag.id)),
        );
        const removedNames = fileTags
          .filter((tag) => removedTagIds.has(tag.id))
          .map((tag) => tag.name);
        setSelectedTags((prev) =>
          prev.filter((name) => !removedNames.includes(name)),
        );
      } else {
        setFileTags([]);
        setSelectedTags([]);
      }
      
      await refetchFileTags();
    } catch (error) {
      console.error('Error removing tags from file:', error);
      setError('移除标签失败');
    }
  };

  const handleTagSelection = (tagNames: string[]) => {
    setSelectedTags(tagNames);
    if (fileId) {
      addTagsToFileMutation.mutateAsync({
        fileId,
        tagNames,
      }).then(() => {
        refetchFileTags();
      });
    }
  };

  const isLoading = isLoadingUserTags || isLoadingFileTags;

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus size={16} className="mr-1" />
      管理标签
    </Button>
  );

  return (
    <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>标签管理</DialogTitle>
        </DialogHeader>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

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
                      const tagToRemove = fileTags.find(
                        (t) => t.id === tagId,
                      );
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
              suggestions={userTags.map((tag) => tag.name)}
              placeholder="输入标签名称或从现有标签中选择..."
            />
          </div>

          {/* 标签列表 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">所有标签</Label>
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
              >
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
                      <Button
                        onClick={createTag}
                        disabled={
                          createTagMutation.isPending || !newTagName.trim()
                        }
                      >
                        {createTagMutation.isPending ? '创建中...' : '创建'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {userTags.map((tag, index) => (
                <div
                  key={tag.id || index}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Tag name={tag.name} color={tag.color} size="sm" />
                    <span className="text-xs text-gray-500">
                      {tag.count} 个文件
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTag(tag);
                        setEditTagName(tag.name);
                        setEditTagColor(tag.color);
                        setIsEditDialogOpen(true);
                      }}
                      disabled={updateTagMutation.isPending}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTag(tag.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteTagMutation.isPending}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 编辑标签对话框 */}
          {editingTag && (
            <Dialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>编辑标签</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editTagName">标签名称</Label>
                    <Input
                      id="editTagName"
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      placeholder="输入标签名称"
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editTagColor">标签颜色</Label>
                    <Input
                      id="editTagColor"
                      type="color"
                      value={editTagColor}
                      onChange={(e) => setEditTagColor(e.target.value)}
                      className="w-20 h-10"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingTag(null);
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          editTagName.trim() &&
                          editTagName !== editingTag.name
                        ) {
                          updateTag(editingTag.id, {
                            name: editTagName.trim(),
                          });
                        }
                        if (editTagColor !== editingTag.color) {
                          updateTag(editingTag.id, { color: editTagColor });
                        }
                        setIsEditDialogOpen(false);
                        setEditingTag(null);
                      }}
                      disabled={
                        updateTagMutation.isPending || !editTagName.trim()
                      }
                    >
                      {updateTagMutation.isPending ? '保存中...' : '保存'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}