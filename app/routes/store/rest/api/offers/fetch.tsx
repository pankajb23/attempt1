import type { LoaderFunctionArgs } from '@remix-run/node';
import { prismaClient, authenticate } from 'app/shopify.server';
import { json } from '@remix-run/node';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  console.log('Reached here');
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams);
  console.log('Query params:', queryParams);

  const storeId = url.searchParams.get('storeId');
  const allOffers = await prismaClient.offer.findMany({
    where: {
      storeId: storeId,
    },
  });

  console.log('All offers fetched ---> ', allOffers);
  return json({
    status: 200,
    data: { message: 'Offers fetched successfully!', offers: allOffers },
  });
};
