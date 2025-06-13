import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../lib/api';

const PropertyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createProperty, uploadPropertyMedia } = useApi();
  
  const [formData, setFormData] = useState({
    property_type: 'apartment',
    description: '',
    street: '',
    house_number: '',
    city: '',
    postal_code: '',
    parcel_number: '',
    municipality: '',
    cadastral_area: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Vytvoření nemovitosti
      const response = await createProperty(formData);
      
      if (response.status === 'success' && response.data) {
        const propertyId = response.data.property.id;
        
        // Nahrání médií, pokud jsou vybrána
        if (files.length > 0) {
          await uploadPropertyMedia(propertyId, files);
        }
        
        // Přesměrování na detail nemovitosti
        navigate(`/properties/${propertyId}`);
      } else {
        setError('Nepodařilo se vytvořit nemovitost');
      }
    } catch (err: any) {
      setError(err.message || 'Nastala chyba při vytváření nemovitosti');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Přidat nemovitost</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property_type">
                Typ nemovitosti
              </label>
              <select
                id="property_type"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="apartment">Byt</option>
                <option value="house">Dům</option>
                <option value="land">Pozemek</option>
                <option value="commercial">Komerční prostory</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
                Ulice
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={formData.street}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="house_number">
                Číslo popisné
              </label>
              <input
                id="house_number"
                name="house_number"
                type="text"
                value={formData.house_number}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                Město
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postal_code">
                PSČ
              </label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parcel_number">
                Parcelní číslo
              </label>
              <input
                id="parcel_number"
                name="parcel_number"
                type="text"
                value={formData.parcel_number}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="municipality">
                Obec
              </label>
              <input
                id="municipality"
                name="municipality"
                type="text"
                value={formData.municipality}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cadastral_area">
                Katastrální území
              </label>
              <input
                id="cadastral_area"
                name="cadastral_area"
                type="text"
                value={formData.cadastral_area}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Popis nemovitosti
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
              Fotografie a videa
            </label>
            <input
              id="files"
              name="files"
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p className="text-sm text-gray-500 mt-1">
              Můžete nahrát více fotografií nebo video. Podporované formáty: JPG, PNG, GIF, MP4.
            </p>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Ukládání...' : 'Uložit nemovitost'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyCreatePage;
