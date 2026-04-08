'use server'

import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export type AuthState = { error: string } | undefined

export async function signIn(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  redirect('/')
}

export async function signUpAttendee(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  return signUpWithRole(formData, 'attendee')
}

export async function signUpOrganiser(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  return signUpWithRole(formData, 'organiser')
}

async function signUpWithRole(
  formData: FormData,
  role: 'attendee' | 'organiser'
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const full_name = formData.get('full_name') as string

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password: formData.get('password') as string,
    options: {
      data: { full_name, role },
    },
  })

  if (signUpError) return { error: signUpError.message }

  const user = data.user
  if (!user) return { error: 'Sign up succeeded but no user was returned.' }

  const { error: profileError } = await createAdminClient()
    .from('profiles')
    .insert({ id: user.id, full_name, email, role })

  if (profileError) return { error: `Account created but profile setup failed: ${profileError.message}` }

  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
