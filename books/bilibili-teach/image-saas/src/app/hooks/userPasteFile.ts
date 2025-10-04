import { useEffect } from 'react';

const usePasteFile = ({
  onFilePaste,
}: {
  onFilePaste: (files: File[]) => void;
}) => {
  useEffect(() => {
    const pasteHandler = (event: ClipboardEvent) => {
      const files: File[] = [];
      if (event.clipboardData == null) return;

      Array.from(event.clipboardData.items).forEach((item) => {
        const f = item.getAsFile();
        if (f) {
          files.push(f);
        }
      });

      if (files.length > 0) {
        onFilePaste(files);
      }
    };

    document.body.addEventListener('paste', pasteHandler);

    return () => {
      document.body.removeEventListener('paste', pasteHandler);
    };
  }, [onFilePaste]);
};

export { usePasteFile };
