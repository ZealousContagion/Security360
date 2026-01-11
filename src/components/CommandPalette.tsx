'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, User, FileText, Receipt, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    type: 'customer' | 'quote' | 'invoice';
    title: string;
    subtitle: string;
    url: string;
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut listeners
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('open-command-palette', handleOpen);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('open-command-palette', handleOpen);
        };
    }, [isOpen]);

    // Handle search fetching
    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results);
                setSelectedIndex(0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            if (results[selectedIndex]) {
                navigateTo(results[selectedIndex].url);
            }
        }
    };

    const navigateTo = (url: string) => {
        router.push(url);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-black/5 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center px-4 border-b border-dashed border-black/5">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search anything... (Customers, Quotes, Invoices)"
                        className="flex-1 h-14 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none px-4"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded border border-black/10 bg-accent/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ESC</kbd>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading && (
                        <div className="p-8 text-center text-muted-foreground">
                            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Searching records...</p>
                        </div>
                    )}

                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            <p className="text-[10px] font-bold uppercase tracking-widest">No matching records found</p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="p-2">
                            {results.map((result, index) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-all ${
                                        index === selectedIndex ? 'bg-primary text-primary-foreground shadow-lg scale-[1.01]' : 'hover:bg-accent/50'
                                    }`}
                                    onClick={() => navigateTo(result.url)}
                                >
                                    <div className={`p-2 rounded-md ${index === selectedIndex ? 'bg-white/20' : 'bg-accent'}`}>
                                        {result.type === 'customer' && <User className="w-4 h-4" />}
                                        {result.type === 'quote' && <FileText className="w-4 h-4" />}
                                        {result.type === 'invoice' && <Receipt className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-tight">{result.title}</p>
                                        <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 opacity-80`}>{result.subtitle}</p>
                                    </div>
                                    <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                                        index === selectedIndex ? 'border-white/20 bg-white/10' : 'border-black/5 bg-accent/50'
                                    }`}>
                                        {result.type}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!loading && query.length < 2 && (
                        <div className="p-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-accent/30 rounded-lg border border-dashed border-black/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Command className="w-3 h-3 text-primary" />
                                        Quick Shortcuts
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                            <span>New Quote</span>
                                            <kbd className="px-1.5 py-0.5 rounded border border-black/10 bg-white">Q</kbd>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                            <span>Customers</span>
                                            <kbd className="px-1.5 py-0.5 rounded border border-black/10 bg-white">C</kbd>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg border border-dashed border-primary/20">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 text-primary">Pro Tip</h4>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Search for customer names, email addresses, or invoice numbers to jump to records instantly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
