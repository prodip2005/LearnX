'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.init';
import {
  Loader2,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Target,
} from 'lucide-react';

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.75)',
  borderRadius: '18px',
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: 'easeOut' },
});

const getStatus = (score) => {
  if (score >= 80)
    return {
      color: '#16a34a',
      soft: 'rgba(22,163,74,0.1)',
      label: 'Excellent',
      comment: 'Outstanding',
    };
  if (score >= 60)
    return {
      color: '#d97706',
      soft: 'rgba(217,119,6,0.1)',
      label: 'Good Job',
      comment: 'Improving',
    };
  return {
    color: '#dc2626',
    soft: 'rgba(220,38,38,0.1)',
    label: 'Keep Practicing',
    comment: 'Needs Effort',
  };
};

const StudentProgressClient = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) fetchResults(u.email);
    });
    return () => unsubscribe();
  }, []);

  const fetchResults = async (email) => {
    try {
      const res = await fetch(`/api/exams/submit?email=${email}`);
      const data = await res.json();
      if (data.success) {
        const map = new Map();
        data.data.forEach((item) => {
          map.set(item.roomCode, {
            score: (item.totalMark / item.totalQuestions) * 100,
            subject: item.examSubject,
          });
        });
        setResults(
          Array.from(map.values()).map((item, idx) => ({
            name: `Ex ${idx + 1}`,
            score: Math.round(item.score),
            subject: item.subject,
          })),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const averageScore =
    results.length > 0
      ? Math.round(results.reduce((a, c) => a + c.score, 0) / results.length)
      : 0;
  const best =
    results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;
  const lowest =
    results.length > 0 ? Math.min(...results.map((r) => r.score)) : 0;
  const status = getStatus(averageScore);
  const circumference = 2 * Math.PI * 68;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="animate-spin mb-3 text-slate-400" size={26} />
        <p className="text-slate-400 text-sm">Analyzing your progress…</p>
      </div>
    );

  if (results.length === 0)
    return (
      <div style={{ ...glass, padding: '56px 32px', textAlign: 'center' }}>
        <BookOpen
          size={36}
          style={{ color: '#cbd5e1', margin: '0 auto 12px' }}
        />
        <p style={{ color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
          No exam data yet.
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>
          Complete an exam to see your progress here.
        </p>
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero score card */}
      <motion.div
        {...fadeUp(0)}
        style={{
          ...glass,
          padding: '36px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap',
        }}
      >
        {/* Ring */}
        <div
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            flexShrink: 0,
          }}
        >
          <svg
            style={{
              width: '100%',
              height: '100%',
              transform: 'rotate(-90deg)',
            }}
            viewBox="0 0 160 160"
          >
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="rgba(0,0,0,0.07)"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="68"
              stroke={status.color}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset:
                  circumference - (circumference * averageScore) / 100,
              }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1,
              }}
            >
              {averageScore}%
            </motion.span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: status.color,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 5,
              }}
            >
              {status.comment}
            </span>
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#94a3b8',
              marginBottom: 8,
            }}
          >
            Overall Accuracy
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px',
            }}
          >
            {status.label}
          </p>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
            Based on {results.length} unique exam
            {results.length !== 1 ? 's' : ''}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: status.soft,
              border: `1px solid ${status.color}30`,
              borderRadius: 50,
              padding: '6px 16px',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: status.color,
                display: 'inline-block',
              }}
            />
            <span
              style={{ fontSize: 12, fontWeight: 600, color: status.color }}
            >
              {status.comment}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3 stat cards */}
      <motion.div
        {...fadeUp(0.08)}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 12,
        }}
      >
        {[
          {
            icon: <Target size={15} />,
            label: 'Exams Taken',
            value: `${results.length}`,
          },
          { icon: <Zap size={15} />, label: 'Best Score', value: `${best}%` },
          {
            icon: <Award size={15} />,
            label: 'Lowest Score',
            value: `${lowest}%`,
          },
        ].map((s, i) => (
          <div key={i} style={{ ...glass, padding: '20px 18px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                color: '#94a3b8',
                marginBottom: 12,
              }}
            >
              {s.icon}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {s.label}
              </span>
            </div>
            <p
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Chart card */}
      <motion.div {...fadeUp(0.16)} style={{ ...glass, padding: '28px 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <TrendingUp size={14} style={{ color: '#6366f1' }} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#475569',
              }}
            >
              Performance Analytics
            </span>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              ['#16a34a', '≥ 80%'],
              ['#d97706', '≥ 60%'],
              ['#dc2626', '< 60%'],
            ].map(([c, l]) => (
              <span
                key={l}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  color: '#94a3b8',
                  fontSize: 11,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: c,
                    display: 'inline-block',
                  }}
                />
                {l}
              </span>
            ))}
          </div>
        </div>

        <div style={{ height: 210 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results} barCategoryGap="40%">
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                dy={8}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#cbd5e1', fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
                width={36}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 8 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const s = getStatus(payload[0].value);
                    return (
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.92)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: 12,
                          padding: '10px 14px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                      >
                        <p
                          style={{
                            color: '#94a3b8',
                            fontSize: 11,
                            marginBottom: 3,
                          }}
                        >
                          {payload[0].payload.subject}
                        </p>
                        <p
                          style={{
                            color: '#0f172a',
                            fontSize: 22,
                            fontWeight: 800,
                            margin: 0,
                          }}
                        >
                          {payload[0].value}%
                        </p>
                        <p
                          style={{
                            color: s.color,
                            fontSize: 10,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginTop: 2,
                          }}
                        >
                          {s.comment}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 4, 4]} barSize={28}>
                {results.map((entry, i) => (
                  <Cell
                    key={i}
                    fill="var(--color-primary)"
                    fillOpacity={
                      entry.score >= 80 ? 1 : entry.score >= 60 ? 0.7 : 0.4
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p
          style={{
            color: '#cbd5e1',
            fontSize: 10,
            textAlign: 'center',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: 16,
          }}
        >
          Latest attempt per exam only
        </p>
      </motion.div>
    </div>
  );
};

export default StudentProgressClient;
