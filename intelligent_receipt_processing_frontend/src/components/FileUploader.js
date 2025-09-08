import React, { useCallback, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function FileUploader({ onFilesSelected, accept = '.pdf,image/*', multiple = true }) {
  /** Drag & drop file uploader component. */
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length) {
      onFilesSelected(Array.from(files));
    }
  }, [onFilesSelected]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${dragOver ? 'var(--brand)' : 'var(--border-color)'}`,
        padding: 24,
        borderRadius: 12,
        textAlign: 'center',
        background: 'var(--card-bg)'
      }}
    >
      <p className="mb-8">Drag & drop receipts or documents here, or</p>
      <button className="btn primary" onClick={() => inputRef.current?.click()}>Browse files</button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) onFilesSelected(Array.from(files));
        }}
      />
    </div>
  );
}
