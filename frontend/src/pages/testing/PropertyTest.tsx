import React, { useState } from 'react';
import { useApi } from '../../lib/api';
import { useAuth } from '../../lib/auth';

// Testovací komponenta pro ověření funkčnosti správy nemovitostí
const PropertyTest: React.FC = () => {
  const { user } = useAuth();
  const { createProperty, getProperties, getPropertyDetail, updateProperty, deleteProperty, uploadPropertyMedia } = useApi();
  
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    createProperty: null,
    getProperties: null,
    getPropertyDetail: null,
    updateProperty: null,
    uploadMedia: null,
    deleteProperty: null
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<string[]>([]);
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
  
  const testCreateProperty = async () => {
    try {
      const testProperty = {
        property_type: 'apartment',
        description: `Testovací nemovitost vytvořená ${new Date().toLocaleString()}`,
        street: 'Testovací ulice',
        house_number: '123',
        city: 'Praha',
        postal_code: '12000',
        parcel_number: 'TEST123',
        municipality: 'Praha',
        cadastral_area: 'Testovací katastr'
      };
      
      addToLog(`Vytvářím testovací nemovitost: ${testProperty.street}, ${testProperty.city}`);
      
      const response = await createProperty(testProperty);
      
      if (response.status === 'success' && response.data && response.data.property) {
        setTestPropertyId(response.data.property.id);
        addToLog(`Nemovitost vytvořena s ID: ${response.data.property.id}`);
        return true;
      } else {
        addToLog('Vytvoření nemovitosti selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při vytváření nemovitosti: ${error.message}`);
      return false;
    }
  };
  
  const testGetProperties = async () => {
    try {
      addToLog('Načítám seznam nemovitostí');
      
      const response = await getProperties();
      
      if (response.status === 'success' && response.data && Array.isArray(response.data.properties)) {
        addToLog(`Načteno ${response.data.properties.length} nemovitostí`);
        return true;
      } else {
        addToLog('Načtení seznamu nemovitostí selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při načítání nemovitostí: ${error.message}`);
      return false;
    }
  };
  
  const testGetPropertyDetail = async () => {
    if (!testPropertyId) {
      addToLog('Nelze načíst detail nemovitosti - není k dispozici ID testovací nemovitosti');
      return false;
    }
    
    try {
      addToLog(`Načítám detail nemovitosti s ID: ${testPropertyId}`);
      
      const response = await getPropertyDetail(testPropertyId);
      
      if (response.status === 'success' && response.data && response.data.property) {
        addToLog(`Detail nemovitosti načten: ${response.data.property.street}, ${response.data.property.city}`);
        return true;
      } else {
        addToLog('Načtení detailu nemovitosti selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při načítání detailu nemovitosti: ${error.message}`);
      return false;
    }
  };
  
  const testUpdateProperty = async () => {
    if (!testPropertyId) {
      addToLog('Nelze aktualizovat nemovitost - není k dispozici ID testovací nemovitosti');
      return false;
    }
    
    try {
      const updateData = {
        description: `Aktualizovaný popis nemovitosti ${new Date().toLocaleString()}`
      };
      
      addToLog(`Aktualizuji nemovitost s ID: ${testPropertyId}`);
      
      const response = await updateProperty(testPropertyId, updateData);
      
      if (response.status === 'success') {
        addToLog('Nemovitost úspěšně aktualizována');
        return true;
      } else {
        addToLog('Aktualizace nemovitosti selhala');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při aktualizaci nemovitosti: ${error.message}`);
      return false;
    }
  };
  
  const testDeleteProperty = async () => {
    if (!testPropertyId) {
      addToLog('Nelze smazat nemovitost - není k dispozici ID testovací nemovitosti');
      return false;
    }
    
    try {
      addToLog(`Mažu nemovitost s ID: ${testPropertyId}`);
      
      const response = await deleteProperty(testPropertyId);
      
      if (response.status === 'success') {
        addToLog('Nemovitost úspěšně smazána');
        setTestPropertyId(null);
        return true;
      } else {
        addToLog('Smazání nemovitosti selhalo');
        return false;
      }
    } catch (error: any) {
      addToLog(`Chyba při mazání nemovitosti: ${error.message}`);
      return false;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Testování správy nemovitostí</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Testy</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => runTest('createProperty', testCreateProperty)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.createProperty === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.createProperty
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'createProperty' ? 'Probíhá...' : 'Test vytvoření nemovitosti'}
            </button>
            
            <button
              onClick={() => runTest('getProperties', testGetProperties)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.getProperties === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.getProperties
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'getProperties' ? 'Probíhá...' : 'Test načtení seznamu nemovitostí'}
            </button>
            
            <button
              onClick={() => runTest('getPropertyDetail', testGetPropertyDetail)}
              disabled={loading || !testPropertyId}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.getPropertyDetail === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.getPropertyDetail
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'getPropertyDetail' ? 'Probíhá...' : 'Test načtení detailu nemovitosti'}
            </button>
            
            <button
              onClick={() => runTest('updateProperty', testUpdateProperty)}
              disabled={loading || !testPropertyId}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.updateProperty === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.updateProperty
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'updateProperty' ? 'Probíhá...' : 'Test aktualizace nemovitosti'}
            </button>
            
            <button
              onClick={() => runTest('deleteProperty', testDeleteProperty)}
              disabled={loading || !testPropertyId}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.deleteProperty === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.deleteProperty
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'deleteProperty' ? 'Probíhá...' : 'Test smazání nemovitosti'}
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
            <strong>ID testovací nemovitosti:</strong>{' '}
            {testPropertyId || 'Není k dispozici'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyTest;
