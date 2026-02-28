'use client';

import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shipping = 7;
  const finalTotal = totalPrice + shipping;

  if (items.length === 0) {
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
              Vous n'avez pas encore ajouté d'articles à votre panier. 
              Découvrez notre collection de sacs artisanaux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="clean-button">
                <Link href="/shop">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continuer vos Achats
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Retour à l'Accueil</Link>
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Panier
            </h1>
            <div className="text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'article' : 'articles'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/shop" 
              className="flex items-center text-amber-700 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuer vos Achats
            </Link>
            {items.length > 1 && (
              <button
                onClick={clearCart}
                className="flex items-center text-red-500 hover:text-red-400 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Vider le Panier
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              {items.map((item: any, index: number) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.product.material === 'leather' 
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              {item.product.material}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {item.product.category}
                            </span>
                          </div>
                          <div className="text-amber-700 font-semibold">
                            {item.product.price.toFixed(2)} TND
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">Quantité:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary/50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {(item.product.price * item.quantity).toFixed(2)} TND
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-muted-foreground">
                              {item.product.price.toFixed(2)} TND each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-border shadow-sm sticky top-24"
            >
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                Récapitulatif
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="text-foreground">{totalPrice.toFixed(2)} TND</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{shipping.toFixed(2)} TND</span>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-amber-700">{finalTotal.toFixed(2)} TND</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button asChild className="w-full clean-button mb-4">
                <Link href="/checkout">
                  <span className="flex items-center justify-center">
                    Passer la Commande
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </Link>
              </Button>

              {/* Security Badge */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  Paiement Sécurisé
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Vos informations sont protégées et sécurisées. 
                  Paiement à la livraison disponible.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recently Viewed or Recommended Products */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Vous Aimerez Aussi
          </h2>
          <div className="text-center py-12 bg-muted rounded-lg border border-border">
            <p className="text-muted-foreground">
              Des recommandations apparaîtront ici basées sur votre panier.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/shop">Voir Tous les Produits</Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}