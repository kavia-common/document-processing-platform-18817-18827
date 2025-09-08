import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import JobTable from '../components/JobTable';

// PUBLIC_INTERFACE
export default function JobsPage() {
  /** Monitor jobs with optional status filter. */
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setBusy(true);
    setErr('');
    try {
      const resp = await api.listJobs(status, 1);
      setJobs(resp?.items || resp?.data || []);
    } catch (e) {
      setErr(e?.message || 'Failed to load jobs');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">Job Monitor</div>
        <div className="form-row">
          <div>
            <label className="label">Status</label>
            <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="queued">Queued</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button className="btn" onClick={load} disabled={busy}>{busy ? 'Loading…' : 'Refresh'}</button>
          </div>
        </div>
      </div>

      <JobTable jobs={jobs} onSelect={() => {}} />
      {err && <div className="btn danger mt-16" role="alert">{err}</div>}
    </div>
  );
}
