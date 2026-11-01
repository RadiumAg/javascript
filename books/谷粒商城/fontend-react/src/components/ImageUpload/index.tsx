import { useEffect, useState } from 'react';
import { Image, Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { cosSignatureUrl, imageUploadUrl } from '@/api/renren';
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

  // 上传策略：先向后端要 COS 直传签名（secretKey 不出服务器），浏览器把文件直接 PUT 到 COS；
  // 后端未配 COS 或直传失败时，回退到 /sys/upload/image 由后端转发
  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;
    const f = file as File;
    const ext = f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.') + 1).toLowerCase() : '';

    const reportProgress = (e: ProgressEvent) => {
      if (e.lengthComputable) onProgress?.({ percent: (e.loaded / e.total) * 100 });
    };

    const uploadViaServer = () => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', imageUploadUrl());
      xhr.upload.onprogress = reportProgress;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            onSuccess?.(JSON.parse(xhr.responseText));
          } catch {
            onSuccess?.({});
          }
        } else {
          onError?.(new Error(`上传失败 HTTP ${xhr.status}`));
        }
      };
      xhr.onerror = () => onError?.(new Error('上传网络错误'));
      const fd = new FormData();
      fd.append('file', f);
      xhr.send(fd);
    };

    try {
      const res = await fetch(`${cosSignatureUrl()}&ext=${encodeURIComponent(ext)}`);
      const ticket = (await res.json()) as {
        code?: number;
        url?: string;
        uploadUrl?: string;
        authorization?: string;
      };
      if (ticket?.code === 0 && ticket.uploadUrl && ticket.authorization && ticket.url) {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', ticket.uploadUrl as string);
          xhr.setRequestHeader('Authorization', ticket.authorization as string);
          if (f.type) xhr.setRequestHeader('Content-Type', f.type);
          xhr.upload.onprogress = reportProgress;
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`COS 直传失败 HTTP ${xhr.status}`));
          xhr.onerror = () => reject(new Error('COS 直传网络错误'));
          xhr.send(f);
        });
        onSuccess?.({ code: 0, url: ticket.url });
        return;
      }
    } catch {
      // 拿签名失败（后端未配 COS / 网络错误）：走回退
    }
    uploadViaServer();
  };

  const resolvePreviewUrl = (file: UploadFile) =>
    file.url || (file.response as { url?: string } | undefined)?.url || file.thumbUrl || '';

  return (
    <>
      <Upload
        listType="picture-card"
        accept={accept}
        fileList={fileList}
        maxCount={1}
        disabled={disabled}
        showUploadList={{ showRemoveIcon: !disabled }}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
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
