import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Chyba při odhlášení:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-blue-600">Realitní Propojení</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Domů
                </Link>
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                    {user.user_type === 'seller' && (
                      <Link
                        to="/properties"
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                      >
                        Moje nemovitosti
                      </Link>
                    )}
                    {user.user_type === 'agent' && (
                      <>
                        <Link
                          to="/properties"
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                          Nemovitosti
                        </Link>
                        <Link
                          to="/offers"
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                          Moje nabídky
                        </Link>
                        <Link
                          to="/dashboard/credits"
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                          Kredity
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="mr-4 text-sm font-medium text-gray-700">
                      {user.full_name}
                    </span>
                    <Link
                      to="/dashboard/profile"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Odhlásit se
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Přihlásit se
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium rounded-md text-blue-600 bg-white border border-blue-600 hover:bg-blue-50"
                  >
                    Registrovat se
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            {/* Mobilní menu - implementace by pokračovala zde */}
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
