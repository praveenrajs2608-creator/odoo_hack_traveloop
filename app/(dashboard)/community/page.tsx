'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/utils'
import {
  Search, SlidersHorizontal, ArrowUpDown, LayoutGrid,
  Heart, MessageCircle, Share2, MapPin, Bookmark, Sparkles,
} from 'lucide-react'

const MOCK_POSTS = [
  {
    id: 1,
    user: { name: 'Priya Sharma', avatar: '🧕', location: 'Mumbai, India' },
    trip: 'Rajasthan Road Trip',
    image: '/images/rajasthan.png',
    caption: 'The colors of Jaipur were absolutely breathtaking — the Pink City lived up to every expectation! Hawa Mahal at golden hour is unmissable. 🌅',
    likes: 142,
    comments: 28,
    tags: ['Rajasthan', 'India', 'Heritage'],
    liked: false,
    saved: false,
  },
  {
    id: 2,
    user: { name: 'Arjun Mehta', avatar: '👨‍💻', location: 'Bangalore, India' },
    trip: 'Kerala Backwaters',
    image: '/images/kerala.png',
    caption: 'A slow boat cruise through the backwaters of Alleppey. Time just stops here. If you haven\'t tried a houseboat stay, you\'re missing out! 🛶',
    likes: 98,
    comments: 15,
    tags: ['Kerala', 'Backwaters', 'Nature'],
    liked: true,
    saved: false,
  },
  {
    id: 3,
    user: { name: 'Sneha Patel', avatar: '👩‍🎨', location: 'Delhi, India' },
    trip: 'Goa Beach Escape',
    image: '/images/goa.png',
    caption: 'Goa in May? Surprisingly perfect. The beaches were quieter, sunsets more golden. Found a little shack that served the best fish curry 🐟🌴',
    likes: 211,
    comments: 43,
    tags: ['Goa', 'Beach', 'Sunsets'],
    liked: false,
    saved: true,
  },
  {
    id: 4,
    user: { name: 'Rahul Verma', avatar: '🧗', location: 'Pune, India' },
    trip: 'Ladakh Expedition',
    image: '/images/ladakh.png',
    caption: 'Pangong Lake at 4,350m — worth every bit of altitude sickness 😅. The sheer silence and the mirror-like water is something you carry home forever.',
    likes: 389,
    comments: 67,
    tags: ['Ladakh', 'Mountains', 'Adventure'],
    liked: false,
    saved: false,
  },
]

const FILTER_TABS = ['All', 'Trending', 'Following', 'Saved']

export default function CommunityPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [posts, setPosts] = useState(MOCK_POSTS)

  const toggleLike = (id: number) => {
    setPosts(p => p.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const toggleSave = (id: number) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, saved: !post.saved } : post))
  }

  const filtered = posts.filter(p =>
    !query || p.caption.toLowerCase().includes(query.toLowerCase()) ||
    p.trip.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search trips, places, tags..."
            value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-sm" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <LayoutGrid className="w-4 h-4" /><span>Group by</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <SlidersHorizontal className="w-4 h-4" /><span>Filter</span>
          </button>
          <div className="relative flex-1 sm:flex-none">
            <button onClick={() => setShowSortMenu(!showSortMenu)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <ArrowUpDown className="w-4 h-4" /><span>Sort by</span>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl z-20 overflow-hidden">
                {['Most Recent', 'Most Liked', 'Most Commented'].map(opt => (
                  <button key={opt} onClick={() => setShowSortMenu(false)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Community</h1>
          <p className="text-sm text-gray-400 mt-0.5">Travel stories from fellow explorers</p>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 rounded-xl text-navy-900 font-bold text-sm shadow-lg shadow-amber-500/20 cursor-pointer hover:bg-amber-400 transition-colors">
          <Sparkles className="w-4 h-4" /> Share your trip
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-0 -mb-4">
        {FILTER_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all -mb-px
              ${activeTab === tab ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-400 hover:text-navy-900'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 pt-2">
        {filtered.map(post => (
          <motion.div key={post.id} variants={staggerItem}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Post Image */}
              <div className="h-56 bg-gradient-to-br from-amber-100 to-orange-200 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.trip}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-bold text-lg drop-shadow">{post.trip}</span>
                </div>
                <button onClick={() => toggleSave(post.id)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors">
                  <Bookmark className={`w-4 h-4 ${post.saved ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                </button>
              </div>

              {/* Post Body */}
              <div className="p-5">
                {/* User Row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-xl border-2 border-amber-400">
                    {post.user.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{post.user.name}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />{post.user.location}
                    </p>
                  </div>
                </div>

                {/* Caption */}
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.caption}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className={post.liked ? 'text-red-500 font-semibold' : ''}>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors">
                    <MessageCircle className="w-4 h-4" />{post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-500 transition-colors ml-auto">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 rounded-2xl bg-white border border-dashed border-gray-200">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-semibold text-navy-900 mb-1">No posts found</h3>
            <p className="text-sm text-gray-400">Try a different search term or explore all posts.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
