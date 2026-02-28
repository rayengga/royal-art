import { Product } from '@/types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Custom Leather Wallet',
    description: 'Premium genuine leather wallet with personalized engraving. Perfect for everyday use with multiple card slots.',
    price: 49.99,
    material: 'leather',
    images: ['https://images.unsplash.com/photo-1627123142890-315447d7f7da?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
    category: 'Wallets',
    inStock: true,
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Engraved Wood Coaster Set',
    description: 'Set of 4 handcrafted wooden coasters with laser-engraved designs. Made from sustainable bamboo.',
    price: 24.99,
    material: 'wood',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop'],
    category: 'Home Decor',
    inStock: true,
    featured: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Personalized Leather Keychain',
    description: 'Durable leather keychain with custom text or logo engraving. Great for gifts or promotional items.',
    price: 12.99,
    material: 'leather',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
    category: 'Accessories',
    inStock: true,
    featured: false,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: '4',
    name: 'Custom Wood Phone Stand',
    description: 'Ergonomic wooden phone stand with personalized engraving. Compatible with all phone sizes.',
    price: 19.99,
    material: 'wood',
    images: ['https://images.unsplash.com/photo-1601797825920-0d52900d31c0?w=400&h=400&fit=crop'],
    category: 'Tech Accessories',
    inStock: true,
    featured: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '5',
    name: 'Leather Business Card Holder',
    description: 'Professional leather business card holder with custom logo engraving. Perfect for networking events.',
    price: 34.99,
    material: 'leather',
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'],
    category: 'Business',
    inStock: false,
    featured: false,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20',
  },
  {
    id: '6',
    name: 'Engraved Wood Picture Frame',
    description: 'Beautiful wooden picture frame with custom text engraving. Available in multiple sizes.',
    price: 29.99,
    material: 'wood',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'],
    category: 'Home Decor',
    inStock: true,
    featured: false,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

export const getFeaturedProducts = (): Product[] => {
  return sampleProducts.filter(product => product.featured && product.inStock);
};

export const getProductsByMaterial = (material: 'wood' | 'leather' | 'all'): Product[] => {
  if (material === 'all') return sampleProducts;
  return sampleProducts.filter(product => product.material === material);
};

export const getProductById = (id: string): Product | undefined => {
  return sampleProducts.find(product => product.id === id);
};