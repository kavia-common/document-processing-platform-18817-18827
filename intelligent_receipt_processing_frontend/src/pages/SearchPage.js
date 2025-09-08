import React, { useState } from 'react';
import { api } from '../services/api';
import DocumentList from '../components/DocumentList';

// PUBLIC_INTERFACE
export default function SearchPage() {
  /** Search across documents with filters (aligned to backend spec). */
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [limit, setLimit] = useState('');
  const [offset, setOffset] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setBusy(true);
    setErr('');
    try {
      const params = {};
      if (q) params.q = q;
      if (category) params.category = category;
      if (tag) params.tag = tag;
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      const items = await api.search(params);
      setResults(items || []);
    } catch (e) {
      setErr(e?.message || 'Search failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">Search</div>
        <div className="form-row">
          <div>
            <label className="label">Query</label>
            <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="keywords..." />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={category} onChange={e => setCategory(e.target.value)} placeholder="category" />
          </div>
        </div>
        <div className="form-row mt-16">
          <div>
            <label className="label">Tag</label>
            <input className="input" value={tag} onChange={e => setTag(e.target.value)} placeholder="tag" />
          </div>
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Limit</label>
              <input className="input" type="number" value={limit} onChange={e => setLimit(e.target.value)} />
            </div>
            <div>
              <label className="label">Offset</label>
              <input className="input" type="number" value={offset} onChange={e => setOffset(e.target.value)} />
            </div>
          </div>
        </div>
        <button className="btn primary mt-16" onClick={submit} disabled={busy}>{busy ? 'Searching…' : 'Search'}</button>
        {err && <div className="btn danger mt-16" role="alert">{err}</div>}
      </div>

      <DocumentList items={results} onSelect={() => {}} />
    </div>
  );
}
