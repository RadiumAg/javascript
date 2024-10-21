import { Button, Space } from 'antd';
import { useComponentsStore } from './stores/components';

function Header() {
  const { mode, setMode, setCurComponentId } = useComponentsStore();

  return (
    <div className="w-[100%] h-[100%]">
      <div className="h-[50px] flex justify-between items-center px-[20px]">
        <div>低代码编辑器</div>
        <Space>
          {mode === 'edit' && (
            <Button
              onClick={() => {
                setMode('preview');
                setCurComponentId(null);
              }}
              type="primary"
            >
              预览
            </Button>
          )}
          {mode === 'preview' && (
            <Button
              onClick={() => {
                setMode('edit');
              }}
              type="primary"
            >
              退出预览
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
}

export default Header;
