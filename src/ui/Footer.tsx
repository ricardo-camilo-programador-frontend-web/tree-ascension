/**
 * Footer Component
 * Game footer with developer credit
 */

import React from 'react';
import { t, Language } from '../i18n';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="bg-stone-950 border-t border-stone-900 p-2 text-center text-[10px] text-stone-600">
      {t[lang].developedBy}{' '}
      <a
        href="https://github.com/ricardo-camilo-programador-frontend-web"
        target="_blank"
        rel="noreferrer"
        className="text-emerald-600 hover:underline"
      >
        Ricardo Camilo
      </a>
    </footer>
  );
}
