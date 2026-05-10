import { LoginForm } from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Traveloop',
  description: 'Sign in to your Traveloop account and start planning trips.',
}

export default function LoginPage() {
  return <LoginForm />
}
