import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import DocumentList from '../components/DocumentList';
import DocumentViewer from '../components/DocumentViewer';

// PUBLIC_INTERFACE
export default function DocumentsPage() {
  /** List documents and show selected processed data. */
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const resp = await api.listDocuments(1, q);
      setDocs(resp?.items || resp?.data || []);
    } catch (e) {
      setErr(e?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const selectDoc = async (doc) => {
    try {
      const full = await api.getDocument(doc.id);
      setSelected(full);
    } catch {
      setSelected(doc);
    }
  };

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">Browse Documents</div>
        <div className="form-row mb-16">
          <div>
            <label className="label">Search</label>
            <input className="input" placeholder="Search by vendor, amount, etc." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button className="btn" onClick={load}>Search</button>
          </div>
        </div>
        {loading ? <div>Loading…</div> : <DocumentList items={docs} onSelect={selectDoc} />}
        {err && <div className="btn danger mt-16" role="alert">{err}</div>}
      </div>

      {selected && <DocumentViewer document={selected} />}
    </div>
  );
}
