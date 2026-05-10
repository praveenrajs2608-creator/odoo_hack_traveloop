const ONE_SIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID!
const ONE_SIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY!

export const sendPushNotification = async (
  playerId: string,
  heading: string,
  content: string,
  url?: string
) => {
  const response = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: ONE_SIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: heading },
      contents: { en: content },
      ...(url && { url }),
    }),
  })
  return response.json()
}

export const sendTripReminder = async (
  playerId: string,
  tripName: string,
  daysLeft: number
) => {
  return sendPushNotification(
    playerId,
    '✈️ Your trip is coming up!',
    `${tripName} starts in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Are you packed?`,
    `${process.env.NEXT_PUBLIC_APP_URL}/trips`
  )
}

export const sendCollaborationNotification = async (
  playerId: string,
  editorName: string,
  tripName: string
) => {
  return sendPushNotification(
    playerId,
    '📝 Trip Updated',
    `${editorName} made changes to "${tripName}".`,
    `${process.env.NEXT_PUBLIC_APP_URL}/trips`
  )
}
