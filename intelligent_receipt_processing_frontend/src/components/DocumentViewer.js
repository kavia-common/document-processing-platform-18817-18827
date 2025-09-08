import React from 'react';

// PUBLIC_INTERFACE
export default function DocumentViewer({ document }) {
  /** Displays processed details of a selected document. */
  if (!document) return null;
  const fields = document.fields || {};
  const categories = document.categories || [];

  return (
    <div className="card">
      <div className="card-title">Processed Details</div>
      <div className="row cols-2">
        <div className="card">
          <div className="card-title">Key Fields</div>
          <table className="table">
            <tbody>
              {Object.entries(fields).map(([k, v]) => (
                <tr key={k}><td style={{ width: 160, color: 'var(--text-muted)' }}>{k}</td><td>{String(v)}</td></tr>
              ))}
              {Object.keys(fields).length === 0 && <tr><td colSpan="2">No extracted fields.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-title">Categories</div>
          <div>
            {categories.length ? categories.map((c, i) => (
              <span key={i} className="btn" style={{ marginRight: 8, marginBottom: 8 }}>{c}</span>
            )) : <span>No categories.</span>}
          </div>
        </div>
      </div>
      {document.ocr_text && (
        <div className="card mt-16">
          <div className="card-title">OCR Text</div>
          <div className="textarea" style={{ whiteSpace: 'pre-wrap' }}>{document.ocr_text}</div>
        </div>
      )}
    </div>
  );
}
