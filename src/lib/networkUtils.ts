// src/utils/NetworkUtils.ts

interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    headers?: Record<string, string>;
    body?: any;
}
  
  export default class NetworkUtils {
    static async request<T>({ method, endpoint, headers = {}, body }: RequestOptions): Promise<T | null> {

      const isFormData = body instanceof FormData;

      const options: RequestInit = {
        method,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }), // Exclude Content-Type for FormData
          ...headers, // Allow custom headers to be passed
        },
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      };
  
      try {
        const response = await fetch(endpoint, options);
  
        if (!response.ok) {
          const error = await response.json();
          console.log("Error is: " + JSON.stringify(error));
          throw new Error(error?.message || 'Network request failed');
        }
  
        // If response is empty (like DELETE requests), return null
        if (response.status === 204) {
          return null;
        }
  
        // Parse JSON if the response is not empty
        const data: T = await response.json();

        return data;
      } catch (error) {
        console.error('Network request failed', error);
        throw error;
      }
    }
  
    static getRequest<T>(endpoint: string, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'GET', endpoint, headers });
    }
  
    static postRequest<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'POST', endpoint, headers, body });
    }
  
    static putRequest<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'PUT', endpoint, headers, body });
    }
  
    static deleteRequest<T>(endpoint: string, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'DELETE', endpoint, headers });
    }
    
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

  