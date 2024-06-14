import axios from "redaxios"

export const authAPI = axios.create({
  baseURL: 'https://connections-api.herokuapp.com/users/',
})

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