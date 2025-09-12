#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  console.log('You can get these from your Supabase project dashboard')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createUser(email, password, userType, fullName, companyName = null) {
  try {
    console.log(`Creating user "${fullName}"...`)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          full_name: fullName,
          company_name: companyName || fullName
        }
      }
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      return null
    }

    if (data.user) {
      console.log('✅ User created successfully!')
      console.log('📧 Email:', data.user.email)
      console.log('🆔 User ID:', data.user.id)
      console.log('👤 User Type:', data.user.user_metadata?.user_type)
      
      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          company_name: companyName || fullName,
          user_type: userType,
          created_at: new Date().toISOString()
        })

      if (profileError) {
        console.log('⚠️  User created but profile insertion failed:', profileError.message)
        console.log('You may need to create the profiles table first')
      } else {
        console.log('✅ Profile created successfully!')
      }
      
      return data.user
    } else {
      console.log('❌ No user data returned')
      return null
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return null
  }
}

// Create the "marca" user
async function main() {
  console.log('🚀 Creating user "marca"...\n')
  
  const user = await createUser(
    'marca@tutuca.co',     // email
    'marca123',            // password
    'brand',               // user type
    'Marca',               // full name
    'Marca'                // company name
  )
  
  if (user) {
    console.log('\n🎉 User "marca" created successfully!')
    console.log('You can now login with:')
    console.log('📧 Email: marca@tutuca.co')
    console.log('🔑 Password: marca123')
  } else {
    console.log('\n❌ Failed to create user')
  }
}

main()
