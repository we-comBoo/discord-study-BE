const { createClient } = require("@supabase/supabase-js");


// "YOUR_SUPABASE_URL", "YOUR_SUPABASE_API_KEY"
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

module.exports = supabase