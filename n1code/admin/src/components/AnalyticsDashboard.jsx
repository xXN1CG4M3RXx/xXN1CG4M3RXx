import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: {} });
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch Analytics
        const analyticsRef = doc(db, "settings", "analytics");
        const analyticsSnap = await getDoc(analyticsRef);
        
        let views = 0;
        let clicks = {};
        
        if (analyticsSnap.exists()) {
          const data = analyticsSnap.data();
          views = data.views || 0;
          clicks = { ...(data.clicks || {}) };

          // Also catch any legacy flat keys like "clicks.12345"
          Object.keys(data).forEach(key => {
            if (key.startsWith("clicks.")) {
              const linkId = key.replace("clicks.", "");
              clicks[linkId] = (clicks[linkId] || 0) + (data[key] || 0);
            }
          });
        }

        // Fetch Links to map IDs to titles
        const linksRef = doc(db, "settings", "profile");
        const linksSnap = await getDoc(linksRef);
        
        let linkData = [];
        if (linksSnap.exists()) {
          linkData = linksSnap.data().links || [];
        }

        setAnalytics({ views, clicks });
        setLinks(linkData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-slate-400 p-8">Loading analytics...</div>;

  // Merge link data with click counts
  const sortedLinks = (links || []).map(link => ({
    ...link,
    clicks: analytics.clicks[link.id] || 0
  })).sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="glassmorphism rounded-2xl p-8 border border-sky-aqua-500/20 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-100">Visitor Analytics</h2>
        <p className="text-slate-400 mt-1">Track page views and link clicks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-sm mb-2">Total Page Views</span>
          <span className="text-5xl font-bold font-display text-sky-aqua-400">{analytics.views}</span>
        </div>
        
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-sm mb-2">Total Link Clicks</span>
          <span className="text-5xl font-bold font-display text-emerald-400">
            {Object.values(analytics.clicks).reduce((a, b) => a + b, 0)}
          </span>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-sm mb-2">Avg Click-Through</span>
          <span className="text-5xl font-bold font-display text-purple-400">
            {analytics.views > 0 
              ? Math.round((Object.values(analytics.clicks).reduce((a, b) => a + b, 0) / analytics.views) * 100) 
              : 0}%
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">Link Click Breakdown</h3>
      
      <div className="space-y-4">
        {sortedLinks.length === 0 ? (
          <p className="text-slate-500 italic">No links found in your Linktree.</p>
        ) : (
          sortedLinks.map((link) => {
            const maxClicks = sortedLinks[0].clicks || 1;
            const percentage = Math.max((link.clicks / maxClicks) * 100, 2); // Minimum 2% for visibility
            
            return (
              <div key={link.id} className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-200">{link.title}</span>
                  <span className="text-sky-aqua-400 font-bold">{link.clicks} clicks</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-aqua-600 to-sky-aqua-400 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
