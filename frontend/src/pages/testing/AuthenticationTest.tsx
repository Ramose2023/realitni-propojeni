import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useApi } from '../../lib/api';

// Testovací komponenta pro ověření funkčnosti autentizace
const AuthenticationTest: React.FC = () => {
  const { user, signUp, signIn, signInWithGoogle, signOut } = useAuth();
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    registerSeller: null,
    registerAgent: null,
    loginEmail: null,
    loginGoogle: null,
    logout: null
  });
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<string[]>([]);
  
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
  
  const testRegisterSeller = async () => {
    try {
      const testEmail = `test_seller_${Date.now()}@example.com`;
      const testPassword = 'Test123456';
      
      addToLog(`Registruji testovacího prodávajícího: ${testEmail}`);
      
      await signUp(
        testEmail,
        testPassword,
        {
          user_type: 'seller',
          full_name: 'Test Prodávající',
          phone: '123456789'
        }
      );
      
      addToLog('Registrace prodávajícího úspěšná');
      return true;
    } catch (error: any) {
      addToLog(`Chyba při registraci prodávajícího: ${error.message}`);
      return false;
    }
  };
  
  const testRegisterAgent = async () => {
    try {
      const testEmail = `test_agent_${Date.now()}@example.com`;
      const testPassword = 'Test123456';
      
      addToLog(`Registruji testovacího makléře: ${testEmail}`);
      
      await signUp(
        testEmail,
        testPassword,
        {
          user_type: 'agent',
          full_name: 'Test Makléř',
          phone: '987654321'
        }
      );
      
      addToLog('Registrace makléře úspěšná');
      return true;
    } catch (error: any) {
      addToLog(`Chyba při registraci makléře: ${error.message}`);
      return false;
    }
  };
  
  const testLoginEmail = async () => {
    try {
      // Pro testování použijeme existující účet
      const testEmail = 'test@example.com';
      const testPassword = 'Test123456';
      
      addToLog(`Přihlašuji uživatele: ${testEmail}`);
      
      await signIn(testEmail, testPassword);
      
      if (user) {
        addToLog('Přihlášení úspěšné');
        return true;
      } else {
        addToLog('Přihlášení selhalo - uživatel není přihlášen');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při přihlášení: ${error.message}`);
      return false;
    }
  };
  
  const testLogout = async () => {
    try {
      addToLog('Odhlašuji uživatele');
      
      await signOut();
      
      if (!user) {
        addToLog('Odhlášení úspěšné');
        return true;
      } else {
        addToLog('Odhlášení selhalo - uživatel je stále přihlášen');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při odhlášení: ${error.message}`);
      return false;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Testování autentizace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Testy</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => runTest('registerSeller', testRegisterSeller)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.registerSeller === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.registerSeller
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'registerSeller' ? 'Probíhá...' : 'Test registrace prodávajícího'}
            </button>
            
            <button
              onClick={() => runTest('registerAgent', testRegisterAgent)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.registerAgent === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.registerAgent
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'registerAgent' ? 'Probíhá...' : 'Test registrace makléře'}
            </button>
            
            <button
              onClick={() => runTest('loginEmail', testLoginEmail)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.loginEmail === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.loginEmail
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'loginEmail' ? 'Probíhá...' : 'Test přihlášení emailem'}
            </button>
            
            <button
              onClick={() => runTest('logout', testLogout)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.logout === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.logout
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'logout' ? 'Probíhá...' : 'Test odhlášení'}
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
        </div>
      </div>
    </div>
  );
};

export default AuthenticationTest;
