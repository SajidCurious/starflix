// Supabase Configuration for Starflix
// Frontend-compatible database service

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace with your actual Supabase project credentials
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Instructions:
// 1. Go to https://supabase.com
// 2. Create a free account and new project
// 3. Go to Settings -> API
// 4. Copy your Project URL and anon public key
// 5. Replace the values above with your actual credentials






