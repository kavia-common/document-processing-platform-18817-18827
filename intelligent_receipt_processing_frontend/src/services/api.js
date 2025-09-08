/**
 * Minimal API client for the backend.
 * Uses environment variables for configuration and injects Authorization header from localStorage.
 * Aligns with provided OpenAPI:
 * - Auth: POST /auth/login returns { access_token }
 * - Documents: POST /documents (multipart/form-data), GET /documents returns array
 * - Search: GET /search returns array, params: q, category, tag, limit, offset
 * - Jobs: GET /jobs returns array
 * - Admin: GET /admin/documents, GET /admin/jobs
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Core HTTP request wrapper with Authorization header and JSON/form support.
 */
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

/**
 * Normalize backend responses that may either be arrays or wrapped objects.
 * Returns array in all cases.
 */
function normalizeArrayResponse(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp?.items && Array.isArray(resp.items)) return resp.items;
  if (resp?.data && Array.isArray(resp.data)) return resp.data;
  return Array.isArray(resp?.results) ? resp.results : [];
}

// PUBLIC_INTERFACE
export const api = {
  /** AUTH */
  // PUBLIC_INTERFACE
  login: async (email, password) => {
    const resp = await request('/auth/login', { method: 'POST', body: { email, password } });
    // Backend returns { access_token }
    return resp;
  },

  // PUBLIC_INTERFACE
  getProfile: async () => {
    // Fallback: Backend spec has no /auth/me. We may not be able to fetch a profile.
    // Return a minimal object so UI can display something when token is present.
    const email = localStorage.getItem('auth_email');
    return { email, name: email || 'User' };
  },

  /** DOCUMENTS */
  // PUBLIC_INTERFACE
  uploadDocument: (file, metadata = {}) => {
    // Backend expects POST /documents with multipart/form-data containing:
    // - file (binary)
    // - title (required)
    // - optional: description, tags (string)
    const form = new FormData();
    form.append('file', file);

    // Title is required; if not provided in metadata, derive from filename.
    const derivedTitle = metadata.title || file.name || 'Document';
    form.append('title', derivedTitle);

    if (metadata.description) form.append('description', metadata.description);
    // Map category/vendor/note to tags/description where possible
    const tags = metadata.tags
      || [metadata.category, metadata.vendor].filter(Boolean).join(', ')
      || '';
    if (tags) form.append('tags', tags);
    if (metadata.note && !metadata.description) form.append('description', metadata.note);

    return request('/documents', { method: 'POST', body: form, isForm: true });
  },

  // PUBLIC_INTERFACE
  listDocuments: async (page = 1, q = '') => {
    // Spec lists GET /documents returning array; tolerate optional q/page if backend supports.
    const query = new URLSearchParams({});
    if (q) query.set('q', q);
    if (page) query.set('page', String(page));
    const path = query.toString() ? `/documents?${query.toString()}` : '/documents';
    const resp = await request(path, { method: 'GET' });
    return normalizeArrayResponse(resp);
  },

  // PUBLIC_INTERFACE
  getDocument: (id) => request(`/documents/${id}`, { method: 'GET' }),

  // PUBLIC_INTERFACE
  getDocumentVersions: async (id) => {
    const resp = await request(`/documents/${id}/versions`, { method: 'GET' });
    return normalizeArrayResponse(resp);
  },

  // PUBLIC_INTERFACE
  getVersion: (docId, versionId) => request(`/documents/${docId}/versions/${versionId}`, { method: 'GET' }),

  // PUBLIC_INTERFACE
  search: async (params) => {
    // Align with spec: q, category, tag, limit, offset
    const supported = {};
    if (params.q) supported.q = params.q;
    if (params.category) supported.category = params.category;
    if (params.tag) supported.tag = params.tag;
    if (params.limit) supported.limit = params.limit;
    if (params.offset) supported.offset = params.offset;

    const query = new URLSearchParams(supported).toString();
    const resp = await request(`/search${query ? `?${query}` : ''}`, { method: 'GET' });
    return normalizeArrayResponse(resp);
  },

  /** JOBS */
  // PUBLIC_INTERFACE
  listJobs: async (status = '', page = 1) => {
    // Spec: GET /jobs returns array. Pass status/page if backend supports; ignore otherwise.
    const params = new URLSearchParams({});
    if (status) params.set('status', status);
    if (page) params.set('page', String(page));
    const path = params.toString() ? `/jobs?${params.toString()}` : '/jobs';
    const resp = await request(path, { method: 'GET' });
    return normalizeArrayResponse(resp);
  },

  // PUBLIC_INTERFACE
  getJob: (id) => request(`/jobs/${id}`, { method: 'GET' }),

  /** ADMIN */
  // PUBLIC_INTERFACE
  listAllDocuments: async () => {
    const resp = await request('/admin/documents', { method: 'GET' });
    return normalizeArrayResponse(resp);
    // Note: Requires admin token
  },

  // PUBLIC_INTERFACE
  listAllJobs: async () => {
    const resp = await request('/admin/jobs', { method: 'GET' });
    return normalizeArrayResponse(resp);
    // Note: Requires admin token
  },
};
