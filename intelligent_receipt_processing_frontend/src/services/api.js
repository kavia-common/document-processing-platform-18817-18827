/**
 * Minimal API client for the backend.
 * Uses environment variables for configuration and injects Authorization header from AuthContext (token stored in localStorage).
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

async function request(path, { method = 'GET', headers = {}, body, isForm = false } = {}) {
  const token = localStorage.getItem('auth_token');
  const finalHeaders = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    const err = isJson ? await res.json().catch(() => ({})) : await res.text();
    throw new Error(typeof err === 'string' ? err : err.message || `Request failed: ${res.status}`);
  }

  return isJson ? res.json() : res.text();
}

// PUBLIC_INTERFACE
export const api = {
  /** AUTH */
  // PUBLIC_INTERFACE
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  // PUBLIC_INTERFACE
  me: () => request('/auth/me', { method: 'GET' }),

  /** DOCUMENTS */
  // PUBLIC_INTERFACE
  uploadDocument: (file, metadata = {}) => {
    const form = new FormData();
    form.append('file', file);
    Object.entries(metadata).forEach(([k, v]) => form.append(k, v));
    return request('/documents/upload', { method: 'POST', body: form, isForm: true });
  },
  // PUBLIC_INTERFACE
  listDocuments: (page = 1, q = '') => request(`/documents?page=${page}&q=${encodeURIComponent(q)}`, { method: 'GET' }),
  // PUBLIC_INTERFACE
  getDocument: (id) => request(`/documents/${id}`, { method: 'GET' }),
  // PUBLIC_INTERFACE
  getDocumentVersions: (id) => request(`/documents/${id}/versions`, { method: 'GET' }),
  // PUBLIC_INTERFACE
  getVersion: (docId, versionId) => request(`/documents/${docId}/versions/${versionId}`, { method: 'GET' }),
  // PUBLIC_INTERFACE
  search: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/search?${query}`, { method: 'GET' });
  },

  /** JOBS */
  // PUBLIC_INTERFACE
  listJobs: (status = '', page = 1) => request(`/jobs?status=${encodeURIComponent(status)}&page=${page}`, { method: 'GET' }),
  // PUBLIC_INTERFACE
  getJob: (id) => request(`/jobs/${id}`, { method: 'GET' }),

  /** ADMIN */
  // PUBLIC_INTERFACE
  getSystemStats: () => request('/admin/stats', { method: 'GET' }),
  // PUBLIC_INTERFACE
  listUsers: () => request('/admin/users', { method: 'GET' }),
};
