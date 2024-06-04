import axios from "redaxios"

export const contactsAPI = axios.create({
  baseURL: 'https://664b86f135bbda10987d4329.mockapi.io/contacts',
})

