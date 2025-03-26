import React, { useState, useEffect } from 'react';
import '../styles/checkout.scss';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed successfully!');
    localStorage.removeItem('cart'); // Clear cart after order
    setCart([]);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <textarea placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <button type="submit" className="place-order-btn">Place Order</button>
      </form>

      {cart.length > 0 && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} = ₦{item.price * item.quantity}
              </li>
            ))}
          </ul>
          <h3>Total: ₦{totalAmount}</h3>
        </div>
      )}
    </div>
  );
};

export default Checkout;
