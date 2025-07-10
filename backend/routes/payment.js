import React, { useEffect, useState } from 'react';

const PaymentComponent = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if Razorpay script is loaded
    if (typeof window.Razorpay === 'undefined') {
      console.error('Razorpay script not loaded');
      // Dynamically load Razorpay script if not present
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
      };
      document.head.appendChild(script);
    } else {
      console.log('Razorpay script already loaded');
    }
  }, []);

  const handlePayment = async (amount) => {
    setLoading(true);
    
    try {
      // Check if Razorpay is available
      if (typeof window.Razorpay === 'undefined') {
        alert('Razorpay SDK not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Create order on backend
      const response = await fetch('http://localhost:3001/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      console.log('Order created:', order);

      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Payment for your order',
        order_id: order.id,
        handler: function (response) {
          // Payment successful
          console.log('Payment successful:', response);
          alert('Payment successful!');
          // You can send these details to your backend for verification
          // verifyPayment(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal closed');
            setLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error during payment:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Payment Gateway</h2>
      
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={() => handlePayment(100)}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3399cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            margin: '5px',
          }}
        >
          {loading ? 'Processing...' : 'Pay ₹100'}
        </button>

        <button
          onClick={() => handlePayment(500)}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3399cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            margin: '5px',
          }}
        >
          {loading ? 'Processing...' : 'Pay ₹500'}
        </button>

        <button
          onClick={() => handlePayment(1000)}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3399cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            margin: '5px',
          }}
        >
          {loading ? 'Processing...' : 'Pay ₹1000'}
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;