import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Download, Search, Mail, ShieldCheck, Calendar, CheckCircle2 } from 'lucide-react';

export const AdminSubscribers: React.FC = () => {
  const { subscribers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscribers = subscribers.filter(sub => {
    if (!searchQuery.trim()) return true;
    return sub.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Subscribed Date,Status,Source']
        .concat(
          subscribers.map(
            s => `${s.email},${new Date(s.subscribedAt).toISOString()},${s.status},${s.source}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clementtrends-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            Newsletter Subscribers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Export opt-in audience contacts to Beehiiv, Substack, Mailchimp, or ConvertKit.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#F7931E]" /> Export CSV List
        </button>
      </div>

      {/* Stats & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search email database..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200">
            Total Opt-ins: <strong>{subscribers.length}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Subscriber Email</th>
                <th className="p-4">Subscription Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Acquisition Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No subscribers found matching the query.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-[#071A33] flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#0066CC]" /> {sub.email}
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                        {sub.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 capitalize">
                      {sub.source.replace('_', ' ')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
