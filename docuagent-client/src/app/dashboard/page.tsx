'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { statsApi, documentApi, riskApi, Document, RiskReport } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    documentsProcessed: '0',
    riskyDocuments: '0',
    averageProcessingTime: '0s',
  });
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [recentRisks, setRecentRisks] = useState<RiskReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch dashboard stats
        const dashboardStats = await statsApi.getDashboardStats();
        setStats(dashboardStats);
        
        // Fetch recent documents
        const documents = await statsApi.getRecentUploads(3);
        setRecentDocs(documents);
        
        // Fetch recent risks
        const risks = await statsApi.getRecentRisks(3);
        setRecentRisks(risks);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Documents Processed" 
          value={stats.documentsProcessed} 
          change="+12%" 
          isLoading={isLoading}
        />
        <StatCard 
          title="Documents with Risks" 
          value={stats.riskyDocuments} 
          change="-3%" 
          positive={false}
          isLoading={isLoading}
        />
        <StatCard 
          title="Avg. Processing Time" 
          value={stats.averageProcessingTime} 
          change="-15%" 
          positive={true}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Documents</h2>
            <Link href="/upload" className="text-sm text-blue-600 hover:underline">
              Upload New
            </Link>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          ) : recentDocs.length > 0 ? (
            <>
              <div className="space-y-3">
                {recentDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">{doc.filename}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/documents/${doc.id}`} className="text-blue-500 hover:underline">
                      View
                    </Link>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Link href="/documents" className="text-blue-500 hover:underline text-sm">
                  View all documents →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center p-4 text-gray-500">
              No documents found. <Link href="/upload" className="text-blue-600 hover:underline">Upload some</Link>?
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Risk Analysis</h2>
            <Link href="/reports" className="text-sm text-blue-600 hover:underline">
              View All Reports
            </Link>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          ) : recentRisks.length > 0 ? (
            <>
              <div className="space-y-3">
                {recentRisks.map((risk) => (
                  <div key={risk.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <AlertIcon className="h-5 w-5 text-red-500 mr-3" />
                      <div>
                        <p className="font-medium">{risk.title}</p>
                        <p className="text-sm text-gray-500">{risk.document.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      risk.severity === 'High' ? 'bg-red-100 text-red-800' : 
                      risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {risk.severity}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Link href="/reports" className="text-blue-500 hover:underline text-sm">
                  View all risks →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center p-4 text-gray-500">
              No risks detected in your documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  isLoading?: boolean;
}

function StatCard({ title, value, change, positive = true, isLoading = false }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      
      {isLoading ? (
        <div className="animate-pulse mt-1">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12 mt-2"></div>
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <div className={`flex items-center mt-2 ${positive ? 'text-green-500' : 'text-red-500'}`}>
            <span>{change}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className={`h-4 w-4 ml-1 ${positive ? '' : 'transform rotate-180'}`}
            >
              <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V3.414l-9.293 9.293a1 1 0 01-1.414-1.414l9.293-9.293H6a1 1 0 010-2h7a1 1 0 011 1v7a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

function DocumentIcon({ className }: { className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function AlertIcon({ className }: { className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}