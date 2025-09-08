import React from 'react';

// PUBLIC_INTERFACE
export default function JobTable({ jobs = [], onSelect }) {
  /** Renders job status and basic metadata. */
  return (
    <div className="card">
      <div className="card-title">Jobs</div>
      <table className="table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} onClick={() => onSelect?.(job)} style={{ cursor: 'pointer' }}>
              <td>{job.id}</td>
              <td>{job.type || '-'}</td>
              <td>{job.status || '-'}</td>
              <td>{typeof job.progress === 'number' ? `${job.progress}%` : '-'}</td>
              <td>{job.created_at ? new Date(job.created_at).toLocaleString() : '-'}</td>
            </tr>
          ))}
          {jobs.length === 0 && <tr><td colSpan="5">No jobs.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
