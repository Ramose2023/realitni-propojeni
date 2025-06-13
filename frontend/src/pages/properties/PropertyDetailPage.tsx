import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../lib/api';
import { useAuth } from '../../lib/auth';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyDetail, createOffer, useCredits } = useApi();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    commission_percentage: 3,
    commission_amount: 0,
    price_estimate_min: 0,
    price_estimate_max: 0,
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
    video_presentation_url: ''
  });
  
  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await getPropertyDetail(id);
        if (response.status === 'success' && response.data) {
          setProperty(response.data.property);
          if (response.data.offers) {
            setOffers(response.data.offers);
          }
        } else {
          setError('Nepodařilo se načíst detail nemovitosti');
        }
      } catch (err: any) {
        setError(err.message || 'Nastala chyba při načítání detailu nemovitosti');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetail();
  }, [id]);
  
  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.startsWith('included_services.')) {
      const serviceName = name.split('.')[1];
      setOfferData((prev) => ({
        ...prev,
        included_services: {
          ...prev.included_services,
          [serviceName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else if (name.startsWith('additional_services.')) {
      const [_, serviceName, field] = name.split('.');
      setOfferData((prev) => ({
        ...prev,
        additional_services: {
          ...prev.additional_services,
          [serviceName]: {
            ...prev.additional_services[serviceName as keyof typeof prev.additional_services],
            [field]: field === 'included' 
              ? (e.target as HTMLInputElement).checked 
              : parseInt(value)
          }
        }
      }));
    } else {
      setOfferData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };
  
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await createOffer({
        ...offerData,
        property_id: id
      });
      
      if (response.status === 'success') {
        // Přidat novou nabídku do seznamu
        if (response.data && response.data.offer) {
          setOffers((prev) => [...prev, response.data.offer]);
        }
        setShowOfferForm(false);
      } else {
        setError('Nepodařilo se vytvořit nabídku');
      }
    } catch (err: any) {
      setError(err.message || 'Nastala chyba při vytváření nabídky');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUseCredits = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await useCredits(id);
      
      if (response.status === 'success') {
        // Aktualizovat property s kontaktními údaji
        setProperty((prev: any) => ({
          ...prev,
          contact_access: true
        }));
      } else {
        setError('Nepodařilo se získat přístup ke kontaktům');
      }
    } catch (err: any) {
      setError(err.message || 'Nastala chyba při získávání přístupu ke kontaktům');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !property) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error && !property) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={() => navigate('/properties')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Zpět na seznam nemovitostí
        </button>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Nemovitost nebyla nalezena</p>
        <button
          onClick={() => navigate('/properties')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Zpět na seznam nemovitostí
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{property.street}, {property.city}</h1>
        <div>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors mr-2"
          >
            Zpět na seznam
          </button>
          
          {user?.user_type === 'seller' && property.seller_id === user.id && (
            <button
              onClick={() => navigate(`/properties/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Upravit
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {property.media && property.media.length > 0 ? (
              <div className="h-96 overflow-hidden">
                <img
                  src={property.media[0].url}
                  alt={`${property.street}, ${property.city}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-400"
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
            
            {property.media && property.media.length > 1 && (
              <div className="p-4 overflow-x-auto">
                <div className="flex space-x-2">
                  {property.media.map((media: any, index: number) => (
                    <div key={index} className="w-24 h-24 flex-shrink-0">
                      <img
                        src={media.url}
                        alt={`${property.street}, ${property.city} - ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Informace o nemovitosti</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Typ nemovitosti</p>
                <p className="font-medium">
                  {property.property_type === 'apartment' ? 'Byt' :
                   property.property_type === 'house' ? 'Dům' :
                   property.property_type === 'land' ? 'Pozemek' : 'Komerční prostory'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Adresa</p>
                <p className="font-medium">
                  {property.street} {property.house_number}, {property.postal_code} {property.city}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Parcelní číslo</p>
                <p className="font-medium">{property.parcel_number}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Obec</p>
                <p className="font-medium">{property.municipality}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Katastrální území</p>
                <p className="font-medium">{property.cadastral_area}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Stav</p>
                <p className="font-medium">
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
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Popis</h3>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          </div>
          
          {user?.user_type === 'agent' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vytvořit nabídku</h2>
                <button
                  onClick={() => setShowOfferForm(!showOfferForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showOfferForm ? 'Zrušit' : 'Vytvořit nabídku'}
                </button>
              </div>
              
              {showOfferForm && (
                <form onSubmit={handleSubmitOffer}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="commission_percentage">
                        Provize (%)
                      </label>
                      <input
                        id="commission_percentage"
                        name="commission_percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={offerData.commission_percentage}
                        onChange={handleOfferChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="commission_amount">
                        Provize (Kč)
                      </label>
                      <input
                        id="commission_amount"
                        name="commission_amount"
                        type="number"
                        min="0"
                        value={offerData.commission_amount}
                        onChange={handleOfferChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_estimate_min">
                        Minimální odhad ceny (Kč)
                      </label>
                      <input
                        id="price_estimate_min"
                        name="price_estimate_min"
                        type="number"
                        min="0"
                        value={offerData.price_estimate_min}
                        onChange={handleOfferChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_estimate_max">
                        Maximální odhad ceny (Kč)
                      </label>
                      <input
                        id="price_estimate_max"
                        name="price_estimate_max"
                        type="number"
                        min="0"
                        value={offerData.price_estimate_max}
                        onChange={handleOfferChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Služby v ceně</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="included_services.photos"
                          checked={offerData.included_services.photos}
                          onChange={handleOfferChange}
                          className="mr-2"
                        />
                        <span>Fotografie</span>
                      </label>
  
(Content truncated due to size limit. Use line ranges to read in chunks)