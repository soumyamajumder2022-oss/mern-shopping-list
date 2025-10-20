import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types';
import axios from 'axios';

// Create an axios instance with default config
// Use REACT_APP_API_URL environment variable in production, fallback to localhost in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || ''
  : 'http://localhost:5000';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL
});

export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    console.log('Fetching items from API...');
    
    api.get('/api/items')
        .then(res => {
            console.log('Received items from API:', res.data);
            dispatch({
                type: GET_ITEMS,
                payload: res.data
            });
        })
        .catch(err => {
            console.error('Error fetching items:', err.response || err.message || err);
            // Show error to user
            alert('Failed to fetch items. Please check the console for details.');
            // Reset loading state even on error
            dispatch({
                type: GET_ITEMS,
                payload: []
            });
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
        });
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};