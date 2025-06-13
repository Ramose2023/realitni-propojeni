import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { useApi } from '../../lib/api';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { getProperties, getOffers, getCredits } = useApi();
  
  const [properties, setProperties] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [credits, setCredits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user?.user_type === 'seller') {
          // Pro prodávající načteme jejich nemovitosti a obdržené nabídky
          const propertiesResponse = await getProperties();
          if (propertiesResponse.status === 'success' && propertiesResponse.data) {
            setProperties(propertiesResponse.data.properties || []);
          }
        } else if (user?.user_type === 'agent') {
          // Pro makléře načteme jejich nabídky a stav kreditů
          const offersResponse = await getOffers();
          if (offersResponse.status === 'success' && offersResponse.data) {
            setOffers(offersResponse.data.offers || []);
          }
          
          const creditsResponse = await getCredits();
          if (creditsResponse.status === 'success' && creditsResponse.data) {
            setCredits(creditsResponse.data.credits);
          }
        }
      } catch (error) {
        console.error('Chyba při načítání dat dashboardu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Vítejte, {user?.full_name}</h2>
        <p className="text-gray-600">
          {user?.user_type === 'seller'
            ? 'Zde můžete spravovat své nemovitosti a prohlížet nabídky od realitních makléřů.'
            : 'Zde můžete spravovat své nabídky a prohlížet dostupné nemovitosti.'}
        </p>
      </div>
      
      {user?.user_type === 'seller' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Moje nemovitosti</h2>
              <a
                href="/properties/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Přidat nemovitost
              </a>
            </div>
            
            {properties.length === 0 ? (
              <p className="text-gray-500">Zatím nemáte žádné nemovitosti.</p>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="border rounded-md p-4">
                    <h3 className="font-medium">{property.street}, {property.city}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {property.property_type} | {property.status}
                    </p>
                    <div className="mt-2">
                      <a
                        href={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Zobrazit detail
                      </a>
                    </div>
                  </div>
                ))}
                
                {properties.length > 3 && (
                  <div className="text-center mt-4">
                    <a
                      href="/properties"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Zobrazit všechny ({properties.length})
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Poslední nabídky</h2>
            
            <p className="text-gray-500">
              Zde se zobrazí nabídky od realitních makléřů na vaše nemovitosti.
            </p>
          </div>
        </div>
      )}
      
      {user?.user_type === 'agent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Moje nabídky</h2>
              <a
                href="/properties"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Prohlížet nemovitosti
              </a>
            </div>
            
            {offers.length === 0 ? (
              <p className="text-gray-500">Zatím nemáte žádné nabídky.</p>
            ) : (
              <div className="space-y-4">
                {offers.slice(0, 3).map((offer) => (
                  <div key={offer.id} className="border rounded-md p-4">
                    <h3 className="font-medium">Nabídka na nemovitost</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Provize: {offer.commission_percentage}% | Stav: {offer.status}
                    </p>
                    <div className="mt-2">
                      <a
                        href={`/offers/${offer.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Zobrazit detail
                      </a>
                    </div>
                  </div>
                ))}
                
                {offers.length > 3 && (
                  <div className="text-center mt-4">
                    <a
                      href="/offers"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Zobrazit všechny ({offers.length})
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Moje kredity</h2>
              <a
                href="/dashboard/credits"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Dobít kredity
              </a>
            </div>
            
            {credits ? (
              <div className="text-center py-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {credits.balance}
                </div>
                <p className="text-gray-500">dostupných kreditů</p>
              </div>
            ) : (
              <p className="text-gray-500">Informace o kreditech nejsou dostupné.</p>
            )}
            
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">K čemu slouží kredity?</h3>
              <p className="text-sm text-blue-700">
                Kredity potřebujete pro získání přístupu ke kontaktním údajům prodávajících.
                Každý přístup stojí 5 kreditů.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
