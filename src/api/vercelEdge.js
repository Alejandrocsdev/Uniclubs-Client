export const config = { runtime: 'edge' }

export default req => {
  const forwarded = req.headers.get('x-forwarded-for')
  const ua = req.headers.get('user-agent')
  return new Response(JSON.stringify({ forwarded, ua }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
