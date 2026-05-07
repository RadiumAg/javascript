import { generateResponse as callLLM } from '../engine/generator';

interface EditOperation {
  type: 'character_replace' | 'event_insert' | 'scene_modify';
  old_text?: string;
  new_text?: string;
  position?: string;
  content?: string;
  scene_marker?: string;
  new_scene?: string;
}

interface EditResult {
  success: boolean;
  edited_text?: string;
  applied_operations?: EditOperation[];
  error?: string;
}

interface EditHistoryEntry {
  original_text: string;
  edit_operations: EditOperation[];
  result: string;
}

function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  return match ? match[1].trim() : text.trim();
}

class DirectEdit {
  private editHistory: EditHistoryEntry[] = [];

  async forward(storyText: string, editInstructions: string): Promise<EditResult> {
    const prompt = `
当前故事文本：
${storyText}

编辑指令：${editInstructions}

请根据编辑指令生成精确的编辑操作。
返回JSON格式，包含edit_operations数组，每个操作包含：
- type: 操作类型（character_replace/event_insert/scene_modify）
- old_text: 要替换的原文（character_replace时使用）
- new_text: 新文本（character_replace时使用）
- position: 插入位置标记（event_insert时使用）
- content: 插入内容（event_insert时使用）
- scene_marker: 场景标记（scene_modify时使用）
- new_scene: 新场景内容（scene_modify时使用）
`;

    const response = await callLLM(prompt);
    const editData: { edit_operations: EditOperation[] } = JSON.parse(extractJSON(response));

    for (const op of editData.edit_operations) {
      if (!this.validateEdit(op)) {
        return { success: false, error: `无效的编辑操作：${JSON.stringify(op)}` };
      }
    }

    const editedText = this.applyEdit(storyText, editData.edit_operations);

    this.editHistory.push({
      original_text: storyText,
      edit_operations: editData.edit_operations,
      result: editedText,
    });

    return {
      success: true,
      edited_text: editedText,
      applied_operations: editData.edit_operations,
    };
  }

  private applyEdit(storyText: string, editOperations: EditOperation[]): string {
    let result = storyText;
    for (const op of editOperations) {
      switch (op.type) {
        case 'character_replace':
          result = result.replace(op.old_text!, op.new_text!);
          break;
        case 'event_insert': {
          const pos = result.indexOf(op.position!);
          if (pos !== -1) {
            result =
              result.slice(0, pos + op.position!.length) +
              op.content +
              result.slice(pos + op.position!.length);
          }
          break;
        }
        case 'scene_modify':
          result = result.replace(op.scene_marker!, op.new_scene!);
          break;
      }
    }
    return result;
  }

  private validateEdit(editOp: EditOperation): boolean {
    if (!editOp.type || !editOp.content && !editOp.new_text && !editOp.new_scene) {
      return false;
    }
    if (editOp.type === 'character_replace' && !editOp.old_text) {
      return false;
    }
    return true;
  }

  getEditHistory(): EditHistoryEntry[] {
    return [...this.editHistory];
  }
}

export { DirectEdit };
export type { EditOperation, EditResult, EditHistoryEntry };
