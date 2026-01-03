import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import Callout from '../components/Callout';
import SuccessStories from '../components/SuccessStories';
import Guidelines from '../components/Guidelines';
import FAQ from '../components/FAQ';

export default function Landing() {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <SuccessStories />
      <Callout />
      <Guidelines isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
      <FAQ isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
      <Footer onOpenGuidelines={() => setShowGuidelines(true)} onOpenFAQ={() => setShowFAQ(true)} />
    </>
  );
}
