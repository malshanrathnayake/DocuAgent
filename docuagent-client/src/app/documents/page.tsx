'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { documentApi, Document } from '@/lib/api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const docs = await documentApi.getAllDocuments();
        setDocuments(docs);
        setError(null);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filter and sort documents based on search term and sort option
  const filteredDocuments = documents.filter(doc => 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.summary && doc.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    } else {
      return a.filename.localeCompare(b.filename);
    }
  });

  // Determine if a document has risks
  const hasRisks = (risks: string) => risks !== 'No issues found' && risks.trim() !== '';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Link 
          href="/upload"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload New
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
            >
              <option value="date">Date (newest)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500 mb-2">{error}</div>
            <button 
              className="text-blue-600 hover:underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Document</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Risks</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDocuments.length > 0 ? (
                  sortedDocuments.map((doc) => (
                    <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link href={`/documents/${doc.id}`} className="hover:text-blue-600">
                          {doc.filename}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {doc.metadata && doc.metadata.DocumentType ? doc.metadata.DocumentType : 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        {hasRisks(doc.risks) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Risks Found
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            No Issues
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/documents/${doc.id}`} className="text-blue-600 hover:underline mr-4">
                          View
                        </Link>
                        <a href={doc.blob_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Download
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      {searchTerm ? (
                        <p>No documents match your search criteria.</p>
                      ) : (
                        <div>
                          <p className="mb-2">No documents found.</p>
                          <Link href="/upload" className="text-blue-600 hover:underline">
                            Upload your first document
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}