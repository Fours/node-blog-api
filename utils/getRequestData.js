export default async function getRequestData(req) {

  let body = ''
  for await (const chunk of req) {
    body += chunk
  }

  try {
    return JSON.parse(body)
  } catch (err) {
    return {}
  }
}