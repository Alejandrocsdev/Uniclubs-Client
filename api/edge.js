// This is a Vercel Serverless Function that returns proxy-related info
module.exports = (req, res) => {
  const forwarded = req.headers['x-forwarded-for']
  const ua = req.headers['user-agent']
  res.status(200).json({ forwarded, ua })
}