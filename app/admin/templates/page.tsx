// app/admin/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string;
  price_basic: number;
  price_premium: number;
  price_gold: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Modern',
    thumbnail_url: '',
    price_basic: 0,
    price_premium: 0,
    price_gold: 0,
    features: '',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    const supabase = createClient();
    const { data } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });
    setTemplates(data || []);
    setIsLoading(false);
  }

  async function saveTemplate() {
    const supabase = createClient();
    const featuresArray = formData.features.split(',').map(f => f.trim());
    
    if (editingTemplate) {
      const { error } = await supabase
        .from('templates')
        .update({
          name: formData.name,
          category: formData.category,
          thumbnail_url: formData.thumbnail_url,
          price_basic: formData.price_basic,
          price_premium: formData.price_premium,
          price_gold: formData.price_gold,
          features: featuresArray,
          is_active: formData.is_active
        })
        .eq('id', editingTemplate.id);
      
      if (!error) {
        fetchTemplates();
        setShowAddModal(false);
        setEditingTemplate(null);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('templates')
        .insert({
          name: formData.name,
          category: formData.category,
          thumbnail_url: formData.thumbnail_url,
          price_basic: formData.price_basic,
          price_premium: formData.price_premium,
          price_gold: formData.price_gold,
          features: featuresArray,
          is_active: formData.is_active
        });
      
      if (!error) {
        fetchTemplates();
        setShowAddModal(false);
        resetForm();
      }
    }
  }

  async function deleteTemplate(id: string) {
    if (confirm('Yakin ingin menghapus template ini?')) {
      const supabase = createClient();
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
      
      if (!error) {
        fetchTemplates();
      }
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      category: 'Modern',
      thumbnail_url: '',
      price_basic: 0,
      price_premium: 0,
      price_gold: 0,
      features: '',
      is_active: true
    });
  }

  function editTemplate(template: Template) {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      thumbnail_url: template.thumbnail_url || '',
      price_basic: template.price_basic,
      price_premium: template.price_premium,
      price_gold: template.price_gold,
      features: template.features?.join(', ') || '',
      is_active: template.is_active
    });
    setShowAddModal(true);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar (sama seperti sebelumnya) */}
      <aside className="w-64 h-screen bg-slate-900 text-white p-6 sticky top-0">
        <div className="text-xl font-bold mb-10 text-amber-400">KISAHKITA</div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Pengguna
          </Link>
          <Link href="/admin/templates" className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border-l-4 border-amber-500 text-amber-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Template
          </Link>
          <Link href="/admin/invitations" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19h18" />
            </svg>
            Undangan
          </Link>
          <Link href="/admin/transactions" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Transaksi
          </Link>
          <Link href="/admin/promotions" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
            Promosi
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pengaturan
          </Link>
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            className="flex items-center gap-3 p-3 w-full hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-red-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Template</h1>
            <p className="text-slate-500">Kelola template undangan</p>
          </div>
          <button 
            onClick={() => {
              setEditingTemplate(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Template
          </button>
        </header>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="h-40 bg-slate-100 flex items-center justify-center">
                {template.thumbnail_url ? (
                  <img src={template.thumbnail_url} alt={template.name} className="h-full w-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800">{template.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    template.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {template.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-2">{template.category}</p>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">Basic: Rp {template.price_basic?.toLocaleString()}</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">Premium: Rp {template.price_premium?.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => editTemplate(template)}
                    className="flex-1 px-3 py-1.5 border border-amber-500 text-amber-600 rounded-lg text-sm hover:bg-amber-500 hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteTemplate(template.id)}
                    className="px-3 py-1.5 border border-red-500 text-red-600 rounded-lg text-sm hover:bg-red-500 hover:text-white transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12 text-slate-500">Belum ada template</div>
        )}
      </main>

      {/* Modal Tambah/Edit Template */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingTemplate ? 'Edit Template' : 'Tambah Template'}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Nama Template</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Modern">Modern</option>
                  <option value="Rustic">Rustic</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">URL Thumbnail</label>
                <input
                  type="text"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="/templates/thumbnail.jpg"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Harga Basic</label>
                  <input
                    type="number"
                    value={formData.price_basic}
                    onChange={(e) => setFormData({ ...formData, price_basic: parseInt(e.target.value) })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Harga Premium</label>
                  <input
                    type="number"
                    value={formData.price_premium}
                    onChange={(e) => setFormData({ ...formData, price_premium: parseInt(e.target.value) })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Harga Gold</label>
                  <input
                    type="number"
                    value={formData.price_gold}
                    onChange={(e) => setFormData({ ...formData, price_gold: parseInt(e.target.value) })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Fitur (pisahkan dengan koma)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Modern Design, Elegant Typography, Photo Gallery"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label className="text-sm text-slate-600">Aktifkan template</label>
              </div>
              <button
                onClick={saveTemplate}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}