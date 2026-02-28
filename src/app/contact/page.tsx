'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Clock, Send, MessageCircle, Facebook, Instagram } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 sm:py-32 bg-gradient-to-b from-amber-50/50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 bg-amber-400" />
              <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">Contact</span>
              <div className="h-px w-12 bg-amber-400" />
            </motion.div>
            <motion.h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              Contactez <span className="block font-serif italic text-amber-800 mt-2">Royal Artisanat</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              Nous sommes à votre écoute pour toute question ou collaboration
            </motion.p>
          </motion.div>
        </div>
      </section>
      <section className="py-24 sm:py-32 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-amber-400" />
                <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">Contactez-nous</span>
              </motion.div>
              <motion.h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 leading-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                Envoyez-nous <span className="block font-serif italic text-amber-800 mt-1">un message</span>
              </motion.h2>
              <motion.p className="text-gray-600 mb-8 font-light" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                Si vous avez de bons produits que vous fabriquez ou si vous souhaitez travailler avec nous, contactez-nous.
              </motion.p>
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 text-center">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-white" /></div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">Message envoyé!</h3>
                  <p className="text-gray-600 font-light">Nous vous répondrons bientôt.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-700 mb-2 font-light tracking-wide">Nom</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-amber-200/50 focus:border-amber-400 focus:outline-none transition-colors font-light" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2 font-light tracking-wide">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-amber-200/50 focus:border-amber-400 focus:outline-none transition-colors font-light" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm text-gray-700 mb-2 font-light tracking-wide">Sujet</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3 border border-amber-200/50 focus:border-amber-400 focus:outline-none transition-colors font-light" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm text-gray-700 mb-2 font-light tracking-wide">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="w-full px-4 py-3 border border-amber-200/50 focus:border-amber-400 focus:outline-none transition-colors font-light resize-none" />
                  </div>
                  <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 font-light tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi en cours...</>) : (<><Send className="w-5 h-5" />Envoyer</>)}
                  </motion.button>
                </form>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="lg:pt-20">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/50 p-10">
                <h3 className="text-2xl font-light text-gray-900 mb-2">Rejoignez notre <span className="block font-serif italic text-amber-800 mt-1">communauté</span></h3>
                <p className="text-gray-600 mb-8 font-light">Suivez-nous sur les réseaux sociaux pour découvrir nos dernières créations</p>
                <div className="space-y-4">
                  {[
                    { name: 'Facebook', url: 'https://www.facebook.com/royalart.tn', Icon: Facebook },
                    { name: 'Instagram', url: 'https://www.instagram.com/royal.artisanat/', Icon: Instagram }
                  ].map((social, index) => {
                    const Icon = social.Icon;
                    return (
                      <motion.a key={index} href={social.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + index * 0.1 }} whileHover={{ x: 5 }} className="flex items-center gap-4 bg-white border border-amber-200/50 hover:border-amber-400 p-4 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 group-hover:from-amber-100 group-hover:to-orange-100 flex items-center justify-center transition-colors"><Icon className="w-6 h-6 text-amber-700" /></div>
                        <span className="text-gray-700 font-light">{social.name}</span>
                        <div className="ml-auto text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                      </motion.a>
                    );
                  })}
                </div>
                <div className="mt-8 pt-8 border-t border-amber-200/50">
                  <p className="text-sm text-gray-500 font-light text-center">Partagez votre passion pour l'artisanat authentique</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
