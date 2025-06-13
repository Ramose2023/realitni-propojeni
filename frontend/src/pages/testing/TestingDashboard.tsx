import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Hlavní testovací dashboard
const TestingDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState({
    authentication: false,
    properties: false,
    offers: false,
    credits: false,
    security: false,
    performance: false
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Testovací Dashboard</h1>
      
      <div className="mb-8">
        <p className="text-gray-700 mb-4">
          Tento dashboard slouží k systematickému testování všech funkcí aplikace před nasazením.
          Vyberte kategorii testů, které chcete spustit.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-lg shadow-md ${testResults.authentication ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <h2 className="text-xl font-semibold mb-3">Autentizace</h2>
          <p className="text-gray-600 mb-4">
            Testování registrace, přihlášení a správy uživatelských účtů.
          </p>
          <Link
            to="/testing/authentication"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Spustit testy
          </Link>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${testResults.properties ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <h2 className="text-xl font-semibold mb-3">Nemovitosti</h2>
          <p className="text-gray-600 mb-4">
            Testování vytváření, úpravy a správy nemovitostí.
          </p>
          <Link
            to="/testing/properties"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Spustit testy
          </Link>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${testResults.offers ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <h2 className="text-xl font-semibold mb-3">Nabídky</h2>
          <p className="text-gray-600 mb-4">
            Testování vytváření a správy nabídek makléřů.
          </p>
          <Link
            to="/testing/offers"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Spustit testy
          </Link>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${testResults.credits ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <h2 className="text-xl font-semibold mb-3">Kreditní systém</h2>
          <p className="text-gray-600 mb-4">
            Testování nákupu a použití kreditů, platebního systému.
          </p>
          <Link
            to="/testing/credits"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Spustit testy
          </Link>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${testResults.security ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <h2 className="text-xl font-semibold mb-3">Bezpečnost</h2>
          <p className="text-gray-600 mb-4">
            Testování autorizace, ochrany dat a bezpečnostních mechanismů.
          </p>
          <Link
            to="/testing/security"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Spustit testy
          </Link>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${testResults.performance ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <h2 className="text-xl font-semibold mb-3">Výkon</h2>
          <p className="text-gray-600 mb-4">
            Testování rychlosti načítání a odezvy aplikace.
          </p>
          <Link
            to="/testing/performance"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Spustit testy
          </Link>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-3">Plán testování</h2>
        <p className="text-gray-700 mb-4">
          Pro kompletní přehled testovacího plánu a pokrytí všech funkcí aplikace navštivte stránku s plánem testování.
        </p>
        <Link
          to="/testing/plan"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Zobrazit plán testování
        </Link>
      </div>
    </div>
  );
};

export default TestingDashboard;
