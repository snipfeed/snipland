import { NextApiRequest } from 'next';

export const config = {
  runtime: 'experimental-edge',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (_req: NextApiRequest) {
  return new Response(JSON.stringify({ name: 'John Doe' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
