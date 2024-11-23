import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { API_CONFIG } from '../config/api';

interface ApiError {
  message: string;
  status: number;
}

async function fetchApi<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${API_CONFIG.token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message || `API Error: ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
        status: 500,
      } as ApiError;
    }
    throw error;
  }
}

export function useApiQuery<T>(
  endpoint: string,
  options?: Omit<UseQueryOptions<T, ApiError, T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey: [endpoint],
    queryFn: () => fetchApi<T>(endpoint),
    ...options
  });
}

export function useApiMutation<T, TVariables>(
  endpoint: string,
  options?: Omit<UseMutationOptions<T, ApiError, TVariables>, 'mutationFn'>
) {
  return useMutation<T, ApiError, TVariables>({
    mutationFn: (variables: TVariables) => 
      fetchApi(endpoint, {
        method: 'POST',
        ...options,
        body: JSON.stringify(variables),
      }),
    ...options
  });
} 