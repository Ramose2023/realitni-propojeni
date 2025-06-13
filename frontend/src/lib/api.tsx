import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Typy pro API
type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  message?: string;
};

// Typy pro kontext
type ApiContextType = {
  loading: boolean;
  error: string | null;
  // Autentizace
  register: (userData: RegisterData) => Promise<ApiResponse<any>>;
  login: (email: string, password: string) => Promise<ApiResponse<any>>;
  loginWithGoogle: (token: string, userType?: string) => Promise<ApiResponse<any>>;
  logout: () => Promise<ApiResponse<any>>;
  getCurrentUser: () => Promise<ApiResponse<any>>;
  
  // Nemovitosti
  createProperty: (propertyData: PropertyData) => Promise<ApiResponse<any>>;
  getProperties: (filters?: any) => Promise<ApiResponse<any>>;
  getPropertyDetail: (id: string) => Promise<ApiResponse<any>>;
  updateProperty: (id: string, propertyData: Partial<PropertyData>) => Promise<ApiResponse<any>>;
  deleteProperty: (id: string) => Promise<ApiResponse<any>>;
  uploadPropertyMedia: (propertyId: string, files: File[]) => Promise<ApiResponse<any>>;
  
  // Nabídky makléřů
  createOffer: (offerData: OfferData) => Promise<ApiResponse<any>>;
  getOffers: (propertyId?: string) => Promise<ApiResponse<any>>;
  getOfferDetail: (id: string) => Promise<ApiResponse<any>>;
  updateOffer: (id: string, offerData: Partial<OfferData>) => Promise<ApiResponse<any>>;
  deleteOffer: (id: string) => Promise<ApiResponse<any>>;
  
  // Kredity
  getCredits: () => Promise<ApiResponse<any>>;
  purchaseCredits: (amount: number, paymentMethod: string) => Promise<ApiResponse<any>>;
  useCredits: (propertyId: string) => Promise<ApiResponse<any>>;
  getCreditTransactions: () => Promise<ApiResponse<any>>;
  
  // Přístupy
  grantAccess: (offerId: string) => Promise<ApiResponse<any>>;
};

// Typy pro data
type RegisterData = {
  email: string;
  password: string;
  user_type: 'seller' | 'agent';
  full_name: string;
  phone?: string;
};

type PropertyData = {
  property_type: string;
  description: string;
  street: string;
  house_number: string;
  city: string;
  postal_code: string;
  parcel_number: string;
  municipality: string;
  cadastral_area: string;
};

type OfferData = {
  property_id: string;
  commission_percentage: number;
  commission_amount: number;
  price_estimate_min: number;
  price_estimate_max: number;
  included_services: any;
  additional_services: any;
  video_presentation_url?: string;
};

// Vytvoření kontextu
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Provider komponenta
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper pro API volání
  const apiCall = async <T,>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: any
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        withCredentials: true, // Pro přenos cookies (session)
      });

      setLoading(false);
      return {
        status: 'success',
        data: response.data,
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Neznámá chyba';
      setError(errorMessage);
      return {
        status: 'error',
        message: errorMessage,
      };
    }
  };

  // Autentizace
  const register = (userData: RegisterData) => {
    return apiCall('POST', '/auth/register', userData);
  };

  const login = (email: string, password: string) => {
    return apiCall('POST', '/auth/login', { email, password });
  };

  const loginWithGoogle = (token: string, userType?: string) => {
    return apiCall('POST', '/auth/google', { token, user_type: userType });
  };

  const logout = () => {
    return apiCall('POST', '/auth/logout');
  };

  const getCurrentUser = () => {
    return apiCall('GET', '/auth/me');
  };

  // Nemovitosti
  const createProperty = (propertyData: PropertyData) => {
    return apiCall('POST', '/seller/properties', propertyData);
  };

  const getProperties = (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiCall('GET', `/properties${queryParams}`);
  };

  const getPropertyDetail = (id: string) => {
    return apiCall('GET', `/properties/${id}`);
  };

  const updateProperty = (id: string, propertyData: Partial<PropertyData>) => {
    return apiCall('PUT', `/seller/properties/${id}`, propertyData);
  };

  const deleteProperty = (id: string) => {
    return apiCall('DELETE', `/seller/properties/${id}`);
  };

  const uploadPropertyMedia = async (propertyId: string, files: File[]) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post(
        `${API_URL}/seller/properties/${propertyId}/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      setLoading(false);
      return {
        status: 'success',
        data: response.data,
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Neznámá chyba';
      setError(errorMessage);
      return {
        status: 'error',
        message: errorMessage,
      };
    }
  };

  // Nabídky makléřů
  const createOffer = (offerData: OfferData) => {
    return apiCall('POST', '/agent/offers', offerData);
  };

  const getOffers = (propertyId?: string) => {
    const endpoint = propertyId
      ? `/seller/properties/${propertyId}/offers`
      : '/agent/offers';
    return apiCall('GET', endpoint);
  };

  const getOfferDetail = (id: string) => {
    return apiCall('GET', `/agent/offers/${id}`);
  };

  const updateOffer = (id: string, offerData: Partial<OfferData>) => {
    return apiCall('PUT', `/agent/offers/${id}`, offerData);
  };

  const deleteOffer = (id: string) => {
    return apiCall('DELETE', `/agent/offers/${id}`);
  };

  // Kredity
  const getCredits = () => {
    return apiCall('GET', '/credits/balance');
  };

  const purchaseCredits = (amount: number, paymentMethod: string) => {
    return apiCall('POST', '/credits/purchase', { amount, payment_method: paymentMethod });
  };

  const useCredits = (propertyId: string) => {
    return apiCall('POST', '/credits/use', { property_id: propertyId });
  };

  const getCreditTransactions = () => {
    return apiCall('GET', '/credits/transactions');
  };

  // Přístupy
  const grantAccess = (offerId: string) => {
    return apiCall('POST', `/seller/grant-access/${offerId}`);
  };

  const value = {
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    getCurrentUser,
    createProperty,
    getProperties,
    getPropertyDetail,
    updateProperty,
    deleteProperty,
    uploadPropertyMedia,
    createOffer,
    getOffers,
    getOfferDetail,
    updateOffer,
    deleteOffer,
    getCredits,
    purchaseCredits,
    useCredits,
    getCreditTransactions,
    grantAccess,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Hook pro použití kontextu
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi musí být použit uvnitř ApiProvider');
  }
  return context;
};
