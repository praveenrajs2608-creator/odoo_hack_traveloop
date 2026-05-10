-- ============================================================
-- Where2Go Feature: Cities table schema additions + seed data
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add new columns (safe — IF NOT EXISTS)
ALTER TABLE cities ADD COLUMN IF NOT EXISTS budget_level TEXT 
  CHECK (budget_level IN ('budget','moderate','premium','luxury'));
ALTER TABLE cities ADD COLUMN IF NOT EXISTS best_season TEXT[] DEFAULT '{}';
ALTER TABLE cities ADD COLUMN IF NOT EXISTS group_suitability TEXT[] DEFAULT '{}';
ALTER TABLE cities ADD COLUMN IF NOT EXISTS estimated_cost_inr TEXT;

-- 2. Seed 12 destinations
-- (Uses upsert logic via ON CONFLICT — requires a unique constraint on name+country.
--  If that doesn't exist we just INSERT and skip dupes.)

INSERT INTO cities (name, country, region, latitude, longitude, cost_index, popularity_score, image_url, tags, budget_level, best_season, group_suitability, estimated_cost_inr)
VALUES
  (
    'Bali', 'Indonesia', 'Southeast Asia',
    -8.4095, 115.1889, 4, 92,
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    ARRAY['beach','nature','culture','adventure'],
    'moderate',
    ARRAY['summer','winter','spring'],
    ARRAY['solo','couple','friends'],
    '45,000'
  ),
  (
    'Manali', 'India', 'South Asia',
    32.2396, 77.1887, 3, 88,
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    ARRAY['mountains','adventure','nature'],
    'budget',
    ARRAY['summer','winter','spring'],
    ARRAY['solo','couple','friends','family'],
    '12,000'
  ),
  (
    'Paris', 'France', 'Europe',
    48.8566, 2.3522, 8, 96,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    ARRAY['city','heritage','culture'],
    'premium',
    ARRAY['spring','summer','winter'],
    ARRAY['couple','solo','friends'],
    '1,20,000'
  ),
  (
    'Maldives', 'Maldives', 'South Asia',
    3.2028, 73.2207, 9, 90,
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    ARRAY['beach','nature'],
    'luxury',
    ARRAY['winter','spring'],
    ARRAY['couple'],
    '2,50,000'
  ),
  (
    'Jaipur', 'India', 'South Asia',
    26.9124, 75.7873, 3, 85,
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
    ARRAY['heritage','culture','city'],
    'budget',
    ARRAY['winter','spring'],
    ARRAY['solo','couple','friends','family'],
    '10,000'
  ),
  (
    'Tokyo', 'Japan', 'East Asia',
    35.6762, 139.6503, 7, 94,
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    ARRAY['city','culture','adventure'],
    'premium',
    ARRAY['spring','winter'],
    ARRAY['solo','couple','friends'],
    '1,00,000'
  ),
  (
    'Munnar', 'India', 'South Asia',
    10.0889, 77.0595, 3, 80,
    'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80',
    ARRAY['nature','mountains'],
    'budget',
    ARRAY['monsoon','winter','spring'],
    ARRAY['couple','family','friends'],
    '8,000'
  ),
  (
    'Santorini', 'Greece', 'Europe',
    36.3932, 25.4615, 8, 91,
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    ARRAY['beach','heritage','city'],
    'luxury',
    ARRAY['summer','spring'],
    ARRAY['couple','friends'],
    '2,00,000'
  ),
  (
    'Rishikesh', 'India', 'South Asia',
    30.0869, 78.2676, 2, 82,
    'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&q=80',
    ARRAY['adventure','nature','mountains'],
    'budget',
    ARRAY['winter','spring','monsoon'],
    ARRAY['solo','friends'],
    '6,000'
  ),
  (
    'Singapore', 'Singapore', 'Southeast Asia',
    1.3521, 103.8198, 7, 89,
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
    ARRAY['city','culture','adventure'],
    'moderate',
    ARRAY['summer','winter','spring'],
    ARRAY['solo','couple','friends','family'],
    '55,000'
  ),
  (
    'Spiti Valley', 'India', 'South Asia',
    32.2464, 78.0349, 3, 78,
    'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=800&q=80',
    ARRAY['mountains','adventure','nature'],
    'budget',
    ARRAY['summer'],
    ARRAY['solo','friends'],
    '15,000'
  ),
  (
    'Dubai', 'UAE', 'Middle East',
    25.2048, 55.2708, 8, 93,
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    ARRAY['city','beach','adventure'],
    'premium',
    ARRAY['winter','spring'],
    ARRAY['couple','friends','family'],
    '90,000'
  )
ON CONFLICT DO NOTHING;
