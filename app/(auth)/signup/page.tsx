import { SignupForm } from '@/components/auth/SignupForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Traveloop',
  description: 'Create your Traveloop account and start planning AI-powered trips.',
}

export default function SignupPage() {
  return <SignupForm />
}
