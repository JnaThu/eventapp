'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        role,
      },
    },
  })

  if (error) return { error: error.message }

  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
