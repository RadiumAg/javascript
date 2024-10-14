import React from 'react';
import MonacoEditor, { EditorProps, OnMount } from '@monaco-editor/react';

export interface EditorFile {
  name: string;
  value: string;
  language: string;
}

interface Props {
  value: string;
  options?: EditorProps['options'];
  onChange: EditorProps['onChange'];
}

const CssEditor: React.FC<Props> = (props) => {
  const { value, onChange, options } = props;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });
  };

  return (
    <MonacoEditor
      height="100%"
      path="component.css"
      language="css"
      onChange={onChange}
      onMount={handleEditorMount}
      value={value}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options,
      }}
    ></MonacoEditor>
  );
};

export default CssEditor;
