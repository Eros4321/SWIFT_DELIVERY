import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMenuItems } from '../services/api.ts';
import '../styles/menu.scss';
import Header from './Header';
import Footer from './Footer';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<MenuItem[]>([]);

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

    const savedQuantities = localStorage.getItem('quantities');
    if (savedQuantities) {
      setQuantities(JSON.parse(savedQuantities));
    }

  }, [cafeteriaId]);

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setQuantities((prev) => {
      const updatedQuantities = { ...prev, [itemId]: quantity };
      localStorage.setItem('quantities', JSON.stringify(updatedQuantities)); 
      return updatedQuantities;
    });
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      const itemToAdd = { ...item, quantity };  // Add quantity to the item object
      setCart((prevCart) => [...prevCart, itemToAdd]);  // Add the item to the cart
    }
  };

  return (
    <div className='container'>
      <Header onSearch={(query) => setSearchQuery(query)}/> 
      <h1>Menu</h1>
      {filteredMenuItems.length > 0 ? (
        <ul className="menu-list">
          {filteredMenuItems.map((item) => (
            <li key={item.id} className="menu-container">
              {item.image && <img src={item.image} alt={item.name} width="100" />}
              <p>{item.available ? 'Available' : 'Not Available'}</p>
              <strong>{item.name}</strong>: ₦{item.price}
              <div className='buttons'>
                  <QuantitySelector
                    initialQuantity={quantities[item.id] || 0}
                    min={0}
                    max={10}
                    onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                  />
                  <button
                    className="add-to-cart" 
                    onClick={() => handleAddToCart(item)} 
                    
                  >
                    Add to Cart
                  </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items available for this cafeteria.</p>
      )}
      <Footer/>
    </div>
  );
};

export default Menu;
