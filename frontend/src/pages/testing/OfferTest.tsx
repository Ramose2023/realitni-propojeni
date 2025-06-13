import React, { useState } from 'react';
import { useApi } from '../../lib/api';
import { useAuth } from '../../lib/auth';

// Testovací komponenta pro ověření funkčnosti nabídek makléřů
const OfferTest: React.FC = () => {
  const { user } = useAuth();
  const { createOffer, getOffers, getOfferDetail, updateOffer, deleteOffer, grantAccess } = useApi();
  
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    createOffer: null,
    getOffers: null,
    getOfferDetail: null,
    updateOffer: null,
    deleteOffer: null,
    grantAccess: null
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [testOfferId, setTestOfferId] = useState<string | null>(null);
  const [testPropertyId, setTestPropertyId] = useState<string | null>(null);
  
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
  
  const testCreateOffer = async () => {
    // Pro testování potřebujeme ID nemovitosti
    // V reálném testu bychom nejprve vytvořili testovací nemovitost
    if (!testPropertyId) {
      addToLog('Nelze vytvořit nabídku - není k dispozici ID testovací nemovitosti');
      return false;
    }
    
    try {
      const testOffer = {
        property_id: testPropertyId,
        commission_percentage: 3,
        commission_amount: 50000,
        price_estimate_min: 2000000,
        price_estimate_max: 2500000,
        included_services: {
          photos: true,
          video: false,
          drone: false,
          home_staging: false,
          web: true,
          auction: false,
          sreality: true
        },
        additional_services: {
          photos: { included: true, price: 0 },
          video: { included: false, price: 5000 },
          drone: { included: false, price: 3000 },
          home_staging: { included: false, price: 10000 },
          web: { included: true, price: 0 },
          auction: { included: false, price: 15000 },
          sreality: { included: true, price: 0 }
        },
        video_presentation_url: 'https://example.com/video'
      };
      
      addToLog(`Vytvářím testovací nabídku pro nemovitost: ${testPropertyId}`);
      
      const response = await createOffer(testOffer);
      
      if (response.status === 'success' && response.data && response.data.offer) {
        setTestOfferId(response.data.offer.id);
        addToLog(`Nabídka vytvořena s ID: ${response.data.offer.id}`);
        return true;
      } else {
        addToLog('Vytvoření nabídky selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při vytváření nabídky: ${error.message}`);
      return false;
    }
  };
  
  const testGetOffers = async () => {
    try {
      addToLog('Načítám seznam nabídek');
      
      const response = await getOffers();
      
      if (response.status === 'success' && response.data && Array.isArray(response.data.offers)) {
        addToLog(`Načteno ${response.data.offers.length} nabídek`);
        return true;
      } else {
        addToLog('Načtení seznamu nabídek selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při načítání nabídek: ${error.message}`);
      return false;
    }
  };
  
  const testGetOfferDetail = async () => {
    if (!testOfferId) {
      addToLog('Nelze načíst detail nabídky - není k dispozici ID testovací nabídky');
      return false;
    }
    
    try {
      addToLog(`Načítám detail nabídky s ID: ${testOfferId}`);
      
      const response = await getOfferDetail(testOfferId);
      
      if (response.status === 'success' && response.data && response.data.offer) {
        addToLog(`Detail nabídky načten: Provize ${response.data.offer.commission_percentage}%`);
        return true;
      } else {
        addToLog('Načtení detailu nabídky selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při načítání detailu nabídky: ${error.message}`);
      return false;
    }
  };
  
  const testUpdateOffer = async () => {
    if (!testOfferId) {
      addToLog('Nelze aktualizovat nabídku - není k dispozici ID testovací nabídky');
      return false;
    }
    
    try {
      const updateData = {
        commission_percentage: 4,
        price_estimate_min: 2100000,
        price_estimate_max: 2600000
      };
      
      addToLog(`Aktualizuji nabídku s ID: ${testOfferId}`);
      
      const response = await updateOffer(testOfferId, updateData);
      
      if (response.status === 'success') {
        addToLog('Nabídka úspěšně aktualizována');
        return true;
      } else {
        addToLog('Aktualizace nabídky selhala');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při aktualizaci nabídky: ${error.message}`);
      return false;
    }
  };
  
  const testDeleteOffer = async () => {
    if (!testOfferId) {
      addToLog('Nelze smazat nabídku - není k dispozici ID testovací nabídky');
      return false;
    }
    
    try {
      addToLog(`Mažu nabídku s ID: ${testOfferId}`);
      
      const response = await deleteOffer(testOfferId);
      
      if (response.status === 'success') {
        addToLog('Nabídka úspěšně smazána');
        setTestOfferId(null);
        return true;
      } else {
        addToLog('Smazání nabídky selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při mazání nabídky: ${error.message}`);
      return false;
    }
  };
  
  const testGrantAccess = async () => {
    if (!testOfferId) {
      addToLog('Nelze udělit přístup - není k dispozici ID testovací nabídky');
      return false;
    }
    
    try {
      addToLog(`Uděluji přístup pro nabídku s ID: ${testOfferId}`);
      
      const response = await grantAccess(testOfferId);
      
      if (response.status === 'success') {
        addToLog('Přístup úspěšně udělen');
        return true;
      } else {
        addToLog('Udělení přístupu selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při udělování přístupu: ${error.message}`);
      return false;
    }
  };
  
  const handleSetTestPropertyId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestPropertyId(e.target.value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Testování nabídek makléřů</h1>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="propertyId">
          ID testovací nemovitosti
        </label>
        <input
          id="propertyId"
          type="text"
          value={testPropertyId || ''}
          onChange={handleSetTestPropertyId}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Zadejte ID nemovitosti pro testování"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Testy</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => runTest('createOffer', testCreateOffer)}
              disabled={loading || !testPropertyId || user?.user_type !== 'agent'}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.createOffer === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.createOffer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'createOffer' ? 'Probíhá...' : 'Test vytvoření nabídky'}
            </button>
            
            <button
              onClick={() => runTest('getOffers', testGetOffers)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.getOffers === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.getOffers
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'getOffers' ? 'Probíhá...' : 'Test načtení seznamu nabídek'}
            </button>
            
            <button
              onClick={() => runTest('getOfferDetail', testGetOfferDetail)}
              disabled={loading || !testOfferId}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.getOfferDetail === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.getOfferDetail
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'getOfferDetail' ? 'Probíhá...' : 'Test načtení detailu nabídky'}
            </button>
            
            <button
              onClick={() => runTest('updateOffer', testUpdateOffer)}
              disabled={loading || !testOfferId || user?.user_type !== 'agent'}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.updateOffer === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.updateOffer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'updateOffer' ? 'Probíhá...' : 'Test aktualizace nabídky'}
            </button>
            
            <button
              onClick={() => runTest('grantAccess', testGrantAccess)}
              disabled={loading || !testOfferId || user?.user_type !== 'seller'}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.grantAccess === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.grantAccess
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'grantAccess' ? 'Probíhá...' : 'Test udělení přístupu'}
            </button>
            
            <button
              onClick={() => runTest('deleteOffer', testDeleteOffer)}
              disabled={loading || !testOfferId || user?.user_type !== 'agent'}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.deleteOffer === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.deleteOffer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'deleteOffer' ? 'Probíhá...' : 'Test smazání nabídky'}
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
            <strong>ID testovací nemovitosti:</strong>{' '}
            {testPropertyId || 'Není k dispozici'}
          </p>
          <p>
            <strong>ID testovací nabídky:</strong>{' '}
            {testOfferId || 'Není k dispozici'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferTest;
