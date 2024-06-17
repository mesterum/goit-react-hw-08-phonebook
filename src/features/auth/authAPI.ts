import axios from "redaxios"

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': ''
}
export const authAPI = axios.create({
  baseURL: 'https://connections-api.herokuapp.com/users',
  headers
})

// Utility to add JWT
export const setAuthHeader = (token: string) => {
  (authAPI.defaults.headers as typeof headers).Authorization = `Bearer ${token}`;
};

// Utility to remove JWT
export const clearAuthHeader = () => {
  (authAPI.defaults.headers as typeof headers).Authorization = '';
};

/* 
POST  / users / signup
Create a new user
POST  / users / login
Login user
POST  / users / logout
Log out user
GET  / users / current
Get information about the current user

signup
login
logout
current
*/