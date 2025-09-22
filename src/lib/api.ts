const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Merge any custom headers passed in options
  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    customHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }
  
  const config: RequestInit = {
    ...options,
    headers,
  };

  // --- THE FIX ---
  // If the body is an object, it MUST be stringified before being sent.
  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  // Handle responses that might not contain a JSON body
  if (response.status === 204) { // 204 No Content
    return; 
  }

  const data = await response.json().catch(() => {
    // If JSON parsing fails, create a fallback error object
    return { detail: `Request failed with status: ${response.status} ${response.statusText}` };
  });

  if (!response.ok) {
    // Throw an error with the detailed message from the backend
    throw new Error(data.detail || 'An API error occurred');
  }

  return data;
}

export default apiFetch;