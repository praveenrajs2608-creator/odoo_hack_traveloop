import { Resend } from 'resend'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://traveloop.vercel.app'

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(apiKey)
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const resend = getResendClient()
  await resend.emails.send({
    from: 'Traveloop <hello@traveloop.app>',
    to: email,
    subject: '✈️ Welcome to Traveloop — Your AI Travel Planner',
    html: `
      <div style="font-family: 'Inter', 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 0;">
        <div style="background: linear-gradient(135deg, #0F1B2D 0%, #1A2D44 100%); padding: 48px 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #F5A623; font-size: 32px; margin: 0; letter-spacing: -0.5px;">🧳 Traveloop</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 8px;">AI-Powered Travel Planning</p>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #0F1B2D; font-size: 24px; margin-top: 0;">Hey ${name}! Welcome aboard 🎉</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            You're all set to plan your dream trips with AI. Start by creating your first itinerary — 
            just describe your trip in plain language and we'll handle the rest.
          </p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="${APP_URL}/trips/new"
               style="background: #F5A623; color: #0F1B2D; padding: 14px 32px; border-radius: 10px; 
                      font-weight: 700; text-decoration: none; display: inline-block; font-size: 16px;">
              Plan My First Trip →
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 32px; text-align: center;">
            Questions? Just reply to this email. Happy travels! ✈️
          </p>
        </div>
      </div>
    `,
  })
}

export const sendTripShareEmail = async (
  toEmail: string,
  senderName: string,
  tripName: string,
  shareUrl: string
) => {
  const resend = getResendClient()
  await resend.emails.send({
    from: 'Traveloop <hello@traveloop.app>',
    to: toEmail,
    subject: `✈️ ${senderName} shared a trip with you: ${tripName}`,
    html: `
      <div style="font-family: 'Inter', 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0F1B2D 0%, #1A2D44 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #F5A623; font-size: 28px; margin: 0;">🧳 Traveloop</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #0F1B2D; margin-top: 0;">Someone shared a trip with you!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            <strong>${senderName}</strong> wants you to check out their trip: <strong>${tripName}</strong>
          </p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${shareUrl}"
               style="background: #F5A623; color: #0F1B2D; padding: 14px 32px; border-radius: 10px; 
                      font-weight: 700; text-decoration: none; display: inline-block; font-size: 16px;">
              View Itinerary →
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

export const sendTripReminderEmail = async (
  email: string,
  name: string,
  tripName: string,
  daysLeft: number
) => {
  const resend = getResendClient()
  await resend.emails.send({
    from: 'Traveloop <hello@traveloop.app>',
    to: email,
    subject: `⏰ ${tripName} starts in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`,
    html: `
      <div style="font-family: 'Inter', 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0F1B2D 0%, #1A2D44 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #F5A623; font-size: 28px; margin: 0;">🧳 Traveloop</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #0F1B2D; margin-top: 0;">Hey ${name}, your trip is coming up! 🎒</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            <strong>${tripName}</strong> starts in <strong>${daysLeft} day${daysLeft > 1 ? 's' : ''}</strong>. 
            Have you checked your packing list?
          </p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${APP_URL}/trips"
               style="background: #F5A623; color: #0F1B2D; padding: 14px 32px; border-radius: 10px; 
                      font-weight: 700; text-decoration: none; display: inline-block; font-size: 16px;">
              Check My Trip →
            </a>
          </div>
        </div>
      </div>
    `,
  })
}
