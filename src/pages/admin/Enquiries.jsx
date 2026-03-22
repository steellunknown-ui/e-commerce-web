import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      setEnquiries(data || []);
    } catch (error) {
      console.error("Fetch Enquiries Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      // Optimistic update
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Enquiries Database...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Inquiries</h1>
        <p className="text-foreground/60 text-sm">Review lead submissions and manage status.</p>
      </div>

      <div className="bg-white rounded-2xl border border-muted/20 shadow-sm overflow-hidden">
        {enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/10 text-foreground/70 border-b border-muted/20">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Date</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Contact</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Product</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/10">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 text-xs">
                      {new Date(enq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{enq.name}</td>
                    <td className="px-6 py-4 text-foreground/70">
                      <p>{enq.email}</p>
                      <p className="text-xs text-foreground/40">{enq.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground/80">{enq.product_name || 'General'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        enq.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-xs gap-1 ${enq.status === 'pending' ? 'text-green-600 hover:text-green-700' : 'text-yellow-600 hover:text-yellow-700'}`}
                        onClick={() => toggleStatus(enq.id, enq.status)}
                      >
                        {enq.status === 'pending' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {enq.status === 'pending' ? 'Mark Resolved' : 'Mark Pending'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/50">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-lg font-semibold">No inquiries logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
