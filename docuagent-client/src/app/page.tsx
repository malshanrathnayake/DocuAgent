import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to DocuAgent</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Documents Processed" value="124" change="+12%" />
        <StatCard title="Risk Flags" value="8" change="-3%" positive={false} />
        <StatCard title="Average Processing Time" value="1.2s" change="-15%" positive={true} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          <div className="space-y-3">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <DocumentIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-gray-500">{doc.date}</p>
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
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
          <div className="space-y-3">
            {recentRisks.map((risk) => (
              <div key={risk.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <AlertIcon className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium">{risk.title}</p>
                    <p className="text-sm text-gray-500">{risk.document}</p>
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
}

function StatCard({ title, value, change, positive = true }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
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

// Sample data
const recentDocs = [
  { id: '1', title: 'Financial Report Q1 2025.pdf', date: 'Apr 10, 2025' },
  { id: '2', title: 'Legal Agreement XYZ Corp.docx', date: 'Apr 8, 2025' },
  { id: '3', title: 'Market Analysis 2025.pdf', date: 'Apr 5, 2025' },
];

const recentRisks = [
  { id: '1', title: 'PII Data Exposure', document: 'Customer Data 2025.xlsx', severity: 'High' },
  { id: '2', title: 'Missing Compliance Statement', document: 'Legal Agreement XYZ Corp.docx', severity: 'Medium' },
  { id: '3', title: 'Potential Copyright Issue', document: 'Marketing Material.pdf', severity: 'Low' },
];
