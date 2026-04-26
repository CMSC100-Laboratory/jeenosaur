const BASE_URL = 'http://localhost:3001';

const request = async (endpoint, method = 'GET', body = null) => {
  const userStr = localStorage.getItem('user');
  const userId = userStr ? JSON.parse(userStr).id : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(userId && { 'x-user-id': userId })
  };

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) })
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return response.json();
};

// Matches your controller.js routes exactly
export const signUp = (data) => request('/sign-up', 'POST', data);
export const login = (data) => request('/login', 'POST', data);
export const getAllProducts = (sortBy = 'productName', order = 'asc') => 
  request(`/get-all-products?sortBy=${sortBy}&order=${order}`);
export const addProduct = (data) => request('/add-product', 'POST', data);
export const updateProduct = (data) => request('/update-product', 'POST', data);
export const deleteProduct = (id) => request('/delete-product', 'POST', { id });
export const getAllUsers = () => request('/find-all-users');
export const deleteUser = (id) => request('/delete-by-user-id', 'POST', { id });