import { GetStaticPropsContext } from 'next';
import { cloudflareLoader } from '../../../lib/cloudflareImageLoader';
import { getCreatorLinkByUsername } from '../../../lib/creatorLinkApi';
import Image from 'next/image'

interface LinkPageProps {
  creatorLink: any;
}

function LinkPage({ creatorLink }: LinkPageProps) {
  return (
    <>
    <Image
      loader={cloudflareLoader}
      src={creatorLink.profile?.avatar?.url}
      alt="Picture of the creator"
      width={100}
      height={100}
    />
        <p>@{creatorLink?.username}</p>
        <h2>{creatorLink?.profile?.name}</h2>
        <h3>{creatorLink?.profile?.description}</h3>
        <pre>{JSON.stringify(creatorLink, null, 2)}</pre>
        <p>site site site</p>
    </>
  );
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const creatorLink = await getCreatorLinkByUsername(
    'adil89'
  );

  if (!creatorLink) {
    // be sure that the server return a 404 status if creator not found
    return {
      notFound: true,
    };
  }

  return {
    props: {
      creatorLink,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export default LinkPage;
