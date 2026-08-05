import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';

const normalizeStatus = (status = '') => {
  const value = String(status).toLowerCase();
  switch (value) {
    case 'shipped':
      return 'shipped';
    case 'delivered':
      return 'delivered';
    case 'processing':
      return 'processing';
    case 'pending':
    default:
      return 'pending';
  }
};

const formatStatus = (status = '') => {
  const normalized = normalizeStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;

      try {
        const res = await apiFetch('/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user?.token]);

  const updateStatus = async (id, status) => {
    const backendStatus = normalizeStatus(status);

    try {
      const res = await apiFetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status: backendStatus })
      });

      if (res.ok) {
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === id ? { ...order, status: backendStatus } : order
        ));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#3b82f6', marginBottom: '20px' }}>Manage Orders</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>USER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#a1a1aa' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} style={rowStyle}>
                  <td style={tdStyle}>{order._id?.substring(0, 8)}...</td>
                  <td style={tdStyle}>{order.user?.name || order.userId?.name || 'Deleted User'}</td>
                  <td style={tdStyle}>₹{(order.totalAmount || 0).toFixed(2)}</td>
                  <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <select
                      value={normalizeStatus(order.status)}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={{ background: '#09090b', color: '#fff', padding: '6px', border: '1px solid #27272a', borderRadius: '4px', outline: 'none' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.1)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem' };
const tdStyle = { padding: '15px', textAlign: 'left' };

export default AdminOrders;
