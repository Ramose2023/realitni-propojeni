import React, { useState } from 'react';

// Komponenta pro testování výkonu aplikace
const PerformanceTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    loadTime: null,
    apiResponseTime: null,
    imageLoading: null,
    listRendering: null,
    formSubmission: null
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<{[key: string]: number | null}>({
    pageLoadTime: null,
    apiResponseTime: null,
    imageLoadTime: null,
    listRenderTime: null,
    formSubmitTime: null
  });
  
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
  
  // Test času načítání stránky
  const testLoadTime = async () => {
    addToLog('Testování času načítání stránky...');
    
    const startTime = performance.now();
    
    // Simulace načítání stránky
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
    
    addToLog(`Čas načítání stránky: ${loadTime.toFixed(2)} ms`);
    
    // Považujeme test za úspěšný, pokud je čas načítání pod 1000 ms
    return loadTime < 1000;
  };
  
  // Test času odezvy API
  const testApiResponseTime = async () => {
    addToLog('Testování času odezvy API...');
    
    const startTime = performance.now();
    
    // Simulace API volání
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    setMetrics(prev => ({ ...prev, apiResponseTime: responseTime }));
    
    addToLog(`Čas odezvy API: ${responseTime.toFixed(2)} ms`);
    
    // Považujeme test za úspěšný, pokud je čas odezvy pod 500 ms
    return responseTime < 500;
  };
  
  // Test načítání obrázků
  const testImageLoading = async () => {
    addToLog('Testování načítání obrázků...');
    
    const startTime = performance.now();
    
    // Simulace načítání obrázků
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const endTime = performance.now();
    const imageLoadTime = endTime - startTime;
    
    setMetrics(prev => ({ ...prev, imageLoadTime: imageLoadTime }));
    
    addToLog(`Čas načítání obrázků: ${imageLoadTime.toFixed(2)} ms`);
    
    // Považujeme test za úspěšný, pokud je čas načítání pod 1000 ms
    return imageLoadTime < 1000;
  };
  
  // Test vykreslování seznamu
  const testListRendering = async () => {
    addToLog('Testování vykreslování seznamu...');
    
    const startTime = performance.now();
    
    // Simulace vykreslování seznamu
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    setMetrics(prev => ({ ...prev, listRenderTime: renderTime }));
    
    addToLog(`Čas vykreslování seznamu: ${renderTime.toFixed(2)} ms`);
    
    // Považujeme test za úspěšný, pokud je čas vykreslování pod 300 ms
    return renderTime < 300;
  };
  
  // Test odeslání formuláře
  const testFormSubmission = async () => {
    addToLog('Testování odeslání formuláře...');
    
    const startTime = performance.now();
    
    // Simulace odeslání formuláře
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const endTime = performance.now();
    const submitTime = endTime - startTime;
    
    setMetrics(prev => ({ ...prev, formSubmitTime: submitTime }));
    
    addToLog(`Čas odeslání formuláře: ${submitTime.toFixed(2)} ms`);
    
    // Považujeme test za úspěšný, pokud je čas odeslání pod 600 ms
    return submitTime < 600;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Testování výkonu aplikace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Testy</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => runTest('loadTime', testLoadTime)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.loadTime === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.loadTime
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'loadTime' ? 'Probíhá...' : 'Test času načítání stránky'}
            </button>
            
            <button
              onClick={() => runTest('apiResponseTime', testApiResponseTime)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.apiResponseTime === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.apiResponseTime
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'apiResponseTime' ? 'Probíhá...' : 'Test času odezvy API'}
            </button>
            
            <button
              onClick={() => runTest('imageLoading', testImageLoading)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.imageLoading === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.imageLoading
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'imageLoading' ? 'Probíhá...' : 'Test načítání obrázků'}
            </button>
            
            <button
              onClick={() => runTest('listRendering', testListRendering)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.listRendering === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.listRendering
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'listRendering' ? 'Probíhá...' : 'Test vykreslování seznamu'}
            </button>
            
            <button
              onClick={() => runTest('formSubmission', testFormSubmission)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md ${
                testResults.formSubmission === null
                  ? 'bg-gray-200 text-gray-800'
                  : testResults.formSubmission
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              } hover:opacity-90 disabled:opacity-50`}
            >
              {currentTest === 'formSubmission' ? 'Probíhá...' : 'Test odeslání formuláře'}
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
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-4">Výsledky měření</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Čas načítání stránky</h3>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.pageLoadTime !== null ? `${metrics.pageLoadTime.toFixed(2)} ms` : 'N/A'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Čas odezvy API</h3>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.apiResponseTime !== null ? `${metrics.apiResponseTime.toFixed(2)} ms` : 'N/A'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Čas načítání obrázků</h3>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.imageLoadTime !== null ? `${metrics.imageLoadTime.toFixed(2)} ms` : 'N/A'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Čas vykreslování seznamu</h3>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.listRenderTime !== null ? `${metrics.listRenderTime.toFixed(2)} ms` : 'N/A'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Čas odeslání formuláře</h3>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.formSubmitTime !== null ? `${metrics.formSubmitTime.toFixed(2)} ms` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTest;
