import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { apiFetch } from '../api';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePayment = async () => {
    try {
      console.log('Starting payment process...');
      const orderRes = await apiFetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      
      console.log('Payment endpoint status:', orderRes.status, 'ok:', orderRes.ok);
      const orderData = await orderRes.json().catch(() => ({}));
      console.log('Payment endpoint response:', orderData);

      if (!orderRes.ok) {
        console.log('Payment endpoint failed - using bypass mode');
        await bypassPayment();
        return;
      }

      // If we reach here, Razorpay is configured, but we're using a dummy key on frontend
      // Skip actual Razorpay and use bypass mode instead
      console.log('Using bypass payment mode...');
      await bypassPayment();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const bypassPayment = async () => {
    try {
      const orderPayload = {
        products: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.qty || item.quantity || 1,
          price: item.price
        })),
        totalAmount: totalPrice,
        address,
        paymentId: 'bypass_txn_' + Date.now()
      };

      console.log('Sending order payload:', orderPayload);
      console.log('User token:', user?.token);

      const saveOrderRes = await apiFetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const responseData = await saveOrderRes.json().catch(() => ({ message: 'Invalid response from server' }));

      console.log('Order response status:', saveOrderRes.status);
      console.log('Order response data:', responseData);

      if (saveOrderRes.ok) {
        dispatch(clearCart());
        navigate('/ordersuccess');
      } else {
        const errorMsg = `Order failed: ${saveOrderRes.status} - ${responseData.message || 'Unknown error'}`;
        console.error(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Bypass payment error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
