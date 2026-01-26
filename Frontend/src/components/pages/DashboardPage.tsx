import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Loader2, LogOut,  Trash2, Star, Zap, History, LayoutDashboard } from 'lucide-react';
import type { DashboardPageProps, AnalysisResult } from '../../types';
import { API_BASE_URL } from '../../types';
import AlertMessage from '../ui/AlertMessage';
import { IconMicroscope, IconLeaf } from '../ui/Icons';
import FARMER_HERO_IMAGE_URL from '../../assets/tech.jpg';


/* ========================================================================
   1. SHARED COMPONENTS & CONSTANTS
======================================================================== */
const FARMER_TESTIMONIALS = [
    { name: "Aisha M.", rating: 5, quote: "The analysis is fast and the treatment recommendations saved my harvest!", avatar: "AM" },
    { name: "John K.", rating: 4, quote: "Simple to use, even for an old farmer like me. The confidence score helps me trust the results.", avatar: "JK" },
    { name: "Sita P.", rating: 5, quote: "I can check my Coffee leaves right in the field. Essential tool for modern agriculture.", avatar: "SP" },

];

/* ========================================================================
   2. VIEW: DASHBOARD HOME (Welcome)
======================================================================== */

const AppRatingCard: React.FC = () => (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border-t-4 border-amber-500">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-amber-300">Farmer Rating</h2>
            <p className="text-sm text-gray-400">based on 1.2K reviews</p>
        </div>
        <div className="flex items-center mt-4">
            <p className="text-6xl font-extrabold text-amber-400 mr-4">4.8</p>
            <div className="flex flex-col">
                <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-6 h-6 ${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-amber-500 fill-amber-500/50'}`}
                        />
                    ))}
                </div>
                <p className="text-sm mt-1 text-amber-300">Excellent Tool</p>
            </div>
        </div>
        <p className="mt-4 text-sm text-amber-400 border-t border-gray-700 pt-3">
            Join thousands of satisfied farmers protecting their crops.
        </p>
    </div>
);

const DashboardHome: React.FC<{ userEmail: string; onStartScan: () => void }> = ({ userEmail, onStartScan }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        {/* 1. HERO SECTION */}
        <div className="grid md:grid-cols-2 bg-gray-900/90 rounded-2xl shadow-2xl border-l-4 border-amber-500 overflow-hidden">
            <div className="p-8">
                <h1 className="text-3xl font-extrabold text-amber-200 mb-3">
                    Hello, <span className="text-amber-500">{userEmail.split('@')[0]}</span>!
                </h1>
                <p className="text-lg text-amber-300 mb-6">
                    Ready to protect your harvest? Use Coffee Scan AI for instant, accurate disease diagnosis and treatment recommendations for your Coffee leaves.
                </p>
                <button
                    onClick={onStartScan}
                    className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
                >
                    <Zap className="h-6 w-6" /> <span>Start New Scan</span>
                </button>
            </div>
            <div className="hidden md:block">
                <img src={FARMER_HERO_IMAGE_URL} alt="Farmer" className="w-full h-full object-cover" />
            </div>
        </div>

        {/* 2. BOTTOM GRID: RATING & TESTIMONIALS */}
        <div className="grid lg:grid-cols-2 gap-8">

            {/* LEFT COLUMN: The Detailed Rating Card */}
            <AppRatingCard />

            {/* RIGHT COLUMN: The Farmer Testimonials */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
                <h2 className="text-xl font-bold text-amber-300 mb-6 border-b border-amber-500 pb-2 flex items-center space-x-2">
                    What The Farmers Say 🗣️
                </h2>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {FARMER_TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-colors">
                            <div className="flex items-center mb-3">
                                {/* Map the Avatar */}
                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-gray-900 font-bold text-sm mr-3">
                                    {t.avatar}
                                </div>

                                <div>
                                    {/* Map the Name */}
                                    <p className="font-semibold text-amber-300">{t.name}</p>

                                    {/* Map the Rating (Stars) */}
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, starIdx) => (
                                            <Star
                                                key={starIdx}
                                                className={`w-3 h-3 ${starIdx < t.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Map the Quote */}
                            <blockquote className="text-sm italic text-amber-400 border-l-2 border-amber-600 pl-3">
                                "{t.quote}"
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ========================================================================
   3. VIEW: SCAN PAGE (Upload Only)
======================================================================== */
interface ScanPageProps {
    userEmail: string;
    userToken: string | null;
    fetchSavedScans: () => Promise<void>;
    onComplete: () => void;
}

const ScanPage: React.FC<ScanPageProps> = ({ userEmail, userToken, fetchSavedScans, onComplete }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('user_email', userEmail);

            const res = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: { ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}) },
                body: formData
            });

            if (res.ok) {
                setMessage({ text: 'Scan successful! Redirecting to history...', type: 'success' });
                await fetchSavedScans();
                setTimeout(onComplete, 1500); // Move to history tab after success
            } else {
                setMessage({ text: 'Analysis failed. Please try again.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Network error.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-800/90 p-8 rounded-2xl border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 border-b border-amber-500 pb-2">New Leaf Scan</h2>
            <AlertMessage message={message?.text || null} type={message?.type || null} />
            <form onSubmit={handleUpload} className="space-y-6">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-amber-500 rounded-xl cursor-pointer bg-gray-900/80 hover:bg-gray-800 transition-colors">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-2" />
                    ) : (
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-2 text-amber-500" />
                            <p className="text-amber-200">Upload Coffee Leaf</p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setSelectedFile(file);
                            setPreviewUrl(URL.createObjectURL(file));
                        }
                    }} />
                </label>
                <button disabled={isLoading || !selectedFile} className="w-full bg-amber-500 text-gray-900 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Zap />}
                    <span>{isLoading ? 'Analyzing...' : 'Run Diagnosis'}</span>
                </button>
            </form>
        </div>
    );
};

/* ========================================================================
   4. VIEW: HISTORY PAGE (List Scans)
======================================================================== */
const HistoryPage: React.FC<{ 
    results: AnalysisResult[]; 
    onDelete: (id: any) => void 
}> = ({ results, onDelete }) => (
    <div className="bg-gray-800/90 p-6 rounded-2xl border border-gray-700 shadow-xl min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-6 border-b border-amber-500 pb-2 text-amber-500">
            Your Scan History ({results.length})
        </h2>
        
        {results.length === 0 ? (
            <div className="text-center py-20 text-amber-500">
                <IconMicroscope className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No scans found. Start by scanning a leaf!</p>
            </div>
        ) : (
            <div className="grid gap-6 max-h-[80vh] overflow-y-auto pr-2">
                {results.map((res, i) => (
                    <div 
                        key={res.scan_id || i} 
                        className="p-5 bg-gray-900/50 border border-gray-700 rounded-2xl shadow-lg relative"
                    >
                        {/* Header Section: Title, Date, and Confidence */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-amber-500 capitalize">
                                    {res.prediction}
                                </h3>
                                <p className="text-sm text-amber-500/80">
                                    Scanned: {res.timestamp}
                                </p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-amber-500">
                                        {(res.confidence * 100).toFixed(1)}%
                                    </span>
                                    <p className="text-xs text-amber-500/70 uppercase tracking-wider">Confidence</p>
                                </div>
                                
                                <button 
                                    onClick={() => onDelete(res.scan_id)} 
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                                    aria-label="Delete scan"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Recommendation Box - Matching your first image */}
                        {res.recommendation && (
                            <div className="mt-4 p-4 bg-gray-900 border border-amber-600/50 rounded-xl">
                                <h4 className="text-amber-500 font-bold mb-2 text-sm uppercase tracking-tight">
                                    Recommendation
                                </h4>
                                <p className="text-amber-200 text-sm leading-relaxed">
                                    {res.recommendation}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
);
/* ========================================================================
   5. MAIN CONTROLLER
======================================================================== */
const DashboardPage: React.FC<DashboardPageProps> = ({ userToken, userEmail, onLogout }) => {
    const [currentView, setCurrentView] = useState<'home' | 'scan' | 'history'>('home');
    const [results, setResults] = useState<AnalysisResult[]>([]);

    const fetchSavedScans = useCallback(async () => {
        if (!userEmail) return;
        try {
            const res = await fetch(`${API_BASE_URL}/get_scans/${encodeURIComponent(userEmail)}`, {
                headers: { ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}) }
            });
            const data = await res.json();
            if (data?.scans) {
                setResults(data.scans.map((s: any) => ({
                    scan_id: s.scan_id,
                    prediction: s.prediction,
                    confidence: s.confidence || 0,
                    recommendation: s.treatment_recommendation,
                    image: s.image_link, // Ensure this matches your backend field
                    timestamp: s.date ? new Date(s.date).toLocaleString() : 'Recent'
                })));
            }
        } catch (e) { console.error("History fetch error", e); }
    }, [userEmail, userToken]);

    const handleDelete = async (id: any) => {
        if (!window.confirm("Delete this scan?")) return;
        try {
            await fetch(`${API_BASE_URL}/delete_scan/${id}`, {
                method: 'DELETE',
                headers: { ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}) }
            });
            setResults(prev => prev.filter(r => r.scan_id !== id));
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchSavedScans(); }, [fetchSavedScans]);

    return (
        <div className="min-h-screen bg-gray-950 text-amber-300">
            {/* Nav Bar */}
            <nav className="fixed top-0 w-full bg-gray-900/95 border-b border-gray-800 z-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2 font-bold text-xl text-amber-500">
                    <IconLeaf /> <span>Coffee Scan</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setCurrentView('home')} className={`p-2 rounded-lg ${currentView === 'home' ? 'bg-amber-500 text-gray-900' : 'hover:bg-gray-800'}`}><LayoutDashboard className="w-5 h-5" /></button>
                    <button onClick={() => setCurrentView('scan')} className={`p-2 rounded-lg ${currentView === 'scan' ? 'bg-amber-500 text-gray-900' : 'hover:bg-gray-800'}`}><Zap className="w-5 h-5" /></button>
                    <button onClick={() => setCurrentView('history')} className={`p-2 rounded-lg ${currentView === 'history' ? 'bg-amber-500 text-gray-900' : 'hover:bg-gray-800'}`}><History className="w-5 h-5" /></button>
                    <button onClick={onLogout} className="text-red-500 p-2 hover:bg-red-950 rounded-lg"><LogOut className="w-5 h-5" /></button>
                </div>
            </nav>

            {/* Content Area */}
            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                {currentView === 'home' && <DashboardHome userEmail={userEmail} onStartScan={() => setCurrentView('scan')} />}
                {currentView === 'scan' && <ScanPage userEmail={userEmail} userToken={userToken} fetchSavedScans={fetchSavedScans} onComplete={() => setCurrentView('history')} />}
                {currentView === 'history' && <HistoryPage results={results} onDelete={handleDelete} />}
            </main>
        </div>
    );
};

export default DashboardPage;