'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { documentApi, Document } from '@/lib/api';

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const doc = await documentApi.getDocumentById(params.id);
        setDocument(doc);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link href="/documents" className="text-blue-600 hover:underline">
          Back to documents
        </Link>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-red-500 text-xl mb-4">Document not found</div>
        <Link href="/documents" className="text-blue-600 hover:underline">
          Back to documents
        </Link>
      </div>
    );
  }

  // Format the risks for display
  const risksList = document.risks.split('\n').filter(risk => risk.trim());
  const hasRisks = !document.risks.includes("No issues found");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/documents" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to documents
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold break-words pr-4">{document.filename}</h1>
        <a 
          href={document.blob_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex-shrink-0"
        >
          Download
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="whitespace-pre-line">{document.summary}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Risk Assessment</h2>
              {hasRisks ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Risks Found
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  No Issues
                </span>
              )}
            </div>
            
            {hasRisks ? (
              <ul className="list-disc list-inside space-y-1 text-red-700">
                {risksList.map((risk, index) => (
                  <li key={index}>{risk.replace(/^-\s*/, '')}</li>
                ))}
              </ul>
            ) : (
              <p className="text-green-700">No risk issues were identified in this document.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="w-full p-3 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Request Review
              </button>
              <button className="w-full p-3 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Add Comment
              </button>
              <button className="w-full p-3 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </button>
              <button className="w-full p-3 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Set Alert
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Metadata</h2>
            <dl className="space-y-2">
              {document.metadata && Object.entries(document.metadata).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500 truncate">{key}</dt>
                  <dd className="col-span-2 text-sm text-gray-900">
                    {Array.isArray(value) ? value.join(', ') : value?.toString()}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Activity</h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-800">
                    MA
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Document processed</p>
                  <p className="text-xs text-gray-500">
                    {new Date(document.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-800">
                    AI
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Risks analyzed</p>
                  <p className="text-xs text-gray-500">
                    {new Date(document.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}