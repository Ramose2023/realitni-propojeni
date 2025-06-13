import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="h-full flex flex-col justify-center items-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Realitní Propojení</h1>
          <p className="text-xl text-center">
            Propojujeme prodávající nemovitostí s realitními makléři pro efektivní a transparentní spolupráci.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
