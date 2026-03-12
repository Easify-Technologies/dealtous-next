import { useState } from "react";

export default function TestBuy() {

  const [clientSecret, setClientSecret] = useState("");

  const buy = async () => {

    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({
        productId: "PRODUCT_ID",
        buyerId: "BUYER_ID"
      })
    });

    const data = await res.json();

    setClientSecret(data.clientSecret);
  };

  return (
    <div>
      <button onClick={buy}>Test Buy</button>

      {clientSecret && (
        <p>Payment Intent created</p>
      )}
    </div>
  );
}