const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');

  // Start with headers from options, but don't default a Content-Type yet.
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const config: RequestInit = {
    ...options,
    headers,
  };

  // --- THE UPGRADE ---
  // This block intelligently formats the body and sets the correct Content-Type.
  if (config.body) {
    if (config.body instanceof URLSearchParams) {
      // This handles the login request.
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
    } else if (config.body instanceof FormData) {
      // For potential file uploads in the future.
      // We let the browser set the Content-Type automatically.
    } else if (typeof config.body === 'object') {
      // This handles all your standard JSON requests.
      headers.set('Content-Type', 'application/json');
      config.body = JSON.stringify(config.body);
    }
  }
  // --- END OF UPGRADE ---

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