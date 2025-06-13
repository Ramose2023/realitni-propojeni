import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../lib/api';

const PropertyListPage: React.FC = () => {
  const { getProperties } = useApi();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getProperties();
        if (response.status === 'success' && response.data) {
          setProperties(response.data.properties || []);
        } else {
          setError('Nepodařilo se načíst nemovitosti');
        }
      } catch (err: any) {
        setError(err.message || 'Nastala chyba při načítání nemovitostí');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const handleCreateProperty = () => {
    navigate('/properties/create');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Nemovitosti</h1>
        <button
          onClick={handleCreateProperty}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Přidat nemovitost
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Žádné nemovitosti</h2>
          <p className="text-gray-600 mb-6">
            Zatím zde nejsou žádné nemovitosti. Vytvořte svou první nemovitost kliknutím na tlačítko níže.
          </p>
          <button
            onClick={handleCreateProperty}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Přidat nemovitost
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {property.media && property.media.length > 0 ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={property.media[0].url}
                    alt={`${property.street}, ${property.city}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 22V12h6v10"
                    ></path>
                  </svg>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {property.street}, {property.city}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {property.property_type} | {property.cadastral_area}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : property.status === 'inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status === 'active'
                      ? 'Aktivní'
                      : property.status === 'inactive'
                      ? 'Neaktivní'
                      : 'Prodáno'}
                  </span>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-1">Parcelní číslo: {property.parcel_number}</p>
                  <p>Obec: {property.municipality}</p>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Zobrazit detail
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {property.offers_count || 0} nabídek
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListPage;
