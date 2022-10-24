const creatorLinkFragment = `
fragment creatorLinkFragment on CreatorLink {
  id
  username
  isDisabled
  profile {
    name
    description
  }
}
`;
const creatorLinkByUsernameQuery = `
${creatorLinkFragment}
query creatorLinkByUsername($username: String!) {
  creatorLinkByUsername(username: $username) {
    ...creatorLinkFragment
  }
}
`;

const graphqlRequest = async ({
  query,
  variables,
}: {
  query: string;
  variables: any;
}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'apollographql-client-name': 'link-platform',
      'apollographql-client-version': '1.0',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return response.json();
};

export async function getCreatorLinkByUsername(username: string) {
  const { data } = await graphqlRequest({
    query: creatorLinkByUsernameQuery,
    variables: { username },
  });

  return data?.creatorLinkByUsername;
}
