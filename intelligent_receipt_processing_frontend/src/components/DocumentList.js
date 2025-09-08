import React from 'react';

// PUBLIC_INTERFACE
export default function DocumentList({ items = [], onSelect }) {
  /** Renders a table of documents. */
  return (
    <div className="card">
      <div className="card-title">Documents</div>
      <table className="table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Type</th>
            <th>Status</th>
            <th>Total</th>
            <th>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {items.map(doc => (
            <tr key={doc.id} onClick={() => onSelect?.(doc)} style={{ cursor: 'pointer' }}>
              <td>{doc.filename || doc.title || `#${doc.id}`}</td>
              <td>{doc.type || 'Receipt'}</td>
              <td>{doc.status || 'Processed'}</td>
              <td>{doc.total ? `$${doc.total.toFixed?.(2) ?? doc.total}` : '-'}</td>
              <td>{doc.created_at ? new Date(doc.created_at).toLocaleString() : '-'}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="5">No documents found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
