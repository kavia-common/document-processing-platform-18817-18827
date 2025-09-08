import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Displays system stats (derived) and lists admin data. */
  const [documents, setDocuments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setErr('');
    setLoading(true);
    try {
      const [docs, js] = await Promise.all([
        api.listAllDocuments().catch(() => []),
        api.listAllJobs().catch(() => []),
      ]);
      setDocuments(docs);
      setJobs(js);
    } catch (e) {
      setErr(e?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const jobsPending = jobs.filter(j => (j.status || j.task_status || '').toLowerCase() === 'queued').length
    + jobs.filter(j => (j.status || j.task_status || '').toLowerCase() === 'processing').length;

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">System Stats</div>
        {loading ? <div>Loading…</div> : (
          <div className="row cols-3">
            <div className="card">
              <div className="card-title">Documents</div>
              <div>{documents.length}</div>
            </div>
            <div className="card">
              <div className="card-title">Jobs (Queued/Processing)</div>
              <div>{jobsPending}</div>
            </div>
            <div className="card">
              <div className="card-title">Jobs (Total)</div>
              <div>{jobs.length}</div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Recent Jobs</div>
        <table className="table">
          <thead><tr><th>ID</th><th>Document</th><th>Status</th><th>Type</th><th>Created</th></tr></thead>
          <tbody>
            {jobs.slice(0, 15).map(j => (
              <tr key={j.id}>
                <td>{j.id}</td>
                <td>{j.document_id || '-'}</td>
                <td>{j.status || '-'}</td>
                <td>{j.task_type || '-'}</td>
                <td>{j.created_at ? new Date(j.created_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {jobs.length === 0 && <tr><td colSpan="5">No jobs.</td></tr>}
          </tbody>
        </table>
        {err && <div className="btn danger mt-16" role="alert">{err}</div>}
      </div>

      <div className="card">
        <div className="card-title">Recent Documents</div>
        <table className="table">
          <thead><tr><th>ID</th><th>Title</th><th>Filename</th><th>Created</th></tr></thead>
          <tbody>
            {documents.slice(0, 15).map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.title || '-'}</td>
                <td>{d.filename || '-'}</td>
                <td>{d.created_at ? new Date(d.created_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {documents.length === 0 && <tr><td colSpan="4">No documents.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
