import axios from "axios";
import { getToken } from "../services/api";
import { getUser } from "../services/getUser";

const { role } = getUser();

const API_BASE_URL = `${import.meta.env.VITE_AUTH_BASE_URL}/${role.toLowerCase()}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${getToken()}`
  },
  withCredentials: true,
});