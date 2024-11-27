import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMenuItems } from '../services/api.ts';
import '../styles/menu.scss';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image?: string | null;
}

interface QuantitySelectorProps {
  initialQuantity?: number; 
  min?: number; 
  max?: number; 
  onQuantityChange?: (quantity: number) => void; 
}

interface QuantityMap {
  [itemId: number]: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  initialQuantity = 1,
  min = 0,
  max = 100,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange && onQuantityChange(newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange && onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="quantity-selector">
      <button className="minus" onClick={handleDecrease}>
        -
      </button>
      <span className="quantity">{quantity}</span>
      <button className="plus" onClick={handleIncrease}>
        +
      </button>
    </div>
  );
};

const Menu: React.FC = () => {
  const { cafeteriaId } = useParams<{ cafeteriaId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<QuantityMap>({});

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

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };


  return (
    <div className='container'>
      <h1>Menu</h1>
      {menuItems.length > 0 ? (
        <ul className='menu-list'>
          {menuItems.map((item) => (
            <li key={item.id} className='menu-container'>
              {item.image && <img src={item.image} alt={item.name} width="100" />}
              <p>{item.available ? 'Available' : 'Not Available'}</p>
              <strong>{item.name}</strong>: ${item.price}
              <QuantitySelector
                initialQuantity={quantities[item.id] || 0}
                min={0}
                max={10}
                onQuantityChange={(quantity) =>
                  handleQuantityChange(item.id, quantity)
                }
              />
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
