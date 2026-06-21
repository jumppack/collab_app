import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export const DocumentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { loading, error, request } = useApi();
  
  // Document editing states
  const [doc, setDoc] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  // Collaborator sharing states
  const [shareUsername, setShareUsername] = useState('');
  const [shareStatus, setShareStatus] = useState(null); // 'sharing', 'shared', 'error'
  const [shareErrorMsg, setShareErrorMsg] = useState('');

  // Fetch document details on mount/ID change
  const fetchDocument = async () => {
    try {
      const data = await request(`/api/documents/${id}`, { method: 'GET' });
      if (data) {
        setDoc(data);
        setTitle(data.title || '');
        setContent(data.content || '');
      }
    } catch (err) {
      console.error('Failed to load document:', err);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id, request]);

  // Determine if current user is owner
  const isOwner = doc && (
    // TODO: Practice Task - Verify if the logged-in user is the owner
    // Compare doc.owner (which could be a string ID, or an object containing _id or username)
    // with user.userId or user.username.
    
    // Partial code structure:
    doc.owner === user?.userId ||
    doc.owner?._id === user?.userId
  );

  // Determine if current user has access (either owner or collaborator)
  const hasAccess = doc && (
    // TODO: Practice Task - Check if the user is authorized to view/edit
    // The user has access if they are the owner OR if their userId or username is present
    // in the doc.collaborators array.
    
    // Partial code structure:
    isOwner ||
    (Array.isArray(doc.collaborators) &&
      doc.collaborators.some((collab) => {
        // Return true if collab (as string ID or object containing _id or username) matches user
        return false; // Replace with actual check
      }))
  );

  // Handle Save (Title + Content update)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setSaveErrorMsg('');

    try {
      // TODO: Practice Task - Perform the PUT request to save the document details
      // 1. Call `request` with path `/api/documents/${id}`
      // 2. Set method to 'PUT' and send JSON-stringified body containing `{ title, content }`
      // 3. Keep the state updates for the updated document below.
      
      // Partial code structure:
      const updated = null; // Replace with await request(...)
      if (updated) {
        setDoc(updated);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err) {
      setSaveStatus('error');
      setSaveErrorMsg(err.message || 'Failed to save document');
    }
  };

  // Handle Share (add new collaborator by username)
  const handleShare = async (e) => {
    e.preventDefault();
    if (!shareUsername.trim()) {
      setShareStatus('error');
      setShareErrorMsg('Username is required');
      return;
    }

    setShareStatus('sharing');
    setShareErrorMsg('');

    try {
      const result = await request(`/api/documents/${id}/share`, {
        method: 'POST',
        body: JSON.stringify({ username: shareUsername }),
      });
      
      setShareStatus('shared');
      setShareUsername('');
      
      // Refresh document details to update collaborators list
      await fetchDocument();
      
      setTimeout(() => setShareStatus(null), 3000);
    } catch (err) {
      setShareStatus('error');
      setShareErrorMsg(err.message || 'Failed to add collaborator');
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // 1. Loading screen
  if (loading && !doc) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading-screen">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading document details...</p>
        </div>
      </div>
    );
  }

  // 2. Error or document not found
  if (error && !doc) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="error-screen">
          <h2 className="error-message">⚠️ Error Loading Document</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // 3. No document object loaded yet
  if (!doc) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="error-screen">
          <h2>📄 Document Not Found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>We couldn't retrieve the document details.</p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // 4. Access Denied (enforce frontend auth access rules)
  if (!hasAccess) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="error-screen">
          <h2 className="error-message">🚫 Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem 0' }}>
            You do not have permission to view or edit this document.
          </p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Back to Home Link */}
      <Link to="/" className="link-back">
        ⬅️ Back to Home
      </Link>

      <div className="document-layout">
        {/* Left Column: Editor Section */}
        <section className="glass-card editor-card">
          <h2 className="section-title">📝 Edit Document</h2>
          
          {saveStatus === 'error' && (
            <div className="api-error-alert" role="alert">
              <span>⚠️</span> {saveErrorMsg}
            </div>
          )}

          {saveStatus === 'saved' && (
            <div className="api-success-alert" role="alert">
              <span>✅</span> Document saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">Title</label>
              <input
                type="text"
                id="edit-title"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saveStatus === 'saving'}
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" htmlFor="edit-content">Content</label>
              <textarea
                id="edit-content"
                className="form-textarea"
                style={{ flex: 1, minHeight: '300px' }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={saveStatus === 'saving'}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saveStatus === 'saving'}
              style={{ alignSelf: 'flex-start' }}
            >
              {saveStatus === 'saving' ? 'Saving changes...' : 'Save Document'}
            </button>
          </form>
        </section>

        {/* Right Column: Collaborators and Info Section */}
        <div className="sidebar-card">
          {/* Share Section (Only visible to the owner) */}
          {isOwner ? (
            <section className="glass-card">
              <h3 className="section-title" style={{ fontSize: '1.15rem' }}>👥 Share Document</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Add another user as a collaborator to co-edit this document.
              </p>

              {shareStatus === 'error' && (
                <div className="api-error-alert" role="alert">
                  <span>⚠️</span> {shareErrorMsg}
                </div>
              )}

              {shareStatus === 'shared' && (
                <div className="api-success-alert" role="alert">
                  <span>✅</span> User added successfully!
                </div>
              )}

              <form onSubmit={handleShare}>
                <div className="form-group">
                  <label className="form-label" htmlFor="share-username">Collaborator Username</label>
                  <div className="share-form">
                    <input
                      type="text"
                      id="share-username"
                      className="form-input"
                      placeholder="Username..."
                      value={shareUsername}
                      onChange={(e) => setShareUsername(e.target.value)}
                      disabled={shareStatus === 'sharing'}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={shareStatus === 'sharing'}
                    >
                      {shareStatus === 'sharing' ? 'Sharing...' : 'Share'}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          ) : (
            <section className="glass-card">
              <h3 className="section-title" style={{ fontSize: '1.15rem' }}>👥 Collaborators</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Only the document owner can share or add collaborators.
              </p>
            </section>
          )}

          {/* Collaborator List Section */}
          <section className="glass-card">
            <h3 className="section-title" style={{ fontSize: '1.15rem' }}>👥 Current Collaborators</h3>
            {doc.collaborators && doc.collaborators.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
                No collaborators added yet.
              </p>
            ) : (
              <div className="collaborators-list">
                {doc.collaborators && doc.collaborators.map((collab, index) => {
                  const name = typeof collab === 'object' ? (collab.username || collab._id) : collab;
                  return (
                    <div key={index} className="collaborator-tag">
                      <span className="collaborator-name">👤 {name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
