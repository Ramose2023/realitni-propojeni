import React from 'react';

// Komponenta pro testování uživatelských toků
const TestingPlan: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Plán testování aplikace</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Testování autentizace</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Registrace nového uživatele (prodávající)</li>
          <li>Registrace nového uživatele (makléř)</li>
          <li>Přihlášení pomocí emailu a hesla</li>
          <li>Přihlášení pomocí Google účtu</li>
          <li>Odhlášení uživatele</li>
          <li>Ověření přesměrování na správné stránky po přihlášení</li>
          <li>Ověření ochrany chráněných stránek před nepřihlášenými uživateli</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Testování pro prodávající</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Vytvoření nového inzerátu nemovitosti</li>
          <li>Nahrání fotografií k nemovitosti</li>
          <li>Editace existující nemovitosti</li>
          <li>Zobrazení seznamu vlastních nemovitostí</li>
          <li>Zobrazení detailu nemovitosti</li>
          <li>Zobrazení nabídek od makléřů</li>
          <li>Porovnání nabídek od makléřů</li>
          <li>Udělení přístupu ke kontaktům vybranému makléři</li>
          <li>Deaktivace/aktivace inzerátu</li>
          <li>Označení nemovitosti jako prodané</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Testování pro makléře</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Zobrazení seznamu dostupných nemovitostí</li>
          <li>Zobrazení detailu nemovitosti</li>
          <li>Vytvoření nabídky na nemovitost</li>
          <li>Zobrazení seznamu vlastních nabídek</li>
          <li>Editace existující nabídky</li>
          <li>Dobití kreditů</li>
          <li>Zobrazení historie transakcí kreditů</li>
          <li>Použití kreditů pro získání přístupu ke kontaktům</li>
          <li>Zobrazení kontaktních údajů po získání přístupu</li>
          <li>Nahrání videoprezentace</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Testování responzivity</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Testování na mobilních zařízeních (různé velikosti obrazovky)</li>
          <li>Testování na tabletech</li>
          <li>Testování na desktopech (různé rozlišení)</li>
          <li>Ověření funkčnosti navigace na všech zařízeních</li>
          <li>Ověření čitelnosti a použitelnosti formulářů na všech zařízeních</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Testování bezpečnosti</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ověření ochrany API endpointů</li>
          <li>Testování autorizace (přístup pouze k vlastním datům)</li>
          <li>Ověření bezpečnosti kreditního systému</li>
          <li>Testování ochrany kontaktních údajů prodávajících</li>
          <li>Ověření bezpečnosti nahrávání souborů</li>
          <li>Testování validace vstupních dat</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">6. Testování výkonu</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Testování načítání seznamu nemovitostí</li>
          <li>Testování nahrávání fotografií</li>
          <li>Ověření rychlosti odezvy API</li>
          <li>Testování současného přístupu více uživatelů</li>
        </ul>
      </div>
    </div>
  );
};

export default TestingPlan;
