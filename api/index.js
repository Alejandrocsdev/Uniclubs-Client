// Libraries
import axios from 'axios'
// Utilities
import { serverUrl } from '../utils/url'
// Public
export const axiosPublic = axios.create({ baseURL: serverUrl })