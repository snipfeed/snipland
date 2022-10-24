import { GetStaticPropsContext } from 'next';
import { getCreatorLinkByUsername } from '../../lib/creatorLinkApi';

interface LinkPageProps {
  creatorLink: any;
}

function LinkPage({ creatorLink }: LinkPageProps) {
  return (
    <>
        <h1>{creatorLink.username}</h1>
        <h2>{creatorLink.profile.name}</h2>
        <h3>{creatorLink.profile.description}</h3>
        <pre>{JSON.stringify(creatorLink, null, 2)}</pre>
    </>
  );
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const creatorLink = await getCreatorLinkByUsername(
    params!.username as string
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
