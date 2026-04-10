import React from 'react';
import Landing from './pages/Landing';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Landing />
    </>
  );
}
