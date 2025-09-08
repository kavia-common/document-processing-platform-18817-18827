import React, { useState } from 'react';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function VersionsPage() {
  /** Fetch and display document versions by document ID. */
  const [docId, setDocId] = useState('');
  const [versions, setVersions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!docId) return;
    setBusy(true);
    setErr('');
    setSelected(null);
    try {
      const resp = await api.getDocumentVersions(docId);
      setVersions(resp?.items || resp?.data || resp || []);
    } catch (e) {
      setErr(e?.message || 'Failed to fetch versions');
    } finally {
      setBusy(false);
    }
  };

  const openVersion = async (v) => {
    try {
      const full = await api.getVersion(docId, v.id);
      setSelected(full);
    } catch {
      setSelected(v);
    }
  };

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">Document Versions</div>
        <div className="form-row">
          <div>
            <label className="label">Document ID</label>
            <input className="input" value={docId} onChange={e => setDocId(e.target.value)} placeholder="Enter document ID" />
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button className="btn" onClick={load} disabled={busy || !docId}>{busy ? 'Loading…' : 'Load'}</button>
          </div>
        </div>
        <table className="table mt-16">
          <thead><tr><th>ID</th><th>Version</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {versions.map(v => (
              <tr key={v.id} onClick={() => openVersion(v)} style={{ cursor: 'pointer' }}>
                <td>{v.id}</td>
                <td>{v.version || '-'}</td>
                <td>{v.status || '-'}</td>
                <td>{v.created_at ? new Date(v.created_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {versions.length === 0 && <tr><td colSpan="4">No versions.</td></tr>}
          </tbody>
        </table>
        {err && <div className="btn danger mt-16" role="alert">{err}</div>}
      </div>

      {selected && (
        <div className="card">
          <div className="card-title">Version Details</div>
          <pre className="textarea" style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
