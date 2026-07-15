import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqxuqcgazgdpirzxrwxx.supabase.co';
const supabaseKey = 'sb_publishable_pv0UvBMrQjH4Vn-CCATt2g_CiAV_jem';

export const supabase = createClient(supabaseUrl, supabaseKey);