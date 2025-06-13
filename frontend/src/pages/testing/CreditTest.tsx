import React, { useState } from 'react';
import { useApi } from '../../lib/api';
import { useAuth } from '../../lib/auth';

// Testovací komponenta pro ověření funkčnosti kreditního systému
const CreditTest: React.FC = () => {
  const { user } = useAuth();
  const { getCredits, purchaseCredits, useCredits, getCreditTransactions } = useApi();
  
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    getCredits: null,
    purchaseCredits: null,
    useCredits: null,
    getCreditTransactions: null
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  
  const addToLog = (message: string) => {
    setTestLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const runTest = async (testName: string, testFunction: () => Promise<boolean>) => {
    setLoading(true);
    setCurrentTest(testName);
    addToLog(`Spouštím test: ${testName}`);
    
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      addToLog(`Test ${testName}: ${result ? 'ÚSPĚCH' : 'SELHÁNÍ'}`);
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [testName]: false }));
      addToLog(`Test ${testName} selhal s chybou: ${error.message}`);
    } finally {
      setLoading(false);
      setCurrentTest(null);
    }
  };
  
  const testGetCredits = async () => {
    try {
      addToLog('Načítám stav kreditů');
      
      const response = await getCredits();
      
      if (response.status === 'success' && response.data && response.data.credits) {
        setCreditBalance(response.data.credits.balance);
        addToLog(`Aktuální stav kreditů: ${response.data.credits.balance}`);
        return true;
      } else {
        addToLog('Načtení stavu kreditů selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při načítání stavu kreditů: ${error.message}`);
      return false;
    }
  };
  
  const testPurchaseCredits = async () => {
    try {
      const amount = 10;
      const paymentMethod = 'test_card';
      
      addToLog(`Nakupuji ${amount} kreditů pomocí platební metody: ${paymentMethod}`);
      
      const response = await purchaseCredits(amount, paymentMethod);
      
      if (response.status === 'success') {
        addToLog(`Nákup kreditů úspěšný, nový zůstatek: ${response.data?.credits?.balance || 'neznámý'}`);
        if (response.data?.credits?.balance) {
          setCreditBalance(response.data.credits.balance);
        }
        return true;
      } else {
        addToLog('Nákup kreditů selhal');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při nákupu kreditů: ${error.message}`);
      return false;
    }
  };
  
  const testUseCredits = async () => {
    try {
      // Pro testování potřebujeme ID nemovitosti
      // V reálném testu bychom nejprve vytvořili testovací nemovitost
      const testPropertyId = 'test_property_id';
      
      addToLog(`Používám kredity pro přístup k nemovitosti s ID: ${testPropertyId}`);
      
      const response = await useCredits(testPropertyId);
      
      if (response.status === 'success') {
        addToLog(`Použití kreditů úspěšné, nový zůstatek: ${response.data?.credits?.balance || 'neznámý'}`);
        if (response.data?.credits?.balance) {
          setCreditBalance(response.data.credits.balance);
        }
        return true;
      } else {
        addToLog('Použití kreditů selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při použití kreditů: ${error.message}`);
      return false;
    }
  };
  
  const testGetCreditTransactions = async () => {
    try {
      addToLog('Načítám historii transakcí');
      
      const response = await getCreditTransactions();
      
      if (response.status === 'success' && response.data && Array.isArray(response.data.transactions)) {
        addToLog(`Načteno ${response.data.transactions.length} transakcí`);
        return true;
      } else {
        addToLog('Načtení historie transakcí selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při načítání historie transakcí: ${error.message}`);
      return false;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Testování kreditního systému</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Testy</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => runTest('getCredits', testGetCredits)}
              disabled={loading || user?.user_type !== 'agent'}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.getCredits === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.getCredits
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'getCredits' ? 'Probíhá...' : 'Test načtení stavu kreditů'}
            </button>
            
            <button
              onClick={() => runTest('purchaseCredits', testPurchaseCredits)}
              disabled={loading || user?.user_type !== 'agent'}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.purchaseCredits === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.purchaseCredits
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'purchaseCredits' ? 'Probíhá...' : 'Test nákupu kreditů'}
            </button>
            
            <button
              onClick={() => runTest('useCredits', testUseCredits)}
              disabled={loading || user?.user_type !== 'agent' || !creditBalance || creditBalance < 5}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.useCredits === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.useCredits
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'useCredits' ? 'Probíhá...' : 'Test použití kreditů'}
            </button>
            
            <button
              onClick={() => runTest('getCreditTransactions', testGetCreditTransactions)}
              disabled={loading || user?.user_type !== 'agent'}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.getCreditTransactions === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.getCreditTransactions
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'getCreditTransactions' ? 'Probíhá...' : 'Test historie transakcí'}
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Log</h2>
          
          <div className="bg-gray-100 p-4 rounded-md h-80 overflow-y-auto">
            {testLog.length === 0 ? (
              <p className="text-gray-500">Zatím nebyly spuštěny žádné testy.</p>
            ) : (
              <div className="space-y-1">
                {testLog.map((log, index) => (
                  <p key={index} className="text-sm font-mono">
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Aktuální stav</h2>
        
        <div className="bg-gray-100 p-4 rounded-md">
          <p>
            <strong>Přihlášený uživatel:</strong>{' '}
            {user ? `${user.full_name} (${user.email})` : 'Nikdo není přihlášen'}
          </p>
          <p>
            <strong>Typ uživatele:</strong>{' '}
            {user ? (user.user_type === 'agent' ? 'Makléř' : 'Prodávající') : 'N/A'}
          </p>
          <p>
            <strong>Stav kreditů:</strong>{' '}
            {creditBalance !== null ? creditBalance : 'Neznámý'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditTest;
