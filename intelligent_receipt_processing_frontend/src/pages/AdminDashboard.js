import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Displays system stats and user list for admins. */
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    setErr('');
    try {
      const [st, us] = await Promise.all([api.getSystemStats(), api.listUsers()]);
      setStats(st);
      setUsers(us?.items || us?.data || us || []);
    } catch (e) {
      setErr(e?.message || 'Failed to load admin data');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">System Stats</div>
        {!stats ? <div>Loading…</div> : (
          <div className="row cols-3">
            <div className="card">
              <div className="card-title">Documents</div>
              <div>{stats.documents_total ?? '-'}</div>
            </div>
            <div className="card">
              <div className="card-title">Jobs (Pending)</div>
              <div>{stats.jobs_pending ?? '-'}</div>
            </div>
            <div className="card">
              <div className="card-title">Users</div>
              <div>{stats.users_total ?? '-'}</div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Users</div>
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id || u.email}>
                <td>{u.id || '-'}</td>
                <td>{u.name || '-'}</td>
                <td>{u.email || '-'}</td>
                <td>{u.role || '-'}</td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="4">No users.</td></tr>}
          </tbody>
        </table>
        {err && <div className="btn danger mt-16" role="alert">{err}</div>}
      </div>
    </div>
  );
}
