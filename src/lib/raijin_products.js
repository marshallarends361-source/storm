const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Raijin Apex Pro E-Moto",
    slug: "raijin-apex-pro",
    category: "E-Motos",
    price: 4999,
    inventory_quantity: 15,
    images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"],
    featured: true,
    is_new: true,
    description: "Ultimate flagship electric supermoto with extreme peak power."
  },
  {
    id: "2",
    name: "Raijin Thunder Dirt Bike",
    slug: "raijin-thunder-dirt",
    category: "Electric Dirt Bikes",
    price: 3499,
    inventory_quantity: 8,
    images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"],
    is_bestseller: true,
    sale_price: 2999,
    description: "High torque electric dirt bike built for rough offroad trails."
  },
  {
    id: "3",
    name: "Raijin Storm Mountain Bike",
    slug: "raijin-storm-mtb",
    category: "Electric Mountain Bikes",
    price: 2199,
    inventory_quantity: 20,
    images: ["https://media.base44.com/images/public/6a51082b02e209c4da4a908c/a7c93a724_generated_image.png"],
    is_new: true,
    description: "Premium carbon frame trail tracker with intuitive pedal assist."
  }
];

export const getRaijinProducts = () => {
  if (typeof window === 'undefined') return MOCK_PRODUCTS;
  try {
    const saved = JSON.parse(localStorage.getItem('raijin_products_v1') || '[]');
    const mockIds = MOCK_PRODUCTS.map(m => m.id);
    const custom = saved.filter(p => !mockIds.includes(p.id));
    const updatedMocks = MOCK_PRODUCTS.map(m => saved.find(s => s.id === m.id) || m);
    return [...custom, ...updatedMocks];
  } catch {
    return MOCK_PRODUCTS;
  }
};
