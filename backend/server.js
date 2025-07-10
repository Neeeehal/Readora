require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors'); // 👈 ADD THIS


const app = express();
app.use(cors()); // 👈 ENABLE CORS
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER ENDPOINT
app.post('/create-order', async (req, res) => {
  try {
    let amount = req.body.amount;

    // Fallback to default amount if not provided or too high for test mode
    if (!amount || amount > 4999) {
      amount = 499; // ₹499 default
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: req.body.receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // ✅ send key to frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// VERIFY PAYMENT ENDPOINT
app.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PAYMENT DETAILS
app.get('/payment/:payment_id', async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.payment_id);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
