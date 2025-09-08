import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function UploadPage() {
  /** Page for uploading receipts/documents. */
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [note, setNote] = useState('');
  const [uploads, setUploads] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFilesSelected = (files) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadAll = async () => {
    setBusy(true);
    setError('');
    try {
      const promises = selectedFiles.map(async (file) => {
        // Map UI fields to API metadata. Title is derived in api.uploadDocument.
        const meta = { category, vendor, note };
        const resp = await api.uploadDocument(file, meta);
        return { fileName: file.name, status: 'Uploaded', id: resp?.id, job_id: resp?.job_id };
      });
      const results = await Promise.all(promises);
      setUploads(results);
      setSelectedFiles([]);
    } catch (err) {
      setError(err?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="row">
      <div className="card">
        <div className="card-title">Upload Documents</div>
        <FileUploader onFilesSelected={onFilesSelected} />
        {selectedFiles.length > 0 && (
          <div className="mt-16">
            <div className="card-title">Selected</div>
            <table className="table">
              <thead><tr><th>Name</th><th>Size</th><th /></tr></thead>
              <tbody>
                {selectedFiles.map((f, i) => (
                  <tr key={i}>
                    <td>{f.name}</td>
                    <td>{(f.size/1024).toFixed(1)} KB</td>
                    <td><button className="btn danger" onClick={() => removeFile(i)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="form-row mt-16">
              <div>
                <label className="label">Category</label>
                <input className="input" placeholder="e.g. Meals" value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div>
                <label className="label">Vendor</label>
                <input className="input" placeholder="e.g. Starbucks" value={vendor} onChange={e => setVendor(e.target.value)} />
              </div>
            </div>
            <div className="mt-16">
              <label className="label">Note</label>
              <textarea className="textarea" rows="3" placeholder="Optional note" value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <button className="btn primary mt-16" disabled={busy} onClick={uploadAll}>
              {busy ? 'Uploading…' : `Upload ${selectedFiles.length} file(s)`}
            </button>
            {error && <div className="btn danger mt-16" role="alert">{error}</div>}
          </div>
        )}
      </div>

      {uploads.length > 0 && (
        <div className="card">
          <div className="card-title">Upload Results</div>
          <table className="table">
            <thead><tr><th>File</th><th>Status</th><th>Document ID</th><th>Job ID</th></tr></thead>
            <tbody>
              {uploads.map((u, i) => (
                <tr key={i}>
                  <td>{u.fileName}</td>
                  <td>{u.status}</td>
                  <td>{u.id || '-'}</td>
                  <td>{u.job_id || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
