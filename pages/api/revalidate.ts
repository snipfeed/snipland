// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const path = req.query.path as string;
    await res.revalidate(path);
    return res.status(200).json({ revalidated: path });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
