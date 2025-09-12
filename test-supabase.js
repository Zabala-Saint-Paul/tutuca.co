const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase connection...')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Missing Supabase credentials!')
  console.log('Please add these to your .env.local file:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🔗 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      
      if (error.message.includes('relation "profiles" does not exist')) {
        console.log('\n💡 Solution: You need to run the database schema!')
        console.log('1. Go to your Supabase dashboard')
        console.log('2. Open SQL Editor')
        console.log('3. Copy and run the contents of supabase-schema.sql')
      }
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    
    // Test campaigns table
    console.log('\n📊 Testing campaigns table...')
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('count')
      .limit(1)
    
    if (campaignsError) {
      console.log('❌ Campaigns table error:', campaignsError.message)
      return false
    }
    
    console.log('✅ Campaigns table accessible!')
    console.log('\n🎉 Everything is ready! You can now create campaigns!')
    
    return true
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
    return false
  }
}

testConnection()
