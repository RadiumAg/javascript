import { useEffect, useState } from 'react';
import { Image, Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { ossUploadUrl } from '@/api/renren';
import { message } from '@/api/feedback';

type ImageUploadValue = string | undefined | null;

export type ImageUploadProps = {
  value?: ImageUploadValue;
  onChange?: (url: string) => void;
  disabled?: boolean;
  /** 最大文件大小，单位 MB，默认 2 */
  maxSize?: number;
  accept?: string;
};

function toFileList(value: ImageUploadValue): UploadFile[] {
  if (!value) return [];
  return [
    {
      uid: `img-${value}`,
      name: value.slice(value.lastIndexOf('/') + 1) || 'image',
      status: 'done',
      url: value,
    },
  ];
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  maxSize = 2,
  accept = 'image/*',
}: ImageUploadProps) {
  const readonly = !onChange;
  const [fileList, setFileList] = useState<UploadFile[]>(() => toFileList(value));
  const [preview, setPreview] = useState<{ open: boolean; url: string }>({
    open: false,
    url: '',
  });

  useEffect(() => {
    setFileList(toFileList(value));
  }, [value]);

  if (readonly) {
    return value ? (
      <Image
        src={value}
        width={40}
        height={40}
        style={{ objectFit: 'contain' }}
      />
    ) : (
      <span>-</span>
    );
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);

    const { file } = info;
    if (file.status === 'done') {
      const res = file.response as { code?: number; url?: string; msg?: string } | undefined;
      if (res?.code === 0 && res.url) {
        onChange(res.url);
      } else {
        message.error(res?.msg || '上传失败');
        setFileList(toFileList(value));
      }
    } else if (file.status === 'error') {
      message.error(file.error?.message || '上传失败');
    } else if (file.status === 'removed') {
      onChange('');
    }
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!file.type?.startsWith('image/')) {
      message.error('只能上传图片文件');
      return Upload.LIST_IGNORE as unknown as boolean;
    }
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`图片大小不能超过 ${maxSize}MB`);
      return Upload.LIST_IGNORE as unknown as boolean;
    }
    return true;
  };

  const resolvePreviewUrl = (file: UploadFile) =>
    file.url || (file.response as { url?: string } | undefined)?.url || file.thumbUrl || '';

  return (
    <>
      <Upload
        action={ossUploadUrl()}
        name="file"
        listType="picture-card"
        accept={accept}
        fileList={fileList}
        maxCount={1}
        disabled={disabled}
        showUploadList={{ showRemoveIcon: !disabled }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={(file) => setPreview({ open: true, url: resolvePreviewUrl(file) })}
      >
        {fileList.length >= 1 || disabled ? null : (
          <button type="button" style={{ border: 0, background: 'none' }}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </button>
        )}
      </Upload>
      <Modal
        open={preview.open}
        footer={null}
        onCancel={() => setPreview((s) => ({ ...s, open: false }))}
      >
        <Image src={preview.url} style={{ width: '100%' }} preview={false} />
      </Modal>
    </>
  );
}
