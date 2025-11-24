import React, { useState, useRef, useEffect } from 'react';
import { generateLessonPlan } from './services/geminiService';
import MarkdownRenderer from './components/MarkdownRenderer';
import { LoadingState } from './types';
import type { LessonParams } from './types';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Printer, 
  RotateCcw,
  BrainCircuit,
  AlertCircle,
  FileText,
  User,
  Building,
  Clock,
  FileCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<LessonParams>({
    subject: '',
    topic: '',
    grade: '',
    integration: '',
    author: '',
    school: '',
    duration: ''
  });
  
  const [result, setResult] = useState<string>('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // State for print handling
  const [printSection, setPrintSection] = useState<'ppm' | 'lkpd' | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.subject || !params.topic || !params.grade) {
      setErrorMessage("Mohon lengkapi Mata Pelajaran, Topik, dan Kelas.");
      return;
    }

    setStatus(LoadingState.LOADING);
    setErrorMessage('');
    setResult('');

    try {
      const generatedText = await generateLessonPlan(params);
      setResult(generatedText);
      setStatus(LoadingState.SUCCESS);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error: any) {
      setStatus(LoadingState.ERROR);
      setErrorMessage(error.message || "Terjadi kesalahan yang tidak diketahui.");
    }
  };

  const handleReset = () => {
    setParams({ 
      subject: '', topic: '', grade: '', integration: '',
      author: '', school: '', duration: ''
    });
    setResult('');
    setStatus(LoadingState.IDLE);
  };

  const handlePrint = (section: 'ppm' | 'lkpd') => {
    setPrintSection(section);
    // Wait for state to update and DOM to reflect hidden classes
    setTimeout(() => {
      window.print();
    }, 100);
  };
  
  // Reset print section after printing is done (optional, but good for UX)
  useEffect(() => {
      const handleAfterPrint = () => {
          setPrintSection(null);
      };
      window.addEventListener("afterprint", handleAfterPrint);
      return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  // Split content logic
  const separator = "<!-- BATAS_DOKUMEN -->";
  const contentParts = result.split(separator);
  const ppmContent = contentParts[0] || "";
  const lkpdContent = contentParts.length > 1 ? contentParts[1] : "";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">Generator PPM & LKPD</h1>
              <span className="text-xs text-slate-500 font-medium tracking-wide">DEEP LEARNING ASSISTANT</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
             <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-500"/> Modul Ajar</span>
             <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-green-500"/> Materi & LKPD</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 gap-8 grid grid-cols-1 lg:grid-cols-12 print:block print:p-0">
        
        {/* Input Section - Hidden when printing */}
        <section className="lg:col-span-4 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Identitas Guru Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Identitas Umum
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nama Penulis / Guru
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="author"
                      value={params.author}
                      onChange={handleInputChange}
                      placeholder="Nama Lengkap & Gelar"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Asal Sekolah
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="school"
                      value={params.school}
                      onChange={handleInputChange}
                      placeholder="Nama Sekolah"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Alokasi Waktu
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="duration"
                      value={params.duration}
                      onChange={handleInputChange}
                      placeholder="Contoh: 2 x 40 Menit / 2 JP"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Data Pembelajaran Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2 mt-6">
                  <Layers className="w-5 h-5 text-blue-600" />
                  Data Pembelajaran
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="subject"
                      value={params.subject}
                      onChange={handleInputChange}
                      placeholder="Contoh: IPA, Bahasa Indonesia"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Materi / Topik <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="topic"
                      value={params.topic}
                      onChange={handleInputChange}
                      placeholder="Contoh: Perubahan Iklim"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kelas / Jenjang <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select
                      name="grade"
                      value={params.grade}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      <option value="7 SMP">Kelas 7 SMP</option>
                      <option value="8 SMP">Kelas 8 SMP</option>
                      <option value="9 SMP">Kelas 9 SMP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Integrasi Mapel (Opsional)
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="integration"
                      value={params.integration}
                      onChange={handleInputChange}
                      placeholder="Contoh: Matematika"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="pt-2 flex gap-3 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={status === LoadingState.LOADING}
                  className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  type="submit"
                  disabled={status === LoadingState.LOADING}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === LoadingState.LOADING ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Menyusun...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Lengkap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Output Section */}
        <section className="lg:col-span-8 print:w-full" ref={resultRef}>
          {status === LoadingState.IDLE && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-12 min-h-[400px]">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <BrainCircuit className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600">Belum ada hasil</h3>
              <p className="text-center max-w-sm mt-2">
                Isi formulir identitas dan data pembelajaran untuk membuat Modul Ajar Deep Learning lengkap.
              </p>
            </div>
          )}

          {status === LoadingState.LOADING && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col items-center justify-center">
               <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
               <h3 className="text-xl font-bold text-slate-800">Sedang Berpikir...</h3>
               <p className="text-slate-500 mt-2 text-center max-w-md animate-pulse">
                 AI sedang menyusun:<br/>
                 1. Informasi Umum Modul<br/>
                 2. Skenario Deep Learning (Understand, Apply, Reflect)<br/>
                 3. Outline Materi & Rancangan LKPD
               </p>
            </div>
          )}

          {status === LoadingState.SUCCESS && (
            <div className="space-y-6 print:space-y-0">
              
              {/* MODUL AJAR CONTAINER (PPM) */}
              <div className={`bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border-none print:rounded-none ${printSection === 'lkpd' ? 'hidden print:hidden' : ''}`}>
                {/* Result Toolbar */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                  <div>
                     <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600"/>
                        Modul Ajar Deep Learning
                     </h2>
                     <p className="text-xs text-slate-500">Tahap 1: Perencanaan Pembelajaran (PPM)</p>
                  </div>
                  <button 
                    onClick={() => handlePrint('ppm')}
                    className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors shadow-sm font-medium"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Modul (PPM)
                  </button>
                </div>

                {/* Content PPM */}
                <div className="p-8 print:p-0">
                   {/* Print Only Header */}
                   <div className="hidden print:block mb-8 pb-4 border-b-2 border-black">
                     <h1 className="text-xl font-bold uppercase text-center mb-1">Perencanaan Pembelajaran Deep Learning</h1>
                     <p className="text-center text-sm text-slate-600">Dokumen Perencanaan</p>
                   </div>
                   
                   <MarkdownRenderer content={ppmContent} />
                </div>
              </div>

              {/* LKPD CONTAINER */}
              {lkpdContent && (
                <div className={`bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border-none print:rounded-none ${printSection === 'ppm' ? 'hidden print:hidden' : ''}`}>
                  {/* Result Toolbar */}
                  <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                    <div>
                      <h2 className="text-lg font-bold text-green-800 flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-green-600"/>
                          Bahan Ajar & LKPD
                      </h2>
                      <p className="text-xs text-green-600">Tahap 2: Lampiran Pendukung Pembelajaran</p>
                    </div>
                    <button 
                      onClick={() => handlePrint('lkpd')}
                      className="flex items-center gap-2 text-sm bg-white text-green-700 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors shadow-sm font-medium"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak Materi & LKPD
                    </button>
                  </div>

                  {/* Content LKPD */}
                  <div className="p-8 print:p-0">
                    <div className="hidden print:block mb-8 pb-4 border-b-2 border-black">
                       <h1 className="text-xl font-bold uppercase text-center mb-1">Lampiran Materi & LKPD</h1>
                       <p className="text-center text-sm text-slate-600">Bahan Ajar Pendukung</p>
                     </div>
                    <MarkdownRenderer content={lkpdContent} />
                  </div>
                </div>
              )}

              <div className="mt-8 text-center text-slate-400 text-sm print:hidden">
                <p>Dokumen ini digenerate menggunakan Assistant PPM Deep Learning berbasis AI.</p>
              </div>
            </div>
          )}
          
          {status === LoadingState.ERROR && (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <div className="bg-white p-3 rounded-full w-fit mx-auto mb-4 shadow-sm">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-red-800 mb-2">Gagal Menyusun Rencana</h3>
                <p className="text-red-600 mb-6">{errorMessage}</p>
                <button 
                  onClick={handleSubmit}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Coba Lagi
                </button>
             </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto print:hidden">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Generator PPM & LKPD Deep Learning.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;