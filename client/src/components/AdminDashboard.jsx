import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config';
import { Download, Users, UserCheck, UserX, Lock, LogOut, Clipboard } from 'lucide-react';

const AdminDashboard = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalAttending: 0,
    totalDeclined: 0,
    totalGuests: 0
  });
  const [rsvpList, setRsvpList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if passcode is saved in session
  useEffect(() => {
    const savedPasscode = sessionStorage.getItem('admin_passcode');
    if (savedPasscode) {
      verifyAndFetch(savedPasscode);
    }
  }, []);

  const verifyAndFetch = async (codeToVerify) => {
    setLoading(true);
    setLoginError('');
    try {
      // Test fetching stats to verify passcode
      const statsResponse = await fetch(`${CONFIG.apiBaseUrl}/rsvp/admin/stats`, {
        headers: {
          'x-admin-password': codeToVerify
        }
      });

      const statsData = await statsResponse.json();

      if (statsData.success) {
        setStats(statsData.data);
        sessionStorage.setItem('admin_passcode', codeToVerify);
        setPasscode(codeToVerify);
        setIsAuthorized(true);

        // Fetch list as well
        const listResponse = await fetch(`${CONFIG.apiBaseUrl}/rsvp/admin/list`, {
          headers: {
            'x-admin-password': codeToVerify
          }
        });
        const listData = await listResponse.json();
        if (listData.success) {
          setRsvpList(listData.data);
        }
      } else {
        setLoginError('Invalid passcode. Please try again.');
        setIsAuthorized(false);
        sessionStorage.removeItem('admin_passcode');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setLoginError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyAndFetch(passcode.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_passcode');
    setIsAuthorized(false);
    setPasscode('');
    setRsvpList([]);
  };

  // Convert RSVP array to CSV and trigger file download
  const exportToCSV = () => {
    if (rsvpList.length === 0) return;

    const headers = ['Name', 'Phone', 'Email', 'Attending', 'Guests', 'Wish/Blessing', 'Created At'];
    const rows = rsvpList.map(item => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.phone}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      item.attending ? 'Yes' : 'No',
      item.guests,
      `"${(item.wish || '').replace(/"/g, '""')}"`,
      new Date(item.createdAt).toLocaleString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `house_warming_rsvp_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthorized) {
    return (
      <div className="admin-login-card glass-panel">
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
          <Lock size={40} />
        </div>
        <h2>Host Dashboard</h2>
        <p>Enter the administrator passcode to view RSVPs and statistics.</p>
        
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-code">Passcode</label>
            <input
              type="password"
              id="admin-code"
              className="form-input"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
            />
          </div>

          {loginError && (
            <div className="submit-status-msg error" style={{ margin: 0 }}>
              {loginError}
            </div>
          )}

          <button type="submit" className="gold-btn" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="gold-text" style={{ fontSize: '2.4rem' }}>Host Control Panel</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Real-time RSVP analytics & guest list manager
          </p>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {/* Grid of Key Statistics */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
            <Clipboard size={22} />
          </div>
          <div className="admin-stat-value">{stats.totalSubmissions}</div>
          <div className="admin-stat-label">Total Responses</div>
        </div>

        <div className="admin-stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'center', color: '#2ed573', marginBottom: '0.75rem' }}>
            <UserCheck size={22} />
          </div>
          <div className="admin-stat-value">{stats.totalAttending}</div>
          <div className="admin-stat-label">Attending RSVPs</div>
        </div>

        <div className="admin-stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'center', color: '#ff4757', marginBottom: '0.75rem' }}>
            <UserX size={22} />
          </div>
          <div className="admin-stat-value">{stats.totalDeclined}</div>
          <div className="admin-stat-label">Declined RSVPs</div>
        </div>

        <div className="admin-stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-gold-light)', marginBottom: '0.75rem' }}>
            <Users size={22} />
          </div>
          <div className="admin-stat-value">{stats.totalGuests}</div>
          <div className="admin-stat-label">Total Guests coming</div>
        </div>
      </div>

      {/* Guest List Header & Export Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.6rem' }}>Guest Submissions ({rsvpList.length})</h2>
        {rsvpList.length > 0 && (
          <button onClick={exportToCSV} className="gold-btn" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}>
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>

      {/* Guest Table */}
      {rsvpList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No guest responses recorded yet.
        </div>
      ) : (
        <div className="admin-table-container glass-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Guests</th>
                <th>Wish / Message</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rsvpList.map((rsvp) => (
                <tr key={rsvp._id}>
                  <td style={{ fontWeight: 600 }}>{rsvp.name}</td>
                  <td>{rsvp.phone}</td>
                  <td style={{ color: rsvp.email ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                    {rsvp.email || '—'}
                  </td>
                  <td>
                    <span className={rsvp.attending ? 'badge-attending' : 'badge-declined'}>
                      {rsvp.attending ? 'Attending' : 'Declined'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, textAlign: 'center' }}>
                    {rsvp.attending ? rsvp.guests : '—'}
                  </td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'normal', fontStyle: rsvp.wish ? 'italic' : 'normal', color: rsvp.wish ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                    {rsvp.wish || '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {new Date(rsvp.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
