import { CheckCircle2, XCircle } from 'lucide-react';

export default function StatusMessage({ status }) {
  if (!status) return null;
  
  const isError = status.type === 'error';
  
  return (
    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
      isError 
        ? 'bg-red-500/10 border-red-500/50 text-red-400' 
        : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
    }`}>
      {isError ? <XCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
      <p className="text-sm font-medium">{status.message}</p>
    </div>
  );
}
