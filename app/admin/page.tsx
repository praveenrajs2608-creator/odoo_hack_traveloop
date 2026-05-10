'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/utils'
import {
  Users, Map, Globe2, TrendingUp, Activity, Eye, Search,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieIcon,
  Calendar, MapPin, Compass, Wallet,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

/* ── Mock analytics data ── */

const STATS = [
  { icon: Users, label: 'Total Users', value: '2,847', change: '+12.5%', up: true, color: 'text-blue-600 bg-blue-50' },
  { icon: Map, label: 'Active Trips', value: '1,204', change: '+8.3%', up: true, color: 'text-amber-600 bg-amber-50' },
  { icon: Globe2, label: 'Cities Explored', value: '156', change: '+23', up: true, color: 'text-teal-600 bg-teal-50' },
  { icon: Activity, label: 'AI Queries Today', value: '342', change: '-4.2%', up: false, color: 'text-purple-600 bg-purple-50' },
]

const USER_GROWTH = [
  { month: 'Jan', users: 820, trips: 340 },
  { month: 'Feb', users: 1040, trips: 480 },
  { month: 'Mar', users: 1380, trips: 620 },
  { month: 'Apr', users: 1650, trips: 780 },
  { month: 'May', users: 2100, trips: 950 },
  { month: 'Jun', users: 2420, trips: 1080 },
  { month: 'Jul', users: 2847, trips: 1204 },
]

const POPULAR_CITIES = [
  { name: 'Goa', trips: 234, pct: 19 },
  { name: 'Manali', trips: 198, pct: 16 },
  { name: 'Bali', trips: 167, pct: 14 },
  { name: 'Paris', trips: 145, pct: 12 },
  { name: 'Dubai', trips: 132, pct: 11 },
  { name: 'Jaipur', trips: 118, pct: 10 },
  { name: 'Tokyo', trips: 105, pct: 8 },
  { name: 'Maldives', trips: 98, pct: 8 },
]

const ACTIVITY_BREAKDOWN = [
  { name: 'Sightseeing', value: 32, color: '#3B82F6' },
  { name: 'Food', value: 24, color: '#F59E0B' },
  { name: 'Adventure', value: 18, color: '#10B981' },
  { name: 'Culture', value: 14, color: '#8B5CF6' },
  { name: 'Shopping', value: 8, color: '#EC4899' },
  { name: 'Nightlife', value: 4, color: '#6366F1' },
]

const BUDGET_DIST = [
  { range: 'Under ₹20k', users: 680 },
  { range: '₹20k–60k', users: 1120 },
  { range: '₹60k–1.5L', users: 720 },
  { range: '₹1.5L+', users: 327 },
]

const RECENT_USERS = [
  { name: 'Priya Sharma', email: 'priya@email.com', trips: 4, joined: '2 days ago', avatar: '🧕' },
  { name: 'Arjun Mehta', email: 'arjun@email.com', trips: 7, joined: '3 days ago', avatar: '👨‍💻' },
  { name: 'Sneha Patel', email: 'sneha@email.com', trips: 2, joined: '5 days ago', avatar: '👩‍🎨' },
  { name: 'Rahul Verma', email: 'rahul@email.com', trips: 9, joined: '1 week ago', avatar: '🧗' },
  { name: 'Kavita Iyer', email: 'kavita@email.com', trips: 3, joined: '1 week ago', avatar: '👩‍🏫' },
]

const POPULAR_ACTIVITIES = [
  { name: 'Eiffel Tower Visit', city: 'Paris', count: 312, type: 'sightseeing' },
  { name: 'Baga Beach', city: 'Goa', count: 287, type: 'beach' },
  { name: 'Manali Paragliding', city: 'Manali', count: 245, type: 'adventure' },
  { name: 'Jaipur Palace Tour', city: 'Jaipur', count: 198, type: 'heritage' },
  { name: 'Dubai Desert Safari', city: 'Dubai', count: 176, type: 'adventure' },
]

const TABS = ['Overview', 'Users', 'Analytics'] as const

/* ── Component ── */

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Overview')

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Platform analytics and user management</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Last 30 days
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 -mb-4">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px
              ${activeTab === tab ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-400 hover:text-navy-900'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {STATS.map(stat => (
          <motion.div key={stat.label} variants={staggerItem}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth - Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-navy-900 text-sm">User Growth & Trips</h3>
              <p className="text-xs text-gray-400 mt-0.5">Monthly user registrations and trip creation</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-300" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F1B2D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F1B2D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5A623" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="users" stroke="#0F1B2D" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Users" />
                <Area type="monotone" dataKey="trips" stroke="#F5A623" strokeWidth={2} fillOpacity={1} fill="url(#colorTrips)" name="Trips" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Breakdown - Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Activity Types</h3>
              <p className="text-xs text-gray-400 mt-0.5">Breakdown by category</p>
            </div>
            <PieIcon className="w-5 h-5 text-gray-300" />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ACTIVITY_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {ACTIVITY_BREAKDOWN.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {ACTIVITY_BREAKDOWN.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-[11px] text-gray-500 truncate">{item.name}</span>
                <span className="text-[11px] font-semibold text-navy-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Cities - Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Popular Destinations</h3>
              <p className="text-xs text-gray-400 mt-0.5">Top cities by trip count</p>
            </div>
            <MapPin className="w-5 h-5 text-gray-300" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={POPULAR_CITIES} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                <Bar dataKey="trips" fill="#F5A623" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Distribution - Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Budget Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">User spending preferences</p>
            </div>
            <Wallet className="w-5 h-5 text-gray-300" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUDGET_DIST}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                <Bar dataKey="users" radius={[8, 8, 0, 0]} barSize={48}>
                  {BUDGET_DIST.map((_, i) => (
                    <Cell key={i} fill={['#4ECDC4', '#F5A623', '#3B82F6', '#8B5CF6'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Users + Popular Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-900 text-sm">Recent Users</h3>
            <button className="text-xs text-amber-500 hover:text-amber-600 font-semibold">View All</button>
          </div>
          <div className="space-y-3">
            {RECENT_USERS.map(u => (
              <div key={u.email} className="flex items-center gap-3 py-2 px-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-lg flex-shrink-0">
                  {u.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-navy-900">{u.trips} trips</p>
                  <p className="text-[10px] text-gray-400">{u.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Activities */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-900 text-sm">Popular Activities</h3>
            <button className="text-xs text-amber-500 hover:text-amber-600 font-semibold">View All</button>
          </div>
          <div className="space-y-3">
            {POPULAR_ACTIVITIES.map((a, i) => (
              <div key={a.name} className="flex items-center gap-3 py-2 px-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-sm font-bold text-amber-600 flex-shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{a.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{a.city}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-navy-900">{a.count}</p>
                  <p className="text-[10px] text-gray-400">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
