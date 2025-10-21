import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types';
import axios from 'axios';

// Create an axios instance with default config
// In production, use the backend service URL from environment variable; in development, use localhost
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? process.env.REACT_APP_API_URL || ''  // Use environment variable or empty string (same domain)
  : 'http://localhost:5000';

console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increase timeout to 15 seconds
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.baseURL + response.config.url);
    return response;
  },
  error => {
    console.error('API Response Error:', error.response || error.message || error);
    return Promise.reject(error);
  }
);

export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    console.log('Fetching items from API...');
    
    // Return the Promise so we can handle it in components
    return api.get('/api/items')
        .then(res => {
            console.log('Received items from API:', res.data);
            dispatch({
                type: GET_ITEMS,
                payload: res.data
            });
            return res.data; // Return data for further handling
        })
        .catch(err => {
            console.error('Error fetching items:', err.response || err.message || err);
            // Show error to user with more details
            let errorMessage = 'Failed to fetch items.';
            if (err.code === 'ECONNABORTED') {
                errorMessage += ' Request timeout. Please check your network connection.';
            } else if (err.message) {
                errorMessage += ' ' + err.message;
            }
            alert(errorMessage);
            // Reset loading state even on error
            dispatch({
                type: GET_ITEMS,
                payload: []
            });
            // Re-throw the error so it can be caught by calling code
            throw err;
        });
};

export const deleteItem = id => dispatch => {
    api.delete(`/api/items/${id}`)
        .then(res => 
            dispatch({
                type: DELETE_ITEM,
                payload: id
            })
        )
        .catch(err => {
            console.error('Error deleting item:', err.response || err.message || err);
            alert('Failed to delete item: ' + (err.message || 'Unknown error'));
        });
};

export const addItem = item => dispatch => {
    api.post('/api/items', item)
        .then(res => 
            dispatch({
                type: ADD_ITEM,
                payload: res.data
            })
        )
        .catch(err => {
            console.error('Error adding item:', err.response || err.message || err);
            alert('Failed to add item: ' + (err.message || 'Unknown error'));
        });
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};

// Add a health check function
export const checkApiHealth = () => {
    console.log('Checking API health...');
    return api.get('/health')
        .then(res => {
            console.log('API Health Check Success:', res.data);
            return res.data;
        })
        .catch(err => {
            console.error('API Health Check Failed:', err.response || err.message || err);
            throw err;
        });
};
