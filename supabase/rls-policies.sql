-- Step 1: Drop any broken/partial policies first
DROP POLICY IF EXISTS "Users can view activities" ON activities;
DROP POLICY IF EXISTS "Users can create activities" ON activities;
DROP POLICY IF EXISTS "Users can update activities" ON activities;
DROP POLICY IF EXISTS "Users can delete activities" ON activities;

-- Step 2: Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_notes ENABLE ROW LEVEL SECURITY;

-- Step 3: Profiles policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Step 4: Trips policies
CREATE POLICY "trips_select" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update" ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trips_delete" ON trips FOR DELETE USING (auth.uid() = user_id);

-- Step 5: Stops policies
CREATE POLICY "stops_select" ON stops FOR SELECT
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "stops_insert" ON stops FOR INSERT
  WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "stops_update" ON stops FOR UPDATE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "stops_delete" ON stops FOR DELETE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

-- Step 6: Activities policies
CREATE POLICY "activities_select" ON activities FOR SELECT
  USING (
    stop_id IN (
      SELECT s.id FROM stops s
      INNER JOIN trips t ON s.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );
CREATE POLICY "activities_insert" ON activities FOR INSERT
  WITH CHECK (
    stop_id IN (
      SELECT s.id FROM stops s
      INNER JOIN trips t ON s.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );
CREATE POLICY "activities_update" ON activities FOR UPDATE
  USING (
    stop_id IN (
      SELECT s.id FROM stops s
      INNER JOIN trips t ON s.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );
CREATE POLICY "activities_delete" ON activities FOR DELETE
  USING (
    stop_id IN (
      SELECT s.id FROM stops s
      INNER JOIN trips t ON s.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Step 7: Budget items policies
CREATE POLICY "budget_select" ON budget_items FOR SELECT
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "budget_insert" ON budget_items FOR INSERT
  WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "budget_update" ON budget_items FOR UPDATE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "budget_delete" ON budget_items FOR DELETE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

-- Step 8: Packing items policies
CREATE POLICY "packing_select" ON packing_items FOR SELECT
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "packing_insert" ON packing_items FOR INSERT
  WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "packing_update" ON packing_items FOR UPDATE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "packing_delete" ON packing_items FOR DELETE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

-- Step 9: Trip notes policies
CREATE POLICY "notes_select" ON trip_notes FOR SELECT
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "notes_insert" ON trip_notes FOR INSERT
  WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "notes_update" ON trip_notes FOR UPDATE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "notes_delete" ON trip_notes FOR DELETE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

-- Step 10: Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 11: Backfill existing users into profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
