'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { documentApi } from '@/lib/api';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setErrorMessage('');
    
    if (selectedFile) {
      // Check file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
      
      if (!validTypes.includes(selectedFile.type)) {
        setErrorMessage('Invalid file type. Please upload PDF, DOCX, TXT, CSV, or Excel files.');
        return;
      }
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage('File too large. Maximum size is 10MB.');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }
    
    setIsUploading(true);
    setProgress(10);
    
    try {
      setProgress(30);
      
      // Upload using our API client
      const result = await documentApi.uploadDocument(file);
      
      setProgress(100);
      
      // Navigate to the document view page
      router.push(`/documents/${result.data.id}`);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrorMessage(error.message || 'An error occurred during upload. Please try again.');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Document</h1>
      
      <div className="bg-white p-8 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Document File
            </label>
            
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX, TXT, CSV or Excel (Max 10MB)</p>
                  
                  {file && (
                    <div className="mt-4 text-sm text-gray-900">
                      Selected: <span className="font-medium">{file.name}</span>
                    </div>
                  )}
                </div>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.xls"
                />
              </label>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50">
              {errorMessage}
            </div>
          )}

          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-sm text-gray-500 mt-2">Processing document...</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h2 className="text-lg font-semibold text-blue-800">What happens when you upload?</h2>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>The document is securely uploaded to our servers</li>
          <li>Our AI analyzes the document content</li>
          <li>Metadata is extracted and risk assessment is performed</li>
          <li>A summary is generated for quick review</li>
          <li>Results are stored for future reference</li>
        </ul>
      </div>
    </div>
  );
}