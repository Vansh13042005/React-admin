// src/admin/pages/FeedbackPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Star, RefreshCw, Mail, User, Calendar, TrendingUp, MessageSquare, Award } from 'lucide-react';

const API_URL   = 'https://profolionode.vanshpatel.in/api/feedback';
const CACHE_KEY = 'admin_feedback';
const CACHE_TTL = 2 * 60 * 1000; // 2 min

// ── Star Rating Display ────────────────────────────────────────────────────
const StarRating = ({ rating, size = 15 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= rating
          ? 'text-yellow-400 fill-yellow-400'
          : 'text-gray-300 dark:text-gray-600'}
      />
    ))}
  </div>
);

// ── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div>
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="flex gap-0.5 mt-2">
      {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />)}
    </div>
  </div>
);

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// ── Rating Badge ───────────────────────────────────────────────────────────
const ratingColor = (r) => {
  if (r >= 5) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (r >= 4) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  if (r >= 3) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
};

// ── Main Component ─────────────────────────────────────────────────────────
const FeedbackPage = () => {
  const [feedbacks, setFeedbacks]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [refreshing, setRefreshing]     = useState(false);
  const [filterRating, setFilterRating] = useState(0); // 0 = All

  // ── Fetch ──
  const fetchFeedback = useCallback(async (forceRefresh = false) => {
    // Cache check
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setFeedbacks(data);
            setLoading(false);
            return;
          }
        }
      } catch (_) {}
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('authToken') || '';
      const res   = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      const data = json.data || json || [];

      setFeedbacks(data);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const handleRefresh = () => {
    setRefreshing(true);
    sessionStorage.removeItem(CACHE_KEY);
    fetchFeedback(true);
  };

  // ── Stats ──
  const total       = feedbacks.length;
  const avgRating   = total ? (feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : '—';
  const fiveStars   = feedbacks.filter((f) => f.rating === 5).length;

  // ── Filter ──
  const filtered = filterRating === 0
    ? feedbacks
    : feedbacks.filter((f) => f.rating === filterRating);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feedback</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            All visitor ratings & reviews
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all disabled:opacity-60"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={MessageSquare} label="Total Feedback"  value={total}      color="bg-blue-500" />
        <StatCard icon={TrendingUp}    label="Average Rating"  value={avgRating}  color="bg-purple-500" />
        <StatCard icon={Award}         label="5-Star Reviews"  value={fiveStars}  color="bg-yellow-500" />
      </div>

      {/* ── Filter by rating ── */}
      <div className="flex flex-wrap gap-2">
        {[0, 5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRating(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              filterRating === r
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
          >
            {r === 0 ? 'All' : `${r} ★`}
            {r !== 0 && (
              <span className="ml-1 opacity-70">
                ({feedbacks.filter((f) => f.rating === r).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
          ⚠️ {error} — <button onClick={handleRefresh} className="underline font-medium">Try again</button>
        </div>
      )}

      {/* ── Skeleton ── */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Feedback Cards ── */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p>No feedback found{filterRating !== 0 ? ` for ${filterRating} stars` : ''}.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    {/* Avatar + Name + Email */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {fb.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                          <User size={12} className="text-gray-400" />
                          {fb.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail size={11} />
                          {fb.email || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Rating badge */}
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${ratingColor(fb.rating)}`}>
                      {fb.rating}/5
                    </span>
                  </div>

                  {/* Stars */}
                  <StarRating rating={fb.rating} />

                  {/* Date */}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(fb.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackPage;