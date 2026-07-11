'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { kz } from '@/lib/format';
import type { DemoProperty } from '@/lib/mock-data';

export function PropertyCard({ property, index = 0 }: { property: DemoProperty; index?: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      className="card group overflow-hidden transition-shadow hover:shadow-card-hover"
    >
      <div className="relative">
        <Link href={`/imovel/${property.slug}`} aria-label={property.title}>
          {/* Placeholder visual do protótipo — em produção: next/image + Cloudinary */}
          <div className={`aspect-[4/3] bg-gradient-to-br ${property.gradient}`} />
        </Link>
        <button
          onClick={() => setLiked(!liked)}
          aria-label={liked ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-card transition-transform hover:scale-110"
        >
          <Heart size={16} className={liked ? 'fill-accent-500 text-accent-500' : 'text-brand-900'} />
        </button>
        {property.verified && (
          <span className="badge-verified absolute left-3 top-3">
            <BadgeCheck size={12} /> Verificado
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug">
            <Link href={`/imovel/${property.slug}`} className="hover:text-accent-600">
              {property.title}
            </Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {property.rating}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {property.type} · {property.city}, {property.province}
        </p>
        <p className="mt-2 text-sm">
          <span className="font-bold text-ink">{kz(property.priceKz)}</span>
          <span className="text-muted"> /noite</span>
        </p>
      </div>
    </motion.article>
  );
}
