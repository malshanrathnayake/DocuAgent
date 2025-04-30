/**
 * API service for communicating with the DocuAgent backend
 */

// Default API URL - can be overridden in settings
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiError {
  statusCode: number;
  message: string;
}

export interface Document {
  id: string;
  filename: string;
  summary: string;
  metadata: Record<string, any>;
  risks: string;
  blob_url: string;
  created_at: string;
}

export interface RiskReport {
  id: string;
  title: string;
  document: {
    id: string;
    name: string;
    type: string;
  };
  severity: 'High' | 'Medium' | 'Low';
  detectedAt: string;
  status: 'Open' | 'Reviewing' | 'Resolved';
  description: string;
}

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>( endpoint: string, options: RequestInit = {} ): Promise<T> {
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData: ApiError = {
      statusCode: response.status,
      message: 'An error occurred while fetching data'
    };
    
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorData.message = errorJson.detail;
      }
    } catch (e) {
      // If error parsing fails, use default message
    }
    
    throw errorData;
  }

  return await response.json();
}

/**
 * Document API methods
 */
export const documentApi = {
  /**
   * Get all documents
   */
  getAllDocuments: async (): Promise<Document[]> => {
    return apiFetch<Document[]>('/documents/');
  },

  /**
   * Get document by ID
   */
  getDocumentById: async (id: string): Promise<Document> => {
    return apiFetch<Document>(`/documents/${id}`);
  },

  /**
   * Upload and process document
   */
  uploadDocument: async (file: File): Promise<{ data: Document }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/process-document/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData: ApiError = {
        statusCode: response.status,
        message: 'Failed to upload document'
      };
      
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorData.message = errorJson.detail;
        }
      } catch (e) {
        // If error parsing fails, use default message
      }
      
      throw errorData;
    }

    return await response.json();
  },

  /**
   * Delete document
   */
  deleteDocument: async (id: string): Promise<void> => {
    await apiFetch(`/documents/${id}`, {
      method: 'DELETE',
    });
  }
};

/**
 * Risk Reports API methods
 */
export const riskApi = {
  /**
   * Get all risk reports
   */
  getAllRiskReports: async (): Promise<RiskReport[]> => {
    return apiFetch<RiskReport[]>('/risks/');
  },

  /**
   * Get risk report by ID
   */
  getRiskReportById: async (id: string): Promise<RiskReport> => {
    return apiFetch<RiskReport>(`/risks/${id}`);
  },

  /**
   * Update risk report status
   */
  updateRiskStatus: async (id: string, status: 'Open' | 'Reviewing' | 'Resolved'): Promise<RiskReport> => {
    return apiFetch<RiskReport>(`/risks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
};

/**
 * Stats API methods for dashboard
 */
export const statsApi = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<{
    documentsProcessed: string;
    riskyDocuments: string;
    averageProcessingTime: string;
  }> => {
    return apiFetch<{
      documentsProcessed: string;
      riskyDocuments: string;
      averageProcessingTime: string;
    }>('/stats/dashboard');
  },

  /**
   * Get recent uploads
   */
  getRecentUploads: async (limit: number = 5): Promise<Document[]> => {
    return apiFetch<Document[]>(`/documents/?limit=${limit}`);
  },

  /**
   * Get recent risks
   */
  getRecentRisks: async (limit: number = 5): Promise<RiskReport[]> => {
    return apiFetch<RiskReport[]>(`/risks/?limit=${limit}`);
  }
};

/**
 * Settings API methods
 */
export const settingsApi = {
  /**
   * Get application settings
   */
  getSettings: async (): Promise<Record<string, any>> => {
    return apiFetch<Record<string, any>>('/settings/');
  },

  /**
   * Update application settings
   */
  updateSettings: async (settings: Record<string, any>): Promise<Record<string, any>> => {
    return apiFetch<Record<string, any>>('/settings/', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
};