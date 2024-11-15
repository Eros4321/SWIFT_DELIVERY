import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMenuItems } from '../services/api.ts';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image?: string | null;
}

const Menu: React.FC = () => {
  const { cafeteriaId } = useParams<{ cafeteriaId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const data = await fetchMenuItems(cafeteriaId);
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    getMenuItems();
  }, [cafeteriaId]);

  return (
    <div>
      <h1>Menu</h1>
      {menuItems.length > 0 ? (
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>: ${item.price}
              <p>{item.available ? 'Available' : 'Not Available'}</p>
              {item.image && <img src={item.image} alt={item.name} width="100" />}
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items available for this cafeteria.</p>
      )}
    </div>
  );
};

export default Menu;
