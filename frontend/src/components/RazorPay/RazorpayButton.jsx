import React from 'react';

const RazorpayButton = () => {
  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:3000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 49820, // in paise
          currency: "INR",
          receipt: "receipt_xyz",
        }),
      });

      const data = await res.json();

      if (!data.id) {
        throw new Error("Order ID not received from server");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ pulled from .env via Vite
        amount: data.amount,
        currency: data.currency,
        name: "BookSeller",
        description: "Book Purchase",
        order_id: data.id,
        handler: function (response) {
          alert("Payment Successful!");
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
        },
        prefill: {
          name: "Anshika Tank",
          email: "anshika@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Demo Address",
        },
        theme: {
          color: "#0D47A1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <button
  onClick={handlePayment}
  className="w-full max-w-xs bg-gradient-to-r from-[#FF9D23]/90 to-[#C14600] hover:from-[#FFA733] hover:to-[#D14E00] transition-all duration-300 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-lg"
>
  Pay Now
</button>
  );
};

export default RazorpayButton;
