'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { riskApi, RiskReport } from '@/lib/api';

export default function ReportsPage() {
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'Reviewing' | 'Resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRiskReports = async () => {
      try {
        setIsLoading(true);
        const riskReports = await riskApi.getAllRiskReports();
        setReports(riskReports);
        setError(null);
      } catch (err) {
        console.error('Error fetching risk reports:', err);
        setError('Failed to load risk reports. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiskReports();
  }, []);

  // Handle risk status update
  const handleStatusUpdate = async (id: string, newStatus: 'Open' | 'Reviewing' | 'Resolved') => {
    try {
      await riskApi.updateRiskStatus(id, newStatus);
      
      // Update the local state to reflect the change
      setReports(reports.map(report => 
        report.id === id ? { ...report, status: newStatus } : report
      ));
    } catch (err) {
      console.error('Error updating risk status:', err);
      // Show error notification (could be improved with a toast component)
      alert('Failed to update risk status. Please try again.');
    }
  };

  // Filter reports based on severity and search term
  const filteredReports = reports.filter(report => {
    const matchesSeverity = filter === 'all' || report.severity === filter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  // Risk severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'Reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Risk Reports</h1>
        <Link
          href="/documents"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Documents
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
                placeholder="Search risk reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="mr-2 text-sm font-medium text-gray-700">Severity:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="mr-2 text-sm font-medium text-gray-700">Status:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="Open">Open</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 p-4 rounded-lg">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="flex justify-between mt-4">
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
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
          <>
            {filteredReports.length > 0 ? (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    
                    <div className="flex flex-wrap justify-between items-center text-sm">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <Link href={`/documents/${report.document.id}`} className="text-blue-600 hover:underline">
                          {report.document.name}
                        </Link>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-500">{report.document.type}</span>
                      </div>
                      <div className="text-gray-500">
                        Detected {formatDate(report.detectedAt)}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end space-x-2">
                      {report.status === 'Open' && (
                        <button 
                          onClick={() => handleStatusUpdate(report.id, 'Reviewing')}
                          className="text-sm px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Mark as Reviewing
                        </button>
                      )}
                      {report.status === 'Reviewing' && (
                        <button 
                          onClick={() => handleStatusUpdate(report.id, 'Resolved')}
                          className="text-sm px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Mark as Resolved
                        </button>
                      )}
                      <Link 
                        href={`/documents/${report.document.id}`}
                        className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
                      >
                        View Document
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-2">No risk reports match your filters.</p>
                <button 
                  onClick={() => {
                    setFilter('all');
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
        
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
          </div>
        ) : !error ? (
          <>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                <p className="text-xs text-red-500 font-medium">High Risk</p>
                <p className="text-2xl font-bold text-red-700">
                  {reports.filter(r => r.severity === 'High').length}
                </p>
              </div>
              <div className="bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-100">
                <p className="text-xs text-yellow-500 font-medium">Medium Risk</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {reports.filter(r => r.severity === 'Medium').length}
                </p>
              </div>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-500 font-medium">Low Risk</p>
                <p className="text-2xl font-bold text-blue-700">
                  {reports.filter(r => r.severity === 'Low').length}
                </p>
              </div>
              <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                <p className="text-xs text-green-500 font-medium">Resolved</p>
                <p className="text-2xl font-bold text-green-700">
                  {reports.filter(r => r.status === 'Resolved').length}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              A total of {reports.length} risks were identified across {
                new Set(reports.map(r => r.document.id)).size
              } documents. {reports.filter(r => r.status !== 'Resolved').length} risks remain unresolved.
            </p>
            
            <div className="mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full">
                Generate Comprehensive Risk Report
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Failed to load summary data.</p>
          </div>
        )}
      </div>
    </div>
  );
}