import request from 'superagent'

const rootUrl = '/api/detection'

export async function getMembers() {
  return request.get(`${rootUrl}/members`).then((res) => res.body.members)
}
