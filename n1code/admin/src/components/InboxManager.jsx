import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function InboxManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Reply State
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyStatus, setReplyStatus] = useState("idle"); // idle, success, error

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (msg) => {
    if (msg.read) return;
    try {
      await updateDoc(doc(db, "messages", msg.id), { read: true });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
      setSelectedMessage({ ...msg, read: true });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteMessage = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "messages", id));
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const selectMessage = (msg) => {
    setSelectedMessage(msg);
    setReplyText("");
    setReplyStatus("idle");
    markAsRead(msg);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setReplying(true);
    setReplyStatus("idle");
    
    try {
      const response = await fetch(`/api/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: selectedMessage.email,
          subject: `Re: Contact Form Submission`,
          message: replyText
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to send reply");
      }

      setReplyStatus("success");
      setReplyText("");
      
      // Optionally update the message doc to show it was replied to
      await updateDoc(doc(db, "messages", selectedMessage.id), { replied: true });
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, replied: true } : m));
      setSelectedMessage({ ...selectedMessage, replied: true });
      
    } catch (error) {
      console.error("Reply error:", error);
      setReplyStatus("error");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="glassmorphism rounded-2xl border border-sky-aqua-500/20 overflow-hidden flex flex-col md:flex-row h-[80vh] min-h-[600px]">
      
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/40">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-slate-100">Inbox</h2>
          <span className="bg-sky-aqua-500/20 text-sky-aqua-400 text-xs font-bold px-2 py-1 rounded-full">
            {messages.filter(m => !m.read).length} new
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No messages yet.</div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id}
                onClick={() => selectMessage(msg)}
                className={`p-4 border-b border-slate-800/50 cursor-pointer transition-colors relative group
                  ${selectedMessage?.id === msg.id ? 'bg-sky-aqua-900/20 border-l-2 border-l-sky-aqua-500' : 'hover:bg-slate-900/60 border-l-2 border-l-transparent'}
                `}
              >
                {!msg.read && <div className="absolute top-4 left-2 w-2 h-2 rounded-full bg-sky-aqua-400"></div>}
                
                <div className="flex justify-between items-start mb-1 pl-4">
                  <h3 className={`font-semibold text-sm truncate pr-4 ${!msg.read ? 'text-slate-200' : 'text-slate-400'}`}>
                    {msg.name}
                  </h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {msg.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                </div>
                
                <p className={`text-xs pl-4 truncate ${!msg.read ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                  {msg.message}
                </p>
                
                {msg.replied && (
                  <span className="absolute bottom-2 right-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded">Replied</span>
                )}
                
                <button 
                  onClick={(e) => deleteMessage(e, msg.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 flex flex-col bg-slate-900/20">
        {selectedMessage ? (
          <>
            <div className="p-8 border-b border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedMessage.name}</h2>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sky-aqua-400 hover:underline text-sm">
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="text-sm text-slate-500">
                  {selectedMessage.createdAt?.toDate().toLocaleString() || 'Just now'}
                </div>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-end bg-slate-900/40">
              <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Reply via info@n1code.dev</h3>
              <form onSubmit={handleReply} className="flex flex-col gap-4">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-sky-aqua-500 resize-none"
                />
                <div className="flex items-center justify-between">
                  <div>
                    {replyStatus === 'success' && <span className="text-emerald-400 text-sm">Reply sent successfully!</span>}
                    {replyStatus === 'error' && <span className="text-red-400 text-sm">Failed to send reply. Check console.</span>}
                  </div>
                  <button
                    type="submit"
                    disabled={replying || !replyText.trim()}
                    className="bg-sky-aqua-600 hover:bg-sky-aqua-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-sky-aqua-500/20"
                  >
                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a message to read and reply.
          </div>
        )}
      </div>
      
    </div>
  );
}
