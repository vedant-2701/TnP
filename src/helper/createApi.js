import axios from "axios";
import { getToken } from "../services/api";

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${getToken()}`
  },
});