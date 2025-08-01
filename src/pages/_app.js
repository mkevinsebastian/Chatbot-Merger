// src/pages/_app.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css'; // Import global CSS

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Daftar rute yang TIDAK memerlukan login
    const publicPaths = ['/login', '/signup'];

    // Cek apakah pengguna sudah login
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // Jika pengguna belum login DAN mencoba mengakses halaman yang dilindungi
    if (!isLoggedIn && !publicPaths.includes(router.pathname)) {
      router.push('/login'); // Arahkan ke halaman login
    }
  }, [router.pathname]); // Pantau perubahan rute

  return <Component {...pageProps} />;
}

export default MyApp;