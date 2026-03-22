import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, MessageSquare, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, enquiries: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Products Count
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // 2. Fetch Enquiries Count
        const { count: enquiryCount } = await supabase
          .from('enquiries')
          .select('*', { count: 'exact', head: true });

        // 3. Fetch Recent Enquiries
        const { data: enquiries } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          products: productCount || 0,
          enquiries: enquiryCount || 0
        });
        setRecentEnquiries(enquiries || []);

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading Dashboard Metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-foreground/60 text-sm">Monitor your website activity and product stats.</p>
      </div>

      {/* Grid Cards for Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-muted/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Total Products</p>
            <h2 className="text-4xl font-bold mt-1 text-foreground">{stats.products}</h2>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-muted/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Total Enquiries</p>
            <h2 className="text-4xl font-bold mt-1 text-foreground">{stats.enquiries}</h2>
          </div>
          <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Recent Enquiries stream */}
      <div className="bg-white rounded-2xl border border-muted/20 shadow-sm p-6 space-y-4">
        <h3 className="font-serif text-xl font-bold text-foreground">Recent Enquiries</h3>
        
        {recentEnquiries.length > 0 ? (
          <div className="divide-y divide-muted/10">
            {recentEnquiries.map((enq) => (
              <div key={enq.id} className="py-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-foreground">{enq.name}</p>
                  <p className="text-xs text-foreground/60">{enq.email} • {enq.product_name || 'General'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  enq.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {enq.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-foreground/40 space-y-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm">No enquiries found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
