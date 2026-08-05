
import { API_URL } from "./config";

export const apiFetch = (url, options = {}) =>
    fetch(`${API_URL}${url}`, options);