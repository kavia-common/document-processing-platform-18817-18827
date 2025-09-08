import React, { useState } from 'react';
import { api } from '../services/api';
import DocumentList from '../components/DocumentList';

// PUBLIC_INTERFACE
export default function SearchPage() {
  /** Search across documents with filters. */
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setBusy(true);
    setErr('');
    try {
      const params = {};
      if (vendor) params.vendor = vendor;
      if (category) params.category = category;
      if (minTotal) params.min_total = minTotal;
      if (maxTotal) params.max_total = maxTotal;
      if (from) params.from = from;
      if (to) params.to = to;
      const resp = await api.search(params);
      setResults(resp?.items || resp?.data || []);
    } catch (e) {
      setErr(e?.message || 'Search failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">Advanced Search</div>
        <div className="form-row">
          <div>
            <label className="label">Vendor</label>
            <input className="input" value={vendor} onChange={e => setVendor(e.target.value)} />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={category} onChange={e => setCategory(e.target.value)} />
          </div>
        </div>
        <div className="form-row mt-16">
          <div>
            <label className="label">Min Total</label>
            <input className="input" type="number" value={minTotal} onChange={e => setMinTotal(e.target.value)} />
          </div>
          <div>
            <label className="label">Max Total</label>
            <input className="input" type="number" value={maxTotal} onChange={e => setMaxTotal(e.target.value)} />
          </div>
        </div>
        <div className="form-row mt-16">
          <div>
            <label className="label">From</label>
            <input className="input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input className="input" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>
        <button className="btn primary mt-16" onClick={submit} disabled={busy}>{busy ? 'Searching…' : 'Search'}</button>
        {err && <div className="btn danger mt-16" role="alert">{err}</div>}
      </div>

      <DocumentList items={results} onSelect={() => {}} />
    </div>
  );
}
