import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const { loading, error, request } = useApi();
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createError, setCreateError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all documents on mount
  const fetchDocuments = async () => {
    try {
      const data = await request('/api/documents', { method: 'GET' });
      if (Array.isArray(data)) {
        setDocuments(data);
      } else if (data && Array.isArray(data.documents)) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [request]);

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setCreateError(null);

    if (!title.trim()) {
      setCreateError('Document title is required');
      return;
    }

    setCreateLoading(true);
    try {
      const newDoc = await request('/api/documents', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      });
      
      // Clear form
      setTitle('');
      setContent('');
      
      // Refresh list or navigate directly to the new document
      if (newDoc && newDoc._id) {
        navigate(`/document/${newDoc._id}`);
      } else {
        await fetchDocuments();
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create document');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Header bar */}
      <header className="header-bar">
        <Link to="/" className="brand">
          📄 CollabDoc
        </Link>
        <div className="user-status">
          <span className="username">👋 {user?.username}</span>
          <button onClick={handleLogoutClick} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {/* Main Home Layout */}
      <main className="home-layout">
        {/* Left Column: Create Form */}
        <section className="glass-card">
          <h2 className="section-title">✨ Create New Document</h2>
          
          {createError && (
            <div className="api-error-alert" role="alert">
              <span>⚠️</span> {createError}
            </div>
          )}

          <form onSubmit={handleCreateDocument}>
            <div className="form-group">
              <label className="form-label" htmlFor="doc-title">Document Title</label>
              <input
                type="text"
                id="doc-title"
                className="form-input"
                placeholder="Enter document title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createLoading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="doc-content">Content (Optional)</label>
              <textarea
                id="doc-content"
                className="form-textarea"
                placeholder="Start writing your document..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createLoading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={createLoading} style={{ width: '100%' }}>
              {createLoading ? 'Creating...' : 'Create Document'}
            </button>
          </form>
        </section>

        {/* Right Column: Documents List */}
        <section className="glass-card">
          <h2 className="section-title">📂 Your Documents</h2>

          {loading && documents.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="api-error-alert" role="alert">
              <span>⚠️</span> Error fetching documents: {error}
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No documents found. Create one on the left to get started!
            </div>
          ) : (
            <ul className="document-list">
              {documents.map((doc) => {
                // Check if user is owner
                const isOwner =
                  doc.owner === user?.userId ||
                  doc.owner?._id === user?.userId ||
                  doc.owner?.username === user?.username ||
                  (typeof doc.owner === 'object' && String(doc.owner) === user?.userId);

                return (
                  <li key={doc._id} className="document-item">
                    <Link to={`/document/${doc._id}`} className="doc-link">
                      {doc.title}
                    </Link>
                    <span className={`badge ${isOwner ? 'badge-owner' : 'badge-collaborator'}`}>
                      {isOwner ? 'Owner' : 'Collaborator'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
