'use client';

import { useState } from 'react';

interface ApiConfig {
  backendUrl: string;
  apiKey: string;
  notificationsEnabled: boolean;
}

interface StorageConfig {
  provider: 'azure' | 'aws' | 'local';
  connectionString: string;
  containerName: string;
}

interface ProcessingConfig {
  modelProvider: 'azure-openai' | 'huggingface';
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'storage' | 'processing' | 'notifications'>('general');
  
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    backendUrl: 'http://localhost:8000',
    apiKey: '••••••••••••••••••••••',
    notificationsEnabled: true
  });
  
  const [storageConfig, setStorageConfig] = useState<StorageConfig>({
    provider: 'azure',
    connectionString: '••••••••••••••••••••••••••••••••••••••••••••',
    containerName: 'documents'
  });
  
  const [processingConfig, setProcessingConfig] = useState<ProcessingConfig>({
    modelProvider: 'azure-openai',
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'docx', 'txt', 'xlsx', 'csv']
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', message: '' });

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage({ 
        type: 'success',
        message: 'API configuration saved successfully.'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage({ type: '', message: '' }), 3000);
    }, 1000);
  };
  
  const handleStorageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage({ 
        type: 'success',
        message: 'Storage configuration saved successfully.'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage({ type: '', message: '' }), 3000);
    }, 1000);
  };
  
  const handleProcessingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage({ 
        type: 'success',
        message: 'Processing configuration saved successfully.'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage({ type: '', message: '' }), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'general' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'api' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              API Connections
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'storage' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Storage
            </button>
            <button
              onClick={() => setActiveTab('processing')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'processing' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'notifications' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {saveMessage.message && (
            <div className={`mb-6 p-4 rounded-md ${
              saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {saveMessage.message}
            </div>
          )}
          
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-medium mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="DocuAgent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div>
              <h2 className="text-lg font-medium mb-4">API Connections</h2>
              <form onSubmit={handleApiSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backend API URL
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={apiConfig.backendUrl}
                    onChange={(e) => setApiConfig({...apiConfig, backendUrl: e.target.value})}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The URL of the DocuAgent backend API service.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <div className="flex">
                    <input
                      type="password"
                      className="flex-1 p-2 border border-gray-300 rounded-l-md"
                      value={apiConfig.apiKey}
                      onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                    />
                    <button 
                      type="button"
                      className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md"
                    >
                      Show
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifications-toggle"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    checked={apiConfig.notificationsEnabled}
                    onChange={(e) => setApiConfig({...apiConfig, notificationsEnabled: e.target.checked})}
                  />
                  <label htmlFor="notifications-toggle" className="ml-2 text-sm text-gray-700">
                    Enable notifications for API events
                  </label>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save API Configuration'}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 border-t pt-6">
                <h3 className="text-md font-medium mb-2">API Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  Test Connection
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'storage' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Storage Settings</h2>
              <form onSubmit={handleStorageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Provider
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={storageConfig.provider}
                    onChange={(e) => setStorageConfig({...storageConfig, provider: e.target.value as 'azure' | 'aws' | 'local'})}
                  >
                    <option value="azure">Azure Blob Storage</option>
                    <option value="aws">AWS S3</option>
                    <option value="local">Local Storage</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Connection String
                  </label>
                  <div className="flex">
                    <input
                      type="password"
                      className="flex-1 p-2 border border-gray-300 rounded-l-md"
                      value={storageConfig.connectionString}
                      onChange={(e) => setStorageConfig({...storageConfig, connectionString: e.target.value})}
                    />
                    <button 
                      type="button"
                      className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md"
                    >
                      Show
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Connection string for your storage provider.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Container/Bucket Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={storageConfig.containerName}
                    onChange={(e) => setStorageConfig({...storageConfig, containerName: e.target.value})}
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Storage Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'processing' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Document Processing Settings</h2>
              <form onSubmit={handleProcessingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Provider
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={processingConfig.modelProvider}
                    onChange={(e) => setProcessingConfig({...processingConfig, modelProvider: e.target.value as 'azure-openai' | 'huggingface'})}
                  >
                    <option value="azure-openai">Azure OpenAI</option>
                    <option value="huggingface">Hugging Face</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    AI model provider for document analysis.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum File Size (MB)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={processingConfig.maxFileSize}
                    onChange={(e) => setProcessingConfig({...processingConfig, maxFileSize: parseInt(e.target.value)})}
                    min="1"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed File Types
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['pdf', 'docx', 'txt', 'xlsx', 'csv', 'ppt', 'pptx', 'rtf'].map(type => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`filetype-${type}`}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          checked={processingConfig.allowedFileTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProcessingConfig({
                                ...processingConfig, 
                                allowedFileTypes: [...processingConfig.allowedFileTypes, type]
                              });
                            } else {
                              setProcessingConfig({
                                ...processingConfig, 
                                allowedFileTypes: processingConfig.allowedFileTypes.filter(t => t !== type)
                              });
                            }
                          }}
                        />
                        <label htmlFor={`filetype-${type}`} className="ml-2 text-sm text-gray-700">
                          .{type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Processing Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="email-upload-complete"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="email-upload-complete" className="ml-2 text-sm text-gray-700">
                          Document upload complete
                        </label>
                      </div>
                      <select className="text-xs border border-gray-300 rounded p-1">
                        <option value="immediately">Immediately</option>
                        <option value="daily">Daily digest</option>
                        <option value="weekly">Weekly digest</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="email-risk-detected"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="email-risk-detected" className="ml-2 text-sm text-gray-700">
                          Risk detected
                        </label>
                      </div>
                      <select className="text-xs border border-gray-300 rounded p-1">
                        <option value="immediately">Immediately</option>
                        <option value="daily">Daily digest</option>
                        <option value="weekly">Weekly digest</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="email-weekly-summary"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="email-weekly-summary" className="ml-2 text-sm text-gray-700">
                          Weekly summary
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">Every Monday at 9:00 AM</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Microsoft Teams Notifications</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teams Webhook URL
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="https://outlook.office.com/webhook/..."
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="teams-high-risk"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="teams-high-risk" className="ml-2 text-sm text-gray-700">
                          High risk documents
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="teams-weekly-summary"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="teams-weekly-summary" className="ml-2 text-sm text-gray-700">
                          Weekly document summary
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}