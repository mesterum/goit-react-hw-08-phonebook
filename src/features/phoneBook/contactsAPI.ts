import axios from "redaxios"
import { headers } from "../auth/authAPI"

export const contactsAPI = axios.create({
  baseURL: 'https://connections-api.goit.global/contacts',
  headers
})

