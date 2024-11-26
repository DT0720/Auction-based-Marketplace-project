// src/utils/NetworkUtils.ts

import Cookies from "js-cookie";

/**
 * Interface representing request options for the network utility functions.
 * @interface RequestOptions
 */
interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    headers?: Record<string, string>;
    body?: any;
}

  /**
 * Utility class for making network requests.
 * Provides common methods for GET, POST, PUT, and DELETE HTTP requests.
 */
  export default class NetworkUtils {

    /**
     * General purpose function for making HTTP requests.
     * @template T - The type of the response data.
     * @param {RequestOptions} options - The request options including method, endpoint, headers, and body.
     * @returns {Promise<T | null>} A promise that resolves to the response data of type T or null if the response is empty.
     * @throws Will throw an error if the request fails.
     */
    static async request<T>({ method, endpoint, headers = {}, body }: RequestOptions): Promise<T | null> {

      const isFormData = body instanceof FormData;

      const token = Cookies.get('auth-token');

      const options: RequestInit = {
        method,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }), // Exclude Content-Type for FormData
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
  

    /**
     * Performs a GET request.
     * @template T - The type of the response data.
     * @param {string} endpoint - The endpoint to make the GET request to.
     * @param {Record<string, string>} [headers] - Optional headers for the request.
     * @returns {Promise<T | null>} A promise that resolves to the response data of type T or null.
     */
    static getRequest<T>(endpoint: string, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'GET', endpoint, headers });
    }
  

    /**
     * Performs a POST request.
     * @template T - The type of the response data.
     * @param {string} endpoint - The endpoint to make the POST request to.
     * @param {any} body - The body of the request.
     * @param {Record<string, string>} [headers] - Optional headers for the request.
     * @returns {Promise<T | null>} A promise that resolves to the response data of type T or null.
     */
    static postRequest<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'POST', endpoint, headers, body });
    }
  

    /**
     * Performs a PUT request.
     * @template T - The type of the response data.
     * @param {string} endpoint - The endpoint to make the PUT request to.
     * @param {any} body - The body of the request.
     * @param {Record<string, string>} [headers] - Optional headers for the request.
     * @returns {Promise<T | null>} A promise that resolves to the response data of type T or null.
     */
    static putRequest<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'PUT', endpoint, headers, body });
    }
  

    /**
     * Performs a DELETE request.
     * @template T - The type of the response data.
     * @param {string} endpoint - The endpoint to make the DELETE request to.
     * @param {Record<string, string>} [headers] - Optional headers for the request.
     * @returns {Promise<T | null>} A promise that resolves to the response data of type T or null.
     */
    static deleteRequest<T>(endpoint: string, headers?: Record<string, string>): Promise<T | null> {
      return this.request<T>({ method: 'DELETE', endpoint, headers });
    }
    
}


/**
 * Represents an API response structure with a message and data.
 * @interface ApiResponse
 * @template T - The type of the response data.
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
}

  