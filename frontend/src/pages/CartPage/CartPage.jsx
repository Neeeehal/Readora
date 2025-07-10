import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Cart from '../../components/Cart/Cart';

const CartPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <Cart />
      {/* ❌ Removed duplicate Razorpay button */}
    </>
  );
};

export default CartPage;
