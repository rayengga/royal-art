'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Liens Rapides',
      links: [
        { name: 'Accueil', href: '/' },
        { name: 'Boutique', href: '/shop' },
        { name: 'À Propos', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Collections',
      links: [
        { name: 'Sacs', href: '/shop?category=sacs' },
        { name: 'Couffins', href: '/shop?category=couffins' },
        { name: 'Pochettes', href: '/shop?category=pochettes' },
        { name: 'Nouveautés', href: '/shop?featured=true' },
      ],
    },
    {
      title: 'Service Client',
      links: [
        { name: 'Livraison', href: '/shipping' },
        { name: 'Retours', href: '/returns' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Support', href: '/support' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-4 group w-fit">
              {/* Logo SVG */}
              <div className="relative">
                <img 
                  src="/logo.svg" 
                  alt="Royal Artisans Logo" 
                  className="h-10 w-auto"
                />
              </div>
              
              {/* Brand Name - Same as Header */}
              <div className="relative">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {['R', 'O', 'Y', 'A', 'L'].map((letter, index) => (
                      <span
                        key={index}
                        className="text-2xl font-serif relative"
                        style={{
                          background: 'linear-gradient(135deg, rgb(146, 64, 14) 0%, rgb(217, 119, 6) 50%, rgb(146, 64, 14) 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontWeight: 700,
                          letterSpacing: '0.08em'
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <span className="text-base text-amber-800/60 mx-2 font-light">•</span>
                  <span className="text-base font-serif text-amber-900/80 tracking-wide italic">
                    Artisanat
                  </span>
                </div>
                <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full w-0 group-hover:w-full transition-all duration-500" />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm">
              Sacs artisanaux pour femmes faits à la main en Tunisie. Création de pièces uniques qui allient tradition et élégance moderne.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>royalartisants2022@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+216 58 955 494</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Tunisie</span>
              </div>
            </div>
          </div>

          {/* Mobile: Quick Links and Categories side by side */}
          <div className="grid grid-cols-2 gap-4 lg:hidden">
            {footerSections.slice(0, 2).map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-amber-500 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Desktop: All sections displayed normally */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4 hidden lg:block">
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-amber-500 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-muted-foreground text-sm">
              © {currentYear} Royal Artisanat. Tous droits réservés.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 hover:bg-secondary rounded-full transition-all duration-300 hover:laser-glow-blue"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5 text-muted-foreground hover:text-amber-500" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Laser Animation Line */}
        <div className="relative mt-8 overflow-hidden">
          <div className="engraving-line"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;