
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

interface EmbedGateProps {
  children: React.ReactNode;
}

const EmbedGate: React.FC<EmbedGateProps> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(true);

  useEffect(() => {
    // Logic:
    // 1. Check if running inside an iframe (window.self !== window.top)
    // 2. Check if running on localhost (for development)
    
    const isEmbedded = window.self !== window.top;
    const isLocalhost = window.location.hostname.includes('localhost') || 
                        window.location.hostname.includes('127.0.0.1');

    // If NOT embedded AND NOT localhost, deny access
    if (!isEmbedded && !isLocalhost) {
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }
  }, []);

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-red-100 text-center">
          <div className="bg-red-600 p-8">
             <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-pulse">
                <ShieldAlert className="w-10 h-10 text-white" />
             </div>
             <h1 className="text-2xl font-bold text-white">Akses Ditolak</h1>
             <p className="text-red-100 mt-2">Direct Access Restricted</p>
          </div>
          
          <div className="p-8 space-y-4">
            <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm border border-red-100">
              <p className="font-semibold flex items-center justify-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                Aplikasi Dilindungi
              </p>
              <p>
                Aplikasi Generator PPM ini hanya dapat diakses melalui <strong>Portal Member Website Sekolah</strong>.
              </p>
            </div>
            
            <p className="text-slate-500 text-sm">
              Silakan login ke website member area Anda dan buka aplikasi dari halaman yang tersedia.
            </p>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <p className="text-xs text-slate-400">
                Error Code: ERR_DIRECT_ACCESS_FORBIDDEN
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EmbedGate;
