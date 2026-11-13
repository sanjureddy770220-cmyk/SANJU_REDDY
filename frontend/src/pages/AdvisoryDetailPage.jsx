// frontend/src/pages/AdvisoryDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import AdvisoryResultCard from '../components/AdvisoryResultCard';
import {
  ArrowLeft,
  Trash2,
  PlusCircle,
  AlertCircle,
  FileSearch,
  Sparkles
} from 'lucide-react';

export default function AdvisoryDetailPage() {
  const { id } = useParams();
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdvisory() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getAdvisory(id);
        if (res?.data) {
          setAdvisory(res.data);
        } else {
          setError('Advisory report not found.');
        }
      } catch (err) {
        console.error('Failed to load advisory:', err);
        setError(err.message || 'Failed to retrieve advisory report.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAdvisory();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this advisory report?')) {
      return;
    }
    try {
      await api.deleteAdvisory(id);
      navigate('/history');
    } catch (err) {
      alert(err.message || 'Failed to delete advisory');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-stone-200 rounded w-1/4"></div>
        <div className="h-96 bg-stone-200 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Report Not Found</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          {error || 'The requested crop advisory could not be retrieved.'}
        </p>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Advisory Logs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Nav actions */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory Archive</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/advisory/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>New Diagnosis</span>
          </Link>

          <button
            onClick={handleDelete}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Delete advisory report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advisory Card */}
      <AdvisoryResultCard advisory={advisory} />
    </div>
  );
}

