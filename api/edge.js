// This is a Vercel Serverless Function that returns proxy-related info
export default function logClientInfo(req, res) {
  const ip = req.headers['x-forwarded-for']
  const host = req.headers['host']
  res.status(200).json({ ip, host })
}