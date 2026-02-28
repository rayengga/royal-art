'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck, CreditCard, CheckCircle, Phone, MapPin, ShoppingBag, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Tunisia governorates list
const TUNISIA_GOVERNORATES = [
  'Ariana',
  'Béja',
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kébili',
  'Le Kef',
  'Mahdia',
  'La Manouba',
  'Médenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan'
];

interface CheckoutForm {
  fullName: string;
  address: string;
  governorate: string;
  phoneNumber: string;
  note: string;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const router = useRouter();
  
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    address: '',
    governorate: '',
    phoneNumber: '',
    note: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = 7;
  const total = subtotal + shipping;

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};
    
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }
    
    if (!form.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }
    
    if (!form.governorate) {
      newErrors.governorate = 'Le gouvernorat est requis';
    }
    
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9]{8}$/.test(form.phoneNumber.trim().replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Veuillez entrer un numéro de téléphone valide (8 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create orders for each item in cart using guest order API
      const orderPromises = items.map(item => 
        fetch('/api/orders/guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.product.id,
            productName: item.product.name,
            productPrice: item.product.price,
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity,
            customerName: form.fullName,
            customerPhone: form.phoneNumber,
            governorate: form.governorate,
            address: form.address,
            note: form.note,
            orderDate: new Date().toISOString()
          })
        })
      );

      const responses = await Promise.all(orderPromises);
      
      // Check if all orders were successful
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create order');
        }
      }

      const firstOrder = await responses[0].json();
      setOrderId(firstOrder.id);
      setOrderTotal(total); // Save the total before clearing cart
      setOrderPlaced(true);
      clearCart();
      
    } catch (error) {
      console.error('Order creation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty cart check
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Votre Panier est Vide
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Ajoutez des articles à votre panier avant de passer commande.
            </p>
            <Button asChild className="clean-button">
              <Link href="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuer vos Achats
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Order success page
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
              <CheckCircle className="w-16 h-16 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Commande Passée avec Succès!
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Merci pour votre commande! Votre numéro de commande est:
            </p>
            <div className="bg-muted rounded-lg p-4 mb-8 border border-border">
              <span className="font-mono text-lg text-amber-700">{orderId}</span>
            </div>
            <div className="space-y-4 mb-8 text-left bg-white rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-center">Détails de la Commande</h3>
              <div className="flex justify-between items-center">
                <span>Mode de Paiement:</span>
                <span className="font-semibold text-amber-700">Paiement à la livraison</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Montant Total:</span>
                <span className="font-bold text-xl text-amber-700">{orderTotal.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Adresse de Livraison:</span>
                <span className="text-right">{form.address}, {form.governorate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Téléphone:</span>
                <span>{form.phoneNumber}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="clean-button">
                <Link href="/shop">
                  Continuer vos Achats
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au Panier
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Passer la Commande</h1>
          <p className="text-muted-foreground mt-2">Complétez vos informations de livraison</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Package className="w-6 h-6 mr-2 text-amber-600" />
                Informations de Livraison
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="text-sm font-medium mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Nom Complet *
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Entrez votre nom complet"
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="text-sm font-medium mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Adresse *
                  </label>
                  <Input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Entrez votre adresse complète"
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Governorate */}
                <div>
                  <label htmlFor="governorate" className="text-sm font-medium mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Gouvernorat *
                  </label>
                  <select
                    id="governorate"
                    value={form.governorate}
                    onChange={(e) => handleInputChange('governorate', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${errors.governorate ? 'border-red-500' : 'border-border'}`}
                  >
                    <option value="">Sélectionnez votre gouvernorat</option>
                    {TUNISIA_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                  {errors.governorate && (
                    <p className="text-red-400 text-sm mt-1">{errors.governorate}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="text-sm font-medium mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Numéro de Téléphone *
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="XX XXX XXX"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Note (Optional) */}
                <div>
                  <label htmlFor="note" className="text-sm font-medium mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Note (Optionnel)
                  </label>
                  <textarea
                    id="note"
                    value={form.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    placeholder="Instructions spéciales pour la livraison..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-amber-600" />
                    Mode de Paiement
                  </h3>
                  <div className="bg-muted rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Truck className="w-6 h-6 mr-3 text-amber-600" />
                        <div>
                          <p className="font-medium">Paiement à la livraison</p>
                          <p className="text-sm text-muted-foreground">Payez à la réception de votre commande</p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-amber-600 border-2 border-amber-600"></div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full clean-button text-lg py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Commande en cours...' : `Passer la Commande - ${total.toFixed(2)} TND`}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl p-6 border border-border shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg border border-border">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-border">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} TND</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t border-primary/20 pt-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{subtotal.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-primary/20 pt-3">
                  <span>Total</span>
                  <span className="text-amber-700">{total.toFixed(2)} TND</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}