import { getCreatorLinkByUsername } from '../../lib/creatorLinkApi';
import { GetServerSidePropsContext } from 'next'

interface LinkPageProps {
  creatorLink: any;
}

function LinkPage({ creatorLink }: LinkPageProps) {
  return (
    <>
        <p>@{creatorLink?.username}</p>
        <h2>{creatorLink?.profile?.name}</h2>
        <h3>{creatorLink?.profile?.description}</h3>
        <pre>{JSON.stringify(creatorLink, null, 2)}</pre>
    </>
  );
}

export async function getServerSideProps({ params }: GetServerSidePropsContext)  {
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



export default LinkPage;
