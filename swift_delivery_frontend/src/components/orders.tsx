import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api.ts';

interface Order {
  id: number;
  menu_item: string;
  quantity: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.menu_item} - {order.quantity} ({order.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
