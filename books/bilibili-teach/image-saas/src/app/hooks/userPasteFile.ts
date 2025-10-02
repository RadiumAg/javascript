import { useEffect } from 'react';

const usePasteFile = ({}: {}) => {
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
    };

    document.body.addEventListener('paste', pasteHandler);

    return () => {
      document.body.removeEventListener('paste', pasteHandler);
    };
  }, []);
};

export { usePasteFile };
