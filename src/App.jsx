import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Seed data untuk LocalStorage (Demo Mode / Fallback jika Supabase offline)
const SEED_BUSINESS_UNITS = [
  { id: 'bu-1', name: "Harper's Bazaar Indonesia", category: 'Publisher', sector: 'MEDIA', website_url: 'https://mra.co.id/bazaar.html' },
  { id: 'bu-2', name: 'Her World Indonesia', category: 'Publisher', sector: 'MEDIA', website_url: 'https://mra.co.id/hw.html' },
  { id: 'bu-3', name: 'Cosmopolitan Indonesia', category: 'Publisher', sector: 'MEDIA', website_url: 'https://mra.co.id/cosmopolitan.html' },
  { id: 'bu-4', name: 'Mother & Beyond', category: 'Publisher', sector: 'MEDIA', website_url: 'https://mra.co.id/mb.html' },
  { id: 'bu-5', name: 'CASA Indonesia / Alacasa', category: 'Publisher', sector: 'MEDIA', website_url: 'https://mra.co.id/alacasa.html' },
  { id: 'bu-6', name: 'Parentalk.id', category: 'Publisher', sector: 'MEDIA', website_url: 'https://mra.co.id/parentalk.html' },
  { id: 'bu-7', name: 'The Rockin Life (Hard Rock FM)', category: 'Broadcast', sector: 'RADIO', website_url: 'https://mra.co.id/therockinlife.html' },
  { id: 'bu-8', name: 'Iswara (IRadio)', category: 'Broadcast', sector: 'RADIO', website_url: 'https://mra.co.id/iswara.html' },
  { id: 'bu-9', name: 'Hard Rock Cafe Bali', category: 'Food & Beverage', sector: 'FB', website_url: 'https://mra.co.id/hardrock-cafe.html' },
  { id: 'bu-10', name: 'Häagen-Dazs Indonesia', category: 'Food & Beverage', sector: 'FB', website_url: 'https://mra.co.id/haagen-dazs.html' },
  { id: 'bu-11', name: 'Bulgari', category: 'Retail & Lifestyle', sector: 'RETAIL', website_url: 'https://mra.co.id/bvlgari.html' },
  { id: 'bu-12', name: 'Omega', category: 'Retail & Lifestyle', sector: 'RETAIL', website_url: 'https://mra.co.id/omega.html' },
  { id: 'bu-13', name: 'Atmos Indonesia', category: 'Retail & Lifestyle', sector: 'RETAIL', website_url: 'https://mra.co.id/atmos.html' },
  { id: 'bu-14', name: 'Lancôme Indonesia', category: 'Retail & Lifestyle', sector: 'RETAIL', website_url: 'https://mra.co.id/lancome.html' },
  { id: 'bu-15', name: "Kiehl's Indonesia", category: 'Retail & Lifestyle', sector: 'RETAIL', website_url: 'https://mra.co.id/kiehls.html' },
  { id: 'bu-16', name: 'Wiggle Wiggle', category: 'Retail & Lifestyle', sector: 'RETAIL', website_url: 'https://mra.co.id/wiggle-wiggle.html' },
  { id: 'bu-17', name: 'Bulgari Resort Bali', category: 'Hotel & Property', sector: 'RETAIL', website_url: 'https://mra.co.id/bvlgari-hotel.html' },
  { id: 'bu-18', name: 'Art Jakarta', category: 'Arts & Culture', sector: 'MEDIA', website_url: 'https://mra.co.id/art-jakarta.html' }
];

const SEED_SOCIALS = [
  { id: 'so-1', business_unit_id: 'bu-1', platform: 'facebook', handle: 'HarpersBazaarIndonesia', url: 'https://www.facebook.com/HarpersBazaarIndonesia' },
  { id: 'so-2', business_unit_id: 'bu-1', platform: 'twitter', handle: 'bazaarindonesia', url: 'https://twitter.com/bazaarindonesia' },
  { id: 'so-3', business_unit_id: 'bu-1', platform: 'instagram', handle: 'bazaarindonesia', url: 'https://www.instagram.com/bazaarindonesia/' },
  { id: 'so-4', business_unit_id: 'bu-1', platform: 'youtube', handle: 'bazaarindonesia', url: 'https://www.youtube.com/bazaarindonesia' },
  { id: 'so-5', business_unit_id: 'bu-2', platform: 'facebook', handle: 'HerworldIndonesia', url: 'https://www.facebook.com/HerworldIndonesia' },
  { id: 'so-6', business_unit_id: 'bu-2', platform: 'twitter', handle: 'herworldID', url: 'https://twitter.com/herworldID' },
  { id: 'so-7', business_unit_id: 'bu-2', platform: 'instagram', handle: 'herworldindonesia', url: 'https://www.instagram.com/herworldindonesia/' },
  { id: 'so-8', business_unit_id: 'bu-2', platform: 'youtube', handle: 'HerWorldIndonesia', url: 'https://www.youtube.com/user/HerWorldIndonesia' },
  { id: 'so-9', business_unit_id: 'bu-3', platform: 'instagram', handle: 'cosmoindonesia', url: 'https://instagram.com/cosmoindonesia' },
  { id: 'so-10', business_unit_id: 'bu-6', platform: 'instagram', handle: 'parentalk.id', url: 'https://www.instagram.com/parentalk.id/' },
  { id: 'so-11', business_unit_id: 'bu-7', platform: 'instagram', handle: 'therockinlife.bali', url: 'https://www.instagram.com/therockinlife.bali' },
  { id: 'so-12', business_unit_id: 'bu-9', platform: 'instagram', handle: 'hardrockcafebali', url: 'https://www.instagram.com/hardrockcafebali/' },
  { id: 'so-13', business_unit_id: 'bu-10', platform: 'instagram', handle: 'haagendazs.id', url: 'https://www.instagram.com/haagendazs.id/' },
  { id: 'so-14', business_unit_id: 'bu-15', platform: 'instagram', handle: 'kiehlsid', url: 'https://www.instagram.com/kiehlsid' },
  { id: 'so-15', business_unit_id: 'bu-18', platform: 'instagram', handle: 'artjakarta', url: 'https://www.instagram.com/artjakarta/' }
];

const InstagramIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.444-.048-3.298c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.999 0zm1.978 1.864c.734.034 1.134.157 1.4.26.357.137.61.302.879.571.269.269.434.522.571.879.103.266.226.666.26 1.4.034.733.042.955.042 3.11s-.008 2.377-.042 3.11c-.034.734-.157 1.134-.26 1.4a2.76 2.76 0 0 1-.571.879 2.76 2.76 0 0 1-.879.571c-.266.103-.666.226-1.4.26-.733.034-.955.042-3.11.042s-2.377-.008-3.11-.042c-.734-.034-1.134-.157-1.4-.26a2.76 2.76 0 0 1-.879-.571 2.76 2.76 0 0 1-.571-.879c-.266-.103-.666-.226-1.4-.26-.733-.034-.955-.042-3.11-.042s-2.377.008-3.11.042c-.734.034-1.134.157-1.4.26a2.76 2.76 0 0 1-.571-.879 2.76 2.76 0 0 1-.879-.571c-.266-.103-.666-.226-1.4-.26-.733-.034-.955-.042-3.11-.042s-2.377-.008-3.11-.042c-.734-.034-1.134-.157-1.4-.26a2.76 2.76 0 0 1-.879-.571c-.269-.269-.434-.522-.571-.879c-.103-.266-.226-.666-.26-1.4-.034-.733-.042-.955-.042-3.11s.008-2.377.042-3.11c.034-.734.157-1.134.26-1.4a2.76 2.76 0 0 1 .571-.879 2.76 2.76 0 0 1 .879-.571c.266-.103.666-.226 1.4-.26.733-.034.955-.042 3.11-.042s2.377.008 3.11.042zm-.306 4.749a3.5 3.5 0 1 0-4.044 4.044 3.5 3.5 0 0 0 4.044-4.044zm-1.077 3.037a2.25 2.25 0 1 1-2.96-2.96 2.25 2.25 0 0 1 2.96 2.96zm2.148-5.07a.9.9 0 1 0-1.8 0 .9.9 0 0 0 1.8 0z"/>
  </svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
  </svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
  </svg>
);

const TiktokIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M9 0h1.98c.144.32.34.61.58.85.24.24.53.436.85.58a3.224 3.224 0 0 0 2.24 0V4a4.965 4.965 0 0 1-2.49-.64A4.957 4.957 0 0 1 10.5 1h-1.5v8.5a2.5 2.5 0 1 1-4.84-1.2A2.5 2.5 0 0 1 6.5 7v-2a4.498 4.498 0 0 0-3.5 1.5A4.5 4.5 0 0 0 2 9.5a4.5 4.5 0 0 0 4.5 4.5a4.5 4.5 0 0 0 4.5-4.5V0z"/>
  </svg>
);

const renderPlatformIcon = (platform, size = 16) => {
  const plat = platform.toLowerCase();
  switch (plat) {
    case 'instagram': return <InstagramIcon size={size} />;
    case 'facebook': return <FacebookIcon size={size} />;
    case 'twitter':
    case 'x': return <TwitterIcon size={size} />;
    case 'youtube': return <YoutubeIcon size={size} />;
    case 'tiktok': return <TiktokIcon size={size} />;
    default: return <span>{platform.substring(0, 2).toUpperCase()}</span>;
  }
};

const DashboardIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ReportIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PrintIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const ExcelIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AuditIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const WarningIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CriticalIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const ShieldIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const GlobeIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.98 0-5.682-1.09-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
  </svg>
);

const UserIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MegaphoneIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const ArrowLeftIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SearchIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function App() {
  const [useSupabase, setUseSupabase] = useState(true);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [picDelegations, setPicDelegations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]); 
  
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [currentUser, setCurrentUser] = useState(null);
  
  // UI states
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isDelegationOpen, setIsDelegationOpen] = useState(false);
  const [isAuditFormOpen, setIsAuditFormOpen] = useState(false);
  const [isAddSocialOpen, setIsAddSocialOpen] = useState(false); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form input states
  const [newPic, setNewPic] = useState({ picName: '', businessUnitId: '' });
  const [newSocial, setNewSocial] = useState({ platform: 'instagram', handle: '', url: '' });
  const [auditForm, setAuditForm] = useState({
    last_password_changed_at: '',
    has_two_factor_auth: false,
    password_strength: 'Medium',
    vulnerabilities_notes: ''
  });

  const flatpickrRef = useRef(null);

  useEffect(() => {
    let fpInstance = null;
    if (isAuditFormOpen && flatpickrRef.current) {
      fpInstance = flatpickr(flatpickrRef.current, {
        defaultDate: auditForm.last_password_changed_at || 'today',
        onChange: (selectedDates, dateStr) => {
          setAuditForm(prev => ({ ...prev, last_password_changed_at: dateStr }));
        },
        dateFormat: "Y-m-d",
        disableMobile: true
      });
    }
    return () => {
      if (fpInstance) {
        fpInstance.destroy();
      }
    };
  }, [isAuditFormOpen, selectedAccount]);

  // Load Data
  useEffect(() => {
    if (useSupabase) {
      fetchSupabaseData();
    } else {
      loadLocalStorageData();
    }
  }, [useSupabase]);

  const loadLocalStorageData = () => {
    const localUnits = localStorage.getItem('mra_units');
    const localSocials = localStorage.getItem('mra_socials');
    const localPics = localStorage.getItem('mra_pics');
    const localAudits = localStorage.getItem('mra_audits');
    const localUsers = localStorage.getItem('mra_users');

    if (localUnits && localSocials) {
      setBusinessUnits(JSON.parse(localUnits));
      setSocialAccounts(JSON.parse(localSocials));
      setPicDelegations(JSON.parse(localPics || '[]'));
      setAuditLogs(JSON.parse(localAudits || '[]'));
      
      const parsedUsers = localUsers ? JSON.parse(localUsers) : [];
      if (parsedUsers.length === 0 || !parsedUsers[0].password) {
        const mockUsers = [
          { id: 'ADMIN-01', name: 'Alfonso (Head of Marketing)', email: 'head@mragroup.co.id', password: 'Password123!', department: 'Marketing Head Office', role: 'ADMIN', sector: 'ALL' },
          { id: 'USR-RETAIL', name: 'Budi Retail', email: 'retail@mragroup.co.id', password: 'Password123!', department: 'Retail & Lifestyle', role: 'PIC', sector: 'RETAIL' },
          { id: 'USR-FB', name: 'Siti F&B', email: 'fb@mragroup.co.id', password: 'Password123!', department: 'Food & Beverage', role: 'PIC', sector: 'FB' },
          { id: 'USR-MEDIA', name: 'Andi Media', email: 'media@mragroup.co.id', password: 'Password123!', department: 'Publishing & Media', role: 'PIC', sector: 'MEDIA' },
          { id: 'USR-RADIO', name: 'Rian Radio', email: 'radio@mragroup.co.id', password: 'Password123!', department: 'MRA Broadcast', role: 'PIC', sector: 'RADIO' }
        ];
        localStorage.setItem('mra_users', JSON.stringify(mockUsers));
        setUsersList(mockUsers);
      } else {
        setUsersList(parsedUsers);
      }
    } else {
      const mockUsers = [
        { id: 'ADMIN-01', name: 'Alfonso (Head of Marketing)', email: 'head@mragroup.co.id', password: 'Password123!', department: 'Marketing Head Office', role: 'ADMIN', sector: 'ALL' },
        { id: 'USR-RETAIL', name: 'Budi Retail', email: 'retail@mragroup.co.id', password: 'Password123!', department: 'Retail & Lifestyle', role: 'PIC', sector: 'RETAIL' },
        { id: 'USR-FB', name: 'Siti F&B', email: 'fb@mragroup.co.id', password: 'Password123!', department: 'Food & Beverage', role: 'PIC', sector: 'FB' },
        { id: 'USR-MEDIA', name: 'Andi Media', email: 'media@mragroup.co.id', password: 'Password123!', department: 'Publishing & Media', role: 'PIC', sector: 'MEDIA' },
        { id: 'USR-RADIO', name: 'Rian Radio', email: 'radio@mragroup.co.id', password: 'Password123!', department: 'MRA Broadcast', role: 'PIC', sector: 'RADIO' }
      ];
      localStorage.setItem('mra_units', JSON.stringify(SEED_BUSINESS_UNITS));
      localStorage.setItem('mra_socials', JSON.stringify(SEED_SOCIALS));
      localStorage.setItem('mra_pics', JSON.stringify([]));
      localStorage.setItem('mra_audits', JSON.stringify([]));
      localStorage.setItem('mra_users', JSON.stringify(mockUsers));
      
      setBusinessUnits(SEED_BUSINESS_UNITS);
      setSocialAccounts(SEED_SOCIALS);
      setPicDelegations([]);
      setAuditLogs([]);
      setUsersList(mockUsers);
    }
  };

  const fetchSupabaseData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Database serverless API offline');
      const data = await response.json();

      setBusinessUnits(data.units);
      setSocialAccounts(data.socials);
      setPicDelegations(data.pics);
      setAuditLogs(data.audits);
      setUsersList(data.users);
    } catch (e) {
      console.error(e);
      setErrorMsg('Gagal memuat data dari API Database Supabase. Menggunakan mode Demo Lokal.');
      setUseSupabase(false);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (useSupabase) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginForm.email, password: loginForm.password })
        });

        if (!response.ok) {
          setErrorMsg('Email atau password salah!');
          return;
        }
        
        const data = await response.json();
        if (data.success) {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
        } else {
          setErrorMsg('Email atau password salah!');
        }
      } catch (err) {
        setErrorMsg('Gagal login: ' + err.message);
      }
    } else {
      const user = usersList.find(u => u.email === loginForm.email && u.password === loginForm.password);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        setErrorMsg('Email atau password salah!');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedUnit(null);
    setSearchQuery('');
    setLoginForm({ email: '', password: '' });
  };

  // Actions
  const handleDelegatePic = async (e) => {
    e.preventDefault();
    if (!newPic.picName || !newPic.businessUnitId) return;

    const delegation = {
      business_unit_id: newPic.businessUnitId,
      pic_name: newPic.picName,
      delegated_by: currentUser.name,
      delegated_at: new Date().toISOString(),
      is_active: true
    };

    if (useSupabase) {
      try {
        const response = await fetch('/api/delegate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(delegation)
        });
        if (!response.ok) throw new Error('Gagal menyimpan delegasi');
        const data = await response.json();
        
        // Update local list
        const filteredPics = picDelegations.filter(p => p.business_unit_id !== newPic.businessUnitId);
        setPicDelegations([...filteredPics, data]);
      } catch (error) {
        setErrorMsg(error.message);
        return;
      }
    } else {
      const mockDelegation = {
        ...delegation,
        id: 'pic-' + Date.now()
      };
      const filteredPics = picDelegations.filter(p => p.business_unit_id !== newPic.businessUnitId);
      const updatedPics = [...filteredPics, mockDelegation];
      localStorage.setItem('mra_pics', JSON.stringify(updatedPics));
      setPicDelegations(updatedPics);
    }

    setNewPic({ picName: '', businessUnitId: '' });
    setIsDelegationOpen(false);
  };

  const handleSubmitAudit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return;

    // Calculate audit status
    const daysSinceChange = Math.floor(
      (new Date() - new Date(auditForm.last_password_changed_at)) / (1000 * 60 * 60 * 24)
    );
    let status = 'Safe';
    if (daysSinceChange > 90 || !auditForm.has_two_factor_auth || auditForm.password_strength === 'Weak') {
      status = 'Warning';
    }
    if (daysSinceChange > 180 || (auditForm.password_strength === 'Weak' && !auditForm.has_two_factor_auth)) {
      status = 'Critical';
    }

    const audit = {
      account_id: selectedAccount.id,
      last_password_changed_at: auditForm.last_password_changed_at,
      has_two_factor_auth: auditForm.has_two_factor_auth,
      password_strength: auditForm.password_strength,
      vulnerabilities_notes: auditForm.vulnerabilities_notes,
      status: status,
      audited_at: new Date().toISOString(),
      audited_by_user_id: currentUser.id
    };

    if (useSupabase) {
      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(audit)
        });
        if (!response.ok) throw new Error('Gagal menyimpan hasil audit');
        const data = await response.json();
        
        // Remove older log of this account from display and add the new one
        const filteredAudits = auditLogs.filter(a => a.account_id !== selectedAccount.id);
        setAuditLogs([...filteredAudits, data]);
      } catch (error) {
        setErrorMsg(error.message);
        return;
      }
    } else {
      const mockAudit = {
        ...audit,
        id: 'audit-' + Date.now()
      };
      const filteredAudits = auditLogs.filter(a => a.account_id !== selectedAccount.id);
      const updatedAudits = [...filteredAudits, mockAudit];
      localStorage.setItem('mra_audits', JSON.stringify(updatedAudits));
      setAuditLogs(updatedAudits);
    }

    setIsAuditFormOpen(false);
    setSelectedAccount(null);
    setAuditForm({
      last_password_changed_at: '',
      has_two_factor_auth: false,
      password_strength: 'Medium',
      vulnerabilities_notes: ''
    });
  };

  // Tambah Akun Sosial Media secara manual
  const handleAddSocial = async (e) => {
    e.preventDefault();
    if (!selectedUnit || !newSocial.handle || !newSocial.url) return;

    const payload = {
      business_unit_id: selectedUnit.id,
      platform: newSocial.platform,
      handle: newSocial.handle.replace('@', ''),
      url: newSocial.url
    };

    if (useSupabase) {
      try {
        const response = await fetch('/api/add-social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Gagal menambahkan akun sosial media');
        const data = await response.json();
        setSocialAccounts([...socialAccounts, data]);
      } catch (err) {
        setErrorMsg(err.message);
        return;
      }
    } else {
      const mockSocial = {
        ...payload,
        id: 'so-' + Date.now()
      };
      const updatedSocials = [...socialAccounts, mockSocial];
      localStorage.setItem('mra_socials', JSON.stringify(updatedSocials));
      setSocialAccounts(updatedSocials);
    }

    setNewSocial({ platform: 'instagram', handle: '', url: '' });
    setIsAddSocialOpen(false);
  };

  // Helper selectors
  const getUnitPic = (unitId) => {
    return picDelegations.find(p => p.business_unit_id === unitId && p.is_active);
  };

  const getAccountAudit = (accountId) => {
    return auditLogs
      .filter(a => a.account_id === accountId)
      .sort((a, b) => new Date(b.audited_at) - new Date(a.audited_at))[0];
  };

  const getUnitStatus = (unitId) => {
    const accounts = socialAccounts.filter(s => s.business_unit_id === unitId);
    if (accounts.length === 0) return 'No Accounts';
    
    let highestSeverity = 'Safe';
    let auditedCount = 0;
    
    accounts.forEach(acc => {
      const audit = getAccountAudit(acc.id);
      if (audit) {
        auditedCount++;
        if (audit.status === 'Critical') highestSeverity = 'Critical';
        else if (audit.status === 'Warning' && highestSeverity !== 'Critical') highestSeverity = 'Warning';
      }
    });

    if (auditedCount === 0) return 'Unaudited';
    return highestSeverity;
  };

  // Filter Business Units by User Sector Access & Search query
  const renderReportView = () => {
    const totalBrandsCount = filteredUnits.length;
    let brandScoresSum = 0;
    let brandsWithAccountsCount = 0;
    filteredUnits.forEach(unit => {
      const score = calculateBrandScore(unit.id);
      if (score !== null) {
        brandScoresSum += score;
        brandsWithAccountsCount++;
      }
    });
    const avgSecurityScore = brandsWithAccountsCount > 0 ? Math.round(brandScoresSum / brandsWithAccountsCount) : 100;
    const platformStats = getPlatformStats();

    const allAccountsWithBrandData = currentFilteredSocialAccounts.map(acc => {
      const brand = filteredUnits.find(b => b.id === acc.business_unit_id);
      const pic = getUnitPic(acc.business_unit_id);
      const audit = getAccountAudit(acc.id);
      return {
        ...acc,
        brandName: brand ? brand.name : 'Unknown Brand',
        category: brand ? brand.category : '',
        sector: brand ? brand.sector : '',
        picName: pic ? pic.pic_name : 'Belum Ditetapkan',
        lastAudit: audit ? new Date(audit.audited_at).toLocaleDateString('id-ID') : 'Belum Diaudit',
        passwordAge: audit ? Math.floor((new Date() - new Date(audit.last_password_changed_at)) / (1000 * 60 * 60 * 24)) : '-',
        twoFactor: audit ? (audit.has_two_factor_auth ? 'AKTIF' : 'MATI') : 'MATI',
        passwordStrength: audit ? audit.password_strength : '-',
        status: audit ? audit.status : 'Unaudited'
      };
    });

    const filteredReportRows = allAccountsWithBrandData.filter(row => {
      const query = searchQuery.toLowerCase();
      return (
        row.brandName.toLowerCase().includes(query) ||
        row.handle.toLowerCase().includes(query) ||
        row.picName.toLowerCase().includes(query) ||
        row.platform.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query)
      );
    });

    const exportToExcel = () => {
      const rows = filteredReportRows.map(row => ({
        'Unit Bisnis': row.brandName,
        'Kategori': row.category,
        'Platform': row.platform === 'twitter' ? 'X' : row.platform.toUpperCase(),
        'Handle': `@${row.handle}`,
        'Nama Delegasi': row.picName,
        'Umur Password': row.passwordAge !== '-' ? `${row.passwordAge} hari` : '-',
        '2FA': row.twoFactor,
        'Status Keamanan': row.status,
        'Tgl Audit': row.lastAudit
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Kepatuhan');
      
      const max_widths = Object.keys(rows[0] || {}).map(key => {
        let max_len = key.length;
        rows.forEach(r => {
          const val_len = String(r[key] || '').length;
          if (val_len > max_len) max_len = val_len;
        });
        return { wch: max_len + 2 };
      });
      worksheet['!cols'] = max_widths;

      XLSX.writeFile(workbook, 'Laporan_Audit_Sosial_Media_MRA.xlsx');
    };

    return (
      <div className="main-content animate-fade-in" style={{ height: 'calc(100vh - 72px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Laporan Audit Keamanan Sosial Media</h2>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Laporan kepatuhan sandi, 2FA, dan status kerentanan di seluruh sektor terpantau.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary"
              onClick={exportToExcel}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ExcelIcon size={14} /> Ekspor Excel
            </button>
            <button 
              className="btn"
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <PrintIcon size={14} /> Cetak Laporan PDF
            </button>
          </div>
        </div>

        <div className="stats-banner">
          <div className="stat-item-card blue">
            <span className="stat-title">Rata-rata Skor Keamanan</span>
            <div className="stat-val">{avgSecurityScore}%</div>
            <span className="stat-desc">Kalkulasi kepatuhan dari {brandsWithAccountsCount} brand aktif</span>
          </div>
          
          <div className="stat-item-card orange">
            <span className="stat-title">Penyelesaian Audit</span>
            <div className="stat-val">{Math.round((auditedCount / (totalAccounts || 1)) * 100)}%</div>
            <span className="stat-desc">{auditedCount} dari {totalAccounts} akun telah di-audit</span>
          </div>

          <div className="stat-item-card red">
            <span className="stat-title" style={{ color: 'var(--critical-text)' }}>Akun Berisiko Kritis</span>
            <div className="stat-val" style={{ color: 'var(--critical-text)' }}>{criticalCount}</div>
            <span className="stat-desc">Akun membutuhkan perhatian keamanan segera</span>
          </div>
        </div>

        <div className="detail-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Ringkasan Audit Per Platform</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '6px' }}>
            {Object.entries(platformStats).map(([platform, stat]) => {
              if (stat.total === 0) return null;
              const pct = Math.round((stat.audited / stat.total) * 100) || 0;
              let themeColor = '#64748b';
              if (platform === 'instagram') themeColor = '#e1306c';
              if (platform === 'facebook') themeColor = '#1877f2';
              if (platform === 'twitter') themeColor = '#0f172a';
              if (platform === 'youtube') themeColor = '#ff0000';
              if (platform === 'tiktok') themeColor = '#000000';

              return (
                <div key={platform} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                    <span style={{ color: themeColor, display: 'flex', alignItems: 'center' }}>{renderPlatformIcon(platform, 18)}</span>
                    <span style={{ textTransform: 'capitalize' }}>{platform === 'twitter' ? 'X / Twitter' : platform}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stat.audited} / {stat.total}</span>
                    <span className={`mra-badge ${pct === 100 ? 'safe' : 'warning'}`} style={{ fontSize: '0.65rem' }}>{pct}% Diaudit</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="detail-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daftar Kepatuhan Akun Sosial Media</h3>
            <input 
              type="text"
              className="form-control"
              placeholder="Cari berdasarkan brand, PIC, platform, dsb."
              style={{ maxWidth: '280px', padding: '6px 12px', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Unit Bisnis</th>
                  <th>Kategori</th>
                  <th>Platform</th>
                  <th>Handle</th>
                  <th>Nama Delegasi</th>
                  <th>Umur Password</th>
                  <th>2FA</th>
                  <th>Status Keamanan</th>
                  <th>Tgl Audit</th>
                </tr>
              </thead>
              <tbody>
                {filteredReportRows.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Tidak ada data akun sosial media
                    </td>
                  </tr>
                ) : (
                  filteredReportRows.map(row => {
                    let badgeClass = 'warning';
                    if (row.status === 'Safe') badgeClass = 'safe';
                    if (row.status === 'Critical') badgeClass = 'critical';

                    let themeColor = 'var(--text-muted)';
                    if (row.platform === 'instagram') themeColor = '#e1306c';
                    if (row.platform === 'facebook') themeColor = '#1877f2';
                    if (row.platform === 'twitter') themeColor = '#0f172a';
                    if (row.platform === 'youtube') themeColor = '#ff0000';
                    if (row.platform === 'tiktok') themeColor = '#000000';

                    return (
                      <tr key={row.id}>
                        <td style={{ fontWeight: 700 }}>{row.brandName}</td>
                        <td>
                          <span className="mra-badge category" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{row.category}</span>
                        </td>
                        <td>
                          <span style={{ color: themeColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {renderPlatformIcon(row.platform, 16)}
                            <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', fontWeight: 600 }}>{row.platform === 'twitter' ? 'X' : row.platform}</span>
                          </span>
                        </td>
                        <td>
                          <a href={row.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                            @{row.handle}
                          </a>
                        </td>
                        <td>
                          <span className="mra-badge category" style={{ background: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <UserIcon size={12} color="#0369a1" /> {row.picName}
                          </span>
                        </td>
                        <td>
                          {row.passwordAge !== '-' ? `${row.passwordAge} hari` : '-'}
                        </td>
                        <td style={{ fontWeight: 700, color: row.twoFactor === 'AKTIF' ? 'var(--safe-text)' : 'var(--critical-text)' }}>
                          {row.twoFactor}
                        </td>
                        <td>
                          <span className={`mra-badge ${badgeClass}`} style={{ fontSize: '0.65rem' }}>
                            {row.status}
                          </span>
                        </td>
                        <td>{row.lastAudit}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  };

  const getFilteredUnits = () => {
    if (!currentUser) return [];
    
    let filtered = businessUnits;
    if (currentUser.sector !== 'ALL') {
      filtered = businessUnits.filter(bu => bu.sector === currentUser.sector);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bu => 
        bu.name.toLowerCase().includes(query) || 
        bu.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredUnits = getFilteredUnits();

  // Stats calculation
  const currentFilteredUnitIds = filteredUnits.map(f => f.id);
  const currentFilteredSocialAccounts = socialAccounts.filter(s => currentFilteredUnitIds.includes(s.business_unit_id));
  const totalAccounts = currentFilteredSocialAccounts.length;
  const auditedCount = currentFilteredSocialAccounts.filter(s => getAccountAudit(s.id)).length;
  const criticalCount = currentFilteredSocialAccounts.filter(s => getAccountAudit(s.id)?.status === 'Critical').length;
  const warningCount = currentFilteredSocialAccounts.filter(s => getAccountAudit(s.id)?.status === 'Warning').length;

  const getPlatformStats = () => {
    const stats = {
      instagram: { total: 0, audited: 0 },
      facebook: { total: 0, audited: 0 },
      tiktok: { total: 0, audited: 0 },
      twitter: { total: 0, audited: 0 },
      youtube: { total: 0, audited: 0 }
    };

    currentFilteredSocialAccounts.forEach(acc => {
      const platform = acc.platform.toLowerCase();
      const key = platform === 'x' ? 'twitter' : platform;
      if (stats[key]) {
        stats[key].total++;
        const audit = getAccountAudit(acc.id);
        if (audit) {
          stats[key].audited++;
        }
      }
    });

    return stats;
  };

  const calculateBrandScore = (unitId) => {
    const accounts = socialAccounts.filter(s => s.business_unit_id === unitId);
    if (accounts.length === 0) return null;
    
    let totalScore = 0;
    accounts.forEach(acc => {
      const audit = getAccountAudit(acc.id);
      if (!audit) {
        totalScore += 50;
      } else if (audit.status === 'Safe') {
        totalScore += 100;
      } else if (audit.status === 'Warning') {
        totalScore += 70;
      } else if (audit.status === 'Critical') {
        totalScore += 25;
      }
    });
    
    return Math.round(totalScore / accounts.length);
  };

  // Auto-select first brand on loading list if none selected
  useEffect(() => {
    if (filteredUnits.length > 0 && !selectedUnit) {
      setSelectedUnit(filteredUnits[0]);
    }
  }, [filteredUnits, selectedUnit]);

  // Render Login Portal (Modern Minimalist Light Theme)
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #e2e8f0 100%)' }}>
        <div className="cyber-grid"></div>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
          maxWidth: '380px',
          width: '100%',
          padding: '36px',
          zIndex: 10
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', marginBottom: '4px' }}>
              MRA Group Audit
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Social Media Security Dashboard</p>
          </div>
          
          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.8rem', color: '#ef4444', fontWeight: 500, textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Karyawan</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="email@mragroup.co.id"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Kata Sandi</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}>
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="cyber-grid"></div>
      
      {!useSupabase && (
        <div className="demo-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <WarningIcon size={14} color="white" /> SISTEM BERJALAN DI DEMO LOKAL: Menggunakan data offline browser. Hubungkan Supabase untuk menyimpan permanen.
        </div>
      )}

      {/* Modern Top Navbar */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div className="navbar-brand">
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>MRA Group Social Audit</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sektor Terpantau: <strong>{currentUser.sector}</strong> ({currentUser.department})</p>
          </div>
          
          {/* Menu Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${activeTab === 'dashboard' ? '' : 'btn-secondary'}`} 
              style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'none' }}
              onClick={() => setActiveTab('dashboard')}
            >
              <DashboardIcon size={14} /> Dashboard
            </button>
            <button 
              className={`btn ${activeTab === 'report' ? '' : 'btn-secondary'}`} 
              style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'none' }}
              onClick={() => setActiveTab('report')}
            >
              <ReportIcon size={14} /> Laporan Keamanan
            </button>
          </div>
        </div>
        
        <div className="navbar-user-info">
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{currentUser.name}</p>
            <span className="mra-badge sector" style={{ fontSize: '0.7rem', padding: '1px 8px', marginTop: '2px' }}>{currentUser.role}</span>
          </div>
          
          <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content Area: Switch between Dashboard Grid and Report View */}
      {activeTab === 'dashboard' ? (
        <main className="dashboard-grid">
        
        {/* Left Sidebar: Brand Navigator */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Daftar Brand MRA ({filteredUnits.length})</h2>
            <p>Pilih brand di bawah untuk mengaudit akun sosial medianya.</p>
          </div>

          <div className="search-input-wrapper">
            <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}><SearchIcon size={14} color="var(--text-muted)" /></span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari nama brand / kategori..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="brand-list">
            {filteredUnits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                Tidak ada brand ditemukan
              </div>
            ) : (
              filteredUnits.map(unit => {
                const pic = getUnitPic(unit.id);
                const status = getUnitStatus(unit.id);
                const isActive = selectedUnit?.id === unit.id;
                
                let badgeClass = 'safe';
                if (status === 'Critical') badgeClass = 'critical';
                else if (status === 'Warning' || status === 'Unaudited') badgeClass = 'warning';
                else if (status === 'No Accounts') badgeClass = 'none';

                return (
                  <div 
                    key={unit.id}
                    className={`brand-card-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <div className="brand-card-info">
                      <div className="brand-card-title">{unit.name}</div>
                      <div className="brand-card-meta">
                        <span className="mra-badge category" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{unit.category}</span>
                      </div>
                      <div className="brand-card-delegate" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UserIcon size={12} color="var(--text-muted)" /> {pic ? pic.pic_name : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 'normal' }}>Belum ada delegasi</span>}
                      </div>
                    </div>
                    <div>
                      <span className={`mra-badge ${badgeClass}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Dashboard Body */}
        <section className="main-content">
          
          {/* Top Banner Stats */}
          <div className="stats-banner">
            <div className="stat-item-card blue">
              <span className="stat-title has-tooltip" data-tooltip="Persentase akun sosial media yang telah diaudit di bawah sektor tanggung jawab Anda.">Kepatuhan Audit ({currentUser.sector})</span>
              <div className="stat-val">{auditedCount} / {totalAccounts} Akun</div>
              <span className="stat-desc">Akun selesai diaudit dari total akun sektor Anda</span>
            </div>
            
            <div className="stat-item-card red">
              <span className="stat-title has-tooltip" style={{ color: 'var(--critical-text)' }} data-tooltip="Jumlah akun dengan kata sandi kedaluwarsa (>180 hari) atau 2FA dinonaktifkan.">Ancaman Kritis</span>
              <div className="stat-val" style={{ color: 'var(--critical-text)' }}>{criticalCount}</div>
              <span className="stat-desc">Sandi kadaluarsa (&gt;180 hari) atau 2FA mati</span>
            </div>
            
            <div className="stat-item-card orange">
              <span className="stat-title has-tooltip" style={{ color: 'var(--warning-text)' }} data-tooltip="Jumlah akun yang memerlukan pembaruan sandi jangka pendek (90-180 hari sejak perubahan terakhir).">Peringatan Keamanan</span>
              <div className="stat-val" style={{ color: 'var(--warning-text)' }}>{warningCount}</div>
              <span className="stat-desc">Akun perlu perbaikan sandi jangka pendek</span>
            </div>
          </div>

          {/* Platform KPI Grid */}
          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '-8px'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Per Platform:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexGrow: 1, justifyContent: 'flex-start', marginLeft: '8px' }}>
              {Object.entries(getPlatformStats()).map(([platform, stat]) => {
                if (stat.total === 0) return null;
                const percentage = Math.round((stat.audited / stat.total) * 100) || 0;
                
                let themeColor = 'var(--text-muted)';
                if (platform === 'instagram') themeColor = '#e1306c';
                if (platform === 'facebook') themeColor = '#1877f2';
                if (platform === 'twitter') themeColor = '#0f172a';
                if (platform === 'youtube') themeColor = '#ff0000';
                if (platform === 'tiktok') themeColor = '#000000';

                return (
                  <div 
                    key={platform} 
                    className="has-tooltip"
                    data-tooltip={`Total akun ${platform === 'twitter' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)} terdaftar & telah diaudit.`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: '#f8fafc', 
                      padding: '5px 12px', 
                      borderRadius: '30px', 
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ color: themeColor, display: 'flex', alignItems: 'center' }}>
                      {renderPlatformIcon(platform)}
                    </span>
                    <span style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{platform === 'twitter' ? 'X / Twitter' : platform}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                      {stat.audited}/{stat.total}
                    </span>
                    <span className={`mra-badge ${percentage === 100 ? 'safe' : 'warning'}`} style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '30px', marginLeft: '2px' }}>
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Unit Panel */}
          {selectedUnit ? (
            <div className="detail-card animate-fade-in">
              
              {/* Brand Header */}
              <div className="detail-header">
                <div className="detail-brand-title">
                  <h2>{selectedUnit.name}</h2>
                  <div className="detail-brand-meta">
                    <span className="mra-badge category">{selectedUnit.category}</span>
                    <span className="mra-badge sector">{selectedUnit.sector} Sector</span>
                    {selectedUnit.website_url && (
                      <a href={selectedUnit.website_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <GlobeIcon size={14} color="var(--primary)" /> Kunjungi Website
                      </a>
                    )}
                  </div>
                </div>

                <div className="detail-actions">
                  {currentUser.role === 'ADMIN' && (
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        const pic = getUnitPic(selectedUnit.id);
                        setNewPic({ picName: pic ? pic.pic_name : '', businessUnitId: selectedUnit.id });
                        setIsDelegationOpen(true);
                      }}
                    >
                      👤 Kelola Delegasi
                    </button>
                  )}
                  <button className="btn" onClick={() => setIsAddSocialOpen(true)}>
                    + Tambah Akun Sosial
                  </button>
                </div>
              </div>

              {/* Brand Security Score Indicator */}
              {(() => {
                const score = calculateBrandScore(selectedUnit.id);
                if (score === null) return null;
                
                let barColor = 'var(--safe)';
                let textColor = 'var(--safe-text)';
                let bgBarColor = 'var(--safe-bg)';
                let shieldIcon = <ShieldIcon size={18} color="var(--safe)" />;
                let ratingText = 'Sangat Aman';

                if (score < 50) {
                  barColor = 'var(--critical)';
                  textColor = 'var(--critical-text)';
                  bgBarColor = 'var(--critical-bg)';
                  shieldIcon = <CriticalIcon size={18} color="var(--critical)" />;
                  ratingText = 'Rentan / Bahaya';
                } else if (score < 80) {
                  barColor = 'var(--warning)';
                  textColor = 'var(--warning-text)';
                  bgBarColor = 'var(--warning-bg)';
                  shieldIcon = <WarningIcon size={18} color="var(--warning)" />;
                  ratingText = 'Perlu Perhatian';
                }

                return (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="has-tooltip" data-tooltip="Rata-rata kepatuhan brand ini: Safe (100%), Warning (70%), Critical (25%) per akun." style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {shieldIcon} Skor Keamanan Sektor
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: textColor }}>
                        {ratingText} ({score}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${score}%`, height: '100%', background: barColor, borderRadius: '10px', transition: 'width 0.8s ease-in-out' }}></div>
                    </div>
                  </div>
                );
              })()}

              {/* Delegation Detail Box */}
              {(() => {
                const pic = getUnitPic(selectedUnit.id);
                return (
                  <div className="delegate-info-box">
                    <div className="delegate-info-left">
                      <div className="delegate-info-title has-tooltip" data-tooltip="Karyawan/PIC penanggung jawab operasional harian akun brand ini.">Nama Delegasi Penanggung Jawab</div>
                      <div className="delegate-info-val">
                        {pic ? (
                          <span className="delegate-val-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <UserIcon size={16} color="var(--primary)" /> {pic.pic_name}
                          </span>
                        ) : (
                          <span className="delegate-val-empty" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <WarningIcon size={14} color="var(--critical)" /> Belum Ditetapkan
                          </span>
                        )}
                      </div>
                      {pic && (
                        <div className="delegate-info-meta">
                          Ditugaskan oleh: <strong>{pic.delegated_by}</strong> pada {new Date(pic.delegated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                    {currentUser.role === 'ADMIN' && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}
                        onClick={() => {
                          setNewPic({ picName: pic ? pic.pic_name : '', businessUnitId: selectedUnit.id });
                          setIsDelegationOpen(true);
                        }}
                      >
                        {pic ? 'Ubah Delegasi' : 'Atur Nama'}
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Social Accounts Content Area */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                  Status Keamanan Akun Sosial Media
                </h3>

                {socialAccounts.filter(s => s.business_unit_id === selectedUnit.id).length === 0 ? (
                  <div className="empty-state" style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                    <span><MegaphoneIcon size={48} color="var(--text-muted)" /></span>
                    <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Belum ada akun sosial media terdaftar.</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>Silakan tambahkan akun sosial media untuk brand ini agar dapat di-audit.</p>
                    <button className="btn" onClick={() => setIsAddSocialOpen(true)}>
                      Tambah Akun Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="social-grid">
                    {socialAccounts.filter(s => s.business_unit_id === selectedUnit.id).map(acc => {
                      const audit = getAccountAudit(acc.id);
                      let statusClass = 'warning';
                      let statusText = 'Belum Diaudit';

                      if (audit) {
                        statusText = audit.status;
                        if (audit.status === 'Safe') statusClass = 'safe';
                        if (audit.status === 'Critical') statusClass = 'critical';
                      }

                      return (
                        <div key={acc.id} className="social-account-card">
                          <div className="social-card-header">
                            <div className="platform-identity">
                              <span style={{ 
                                color: acc.platform === 'instagram' ? '#e1306c' : 
                                       acc.platform === 'facebook' ? '#1877f2' : 
                                       acc.platform === 'twitter' || acc.platform === 'x' ? '#0f172a' : 
                                       acc.platform === 'youtube' ? '#ff0000' : 
                                       acc.platform === 'tiktok' ? '#000000' : 'var(--text-muted)',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}>
                                {renderPlatformIcon(acc.platform, 22)}
                              </span>
                              <a href={acc.url} target="_blank" rel="noreferrer" className="platform-handle">
                                @{acc.handle}
                              </a>
                            </div>
                            <span 
                              className={`mra-badge ${statusClass} audit-status-badge has-tooltip`}
                              data-tooltip={
                                statusText === 'Safe' ? 'Sandi kuat, diubah kurang dari 90 hari, dan 2FA aktif.' : 
                                statusText === 'Warning' ? 'Sandi sedang/kedaluwarsa ringan, atau 2FA belum aktif.' : 
                                statusText === 'Critical' ? 'Sandi lemah/kedaluwarsa berat, dan 2FA mati.' : 
                                'Akun belum diaudit oleh PIC.'
                              }
                            >
                              {statusText}
                            </span>
                          </div>

                          <div className="social-card-details">
                            <div className="detail-row">
                              <span>Password Umur:</span>
                              <span>
                                {audit ? (
                                  `${Math.floor((new Date() - new Date(audit.last_password_changed_at)) / (1000 * 60 * 60 * 24))} hari`
                                ) : (
                                  '-'
                                )}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span>Autentikasi 2FA:</span>
                              <span style={{ fontWeight: 700, color: audit?.has_two_factor_auth ? 'var(--safe-text)' : 'var(--critical-text)' }}>
                                {audit ? (audit.has_two_factor_auth ? 'AKTIF' : 'MATI') : '-'}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span>Kekuatan Sandi:</span>
                              <span>{audit ? audit.password_strength : '-'}</span>
                            </div>
                          </div>

                          {audit && audit.vulnerabilities_notes && (
                            <div style={{ fontSize: '0.78rem', background: 'white', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                              <strong>Notes:</strong> "{audit.vulnerabilities_notes}"
                            </div>
                          )}

                          <button 
                            className="btn btn-secondary" 
                            style={{ width: '100%', marginTop: '6px' }}
                            onClick={() => {
                              setSelectedAccount(acc);
                              if (audit) {
                                setAuditForm({
                                  last_password_changed_at: audit.last_password_changed_at,
                                  has_two_factor_auth: audit.has_two_factor_auth,
                                  password_strength: audit.password_strength,
                                  vulnerabilities_notes: audit.vulnerabilities_notes
                                });
                              } else {
                                setAuditForm({
                                  last_password_changed_at: '',
                                  has_two_factor_auth: false,
                                  password_strength: 'Medium',
                                  vulnerabilities_notes: ''
                                });
                              }
                              setIsAuditFormOpen(true);
                            }}
                          >
                            <AuditIcon size={14} /> Jalankan Audit Keamanan
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="detail-card" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <div className="empty-state">
                <span><ArrowLeftIcon size={48} color="var(--text-muted)" /></span>
                <h2>Silakan pilih brand dari menu list sidebar</h2>
                <p>Klik nama unit bisnis di sidebar sebelah kiri untuk melihat detail status audit keamanan dan delegasi.</p>
              </div>
            </div>
          )}
        </section>
      </main>
      ) : (
        renderReportView()
      )}

      {/* Modal: Atur Nama Delegasi */}
      {isDelegationOpen && selectedUnit && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h2>Atur Nama Delegasi: {selectedUnit.name}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delegasikan tanggung jawab monitoring akun brand kepada PIC/Karyawan.</p>
            </div>
            
            <form onSubmit={handleDelegatePic}>
              <div className="form-group">
                <label>Nama Delegasi (PIC / Catatan Bebas)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Masukkan nama delegasi (misal: Budi MRA, Agensi Digital, dsb.)"
                  value={newPic.picName}
                  onChange={e => setNewPic({ ...newPic, picName: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <input type="hidden" value={newPic.businessUnitId} />
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsDelegationOpen(false)}>Batal</button>
                <button type="submit" className="btn">Simpan Nama</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Akun Sosial Media Baru */}
      {isAddSocialOpen && selectedUnit && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h2>Tambah Akun Sosial Media</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mendaftarkan platform sosial media baru untuk brand <strong>{selectedUnit.name}</strong>.</p>
            </div>

            <form onSubmit={handleAddSocial}>
              <div className="form-group">
                <label>Platform Sosial Media</label>
                <select 
                  className="form-control"
                  value={newSocial.platform}
                  onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })}
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div className="form-group">
                <label>Username / Handle</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="bazaarindonesia (tanpa @)"
                  value={newSocial.handle}
                  onChange={e => setNewSocial({ ...newSocial, handle: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tautan URL Akun</label>
                <input 
                  type="url"
                  className="form-control"
                  placeholder="https://www.instagram.com/bazaarindonesia/"
                  value={newSocial.url}
                  onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddSocialOpen(false)}>Batal</button>
                <button type="submit" className="btn">Daftarkan Akun</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Form Audit Sosial Media */}
      {isAuditFormOpen && selectedAccount && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Audit Keamanan: @{selectedAccount.handle}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Melaporkan kepatuhan audit untuk akun platform <strong>{selectedAccount.platform}</strong>.</p>
            </div>
            
            <form onSubmit={handleSubmitAudit}>
              <div className="form-group">
                <label>Tanggal Terakhir Sandi Diubah</label>
                <input 
                  type="text" 
                  ref={flatpickrRef}
                  className="form-control"
                  placeholder="Pilih tanggal..."
                  value={auditForm.last_password_changed_at}
                  onChange={e => setAuditForm({ ...auditForm, last_password_changed_at: e.target.value })}
                  required
                  style={{ background: 'white', cursor: 'pointer' }}
                />
              </div>

              <div className="form-group">
                <label>Kekuatan Kata Sandi</label>
                <select 
                  className="form-control"
                  value={auditForm.password_strength}
                  onChange={e => setAuditForm({ ...auditForm, password_strength: e.target.value })}
                >
                  <option value="Strong">Strong (Simbol, Angka, & Huruf Besar/Kecil)</option>
                  <option value="Medium">Medium (Hanya Huruf & Angka, &gt;8 karakter)</option>
                  <option value="Weak">Weak (Mudah ditebak / &lt;8 karakter)</option>
                </select>
              </div>

              <div className="form-group checkbox-group" style={{ margin: '14px 0 20px 0' }}>
                <input 
                  type="checkbox" 
                  id="twoFactorCheckbox"
                  checked={auditForm.has_two_factor_auth}
                  onChange={e => setAuditForm({ ...auditForm, has_two_factor_auth: e.target.checked })}
                />
                <label htmlFor="twoFactorCheckbox" style={{ margin: 0, cursor: 'pointer', fontSize: '0.85rem' }}>
                  Autentikasi Dua Faktor (2FA) diaktifkan & aktif
                </label>
              </div>

              <div className="form-group">
                <label>Catatan Kerentanan Keamanan (Opsional)</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="Contoh: Email recovery tidak menggunakan email kantor resmi, dsb."
                  value={auditForm.vulnerabilities_notes}
                  onChange={e => setAuditForm({ ...auditForm, vulnerabilities_notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAuditFormOpen(false)}>Batal</button>
                <button type="submit" className="btn">Simpan Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
