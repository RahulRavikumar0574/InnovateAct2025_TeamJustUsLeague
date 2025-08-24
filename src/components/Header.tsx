'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
}

interface HeaderProps {
  links: NavLink[];
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ links, title = 'Worker Safety Dashboard' }) => {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/60 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          </div>
          <nav className="flex space-x-4 items-center">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const linkClass = [
                'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
                isActive ? 'bg-cyan-500/80 text-white shadow-md dark:bg-cyan-700/80 dark:text-white' : 'text-gray-700 hover:bg-cyan-400/30 hover:text-cyan-700 dark:text-gray-200 dark:hover:bg-cyan-700/30 dark:hover:text-cyan-300',
              ].join(' ');
              return (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M12 6.75a5.25 5.25 0 100 10.5a5.25 5.25 0 000-10.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75c0-4.136 2.664-7.633 6.418-9.076a.75.75 0 01.908.37a.75.75 0 01-.075.809a7.501 7.501 0 0010.298 10.298a.75.75 0 01.809-.075a.75.75 0 01.37.908z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('role');
                  window.location.href = '/auth/login';
                }
              }}
              className="ml-4 px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

