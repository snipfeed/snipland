const creatorLinkFragment = `
fragment twitterEmbedBlockFragment on TwitterEmbedBlock {
  id
  tweetUrls
}

fragment mailingListBlockFragment on MailingListBlock {
  __typename
  id
  title
  description
  buttonText
  style
  requireName
}

fragment productBlockFragment on ProductBlock {
  __typename
  id
  url
  productBlockTitle: title
  price {
    amount
    currencyCode
  }
  imageUrls
  description
  cardStyle
  images {
    path
  }
}

fragment bundleLinkCardFragment on BundleLinkCard {
  __typename
  id
  title
  description
  bundleImageUrl: imageUrl
  price {
    currencyCode
    amount
  }
  saleDiscount {
    price {
      amount
      currencyCode
    }
  }
  image {
    path
  }
}

fragment shoutoutLinkCardFragment on ShoutoutLinkCard {
  __typename
  id
  title
  imageUrl
  description
  price {
    currencyCode
    amount
  }
  saleDiscount {
    price {
      amount
      currencyCode
    }
  }
  image {
    path
  }
}

fragment liveStreamLinkCardFragment on LiveStreamLinkCard {
  __typename
  id
  title
  imageUrl
  description
  price {
    currencyCode
    amount
  }
  saleDiscount {
    price {
      amount
      currencyCode
    }
  }
  startAt
  platform
  image {
    path
  }
}

fragment consultationLinkCardFragment on ConsultationLinkCard {
  __typename
  id
  title
  imageUrl
  description
  duration
  price {
    currencyCode
    amount
  }
  saleDiscount {
    price {
      amount
      currencyCode
    }
  }
  consultationPlatform: platform
  consultationDuration: duration

  image {
    path
  }
}

fragment creatorLinkFragment on CreatorLink {
  id
  username
  creatorId
  isDisabled
  isUpgraded
  isVip
  owner {
    isVerified
  }
  blocks {
    __typename
    ... on LinkBlock {
      id
      isVisible
    }
    ... on CustomBlock {
      __typename
      id
      url
      title
      imageUrl
      image {
        path
      }
      description
      isVisible
      isAnimated
      animationType
      customBlockCardStyle: cardStyle
    }
    ... on TipBlock {
      __typename
      id
      isVisible
      theme
      isAnimated
      icon
      animationType
      tipBlockCardStyle: cardStyle
      tipBlockButtonText: buttonText
      goal {
        title
        description
        imageUrl
        createdAt
        transactionsCount
        accumulatedAmount {
          amount
          currencyCode
        }
        target {
          amount
          currencyCode
        }
        image {
          path
        }
      }
      priceOptions {
        style
        options {
          amount
          currencyCode
          emoji
        }
      }
      showTipingFeed
    }
    ... on SocialIconsBlock {
      __typename
      id
      isVisible
      links {
        id
        url
        platform
      }
    }
    ... on PremiumBlock {
      id
      service
      title
      imageUrl
      description
      isVisible
      premiumBlockCardStyle: cardStyle
      card {
        ...shoutoutLinkCardFragment
        ...bundleLinkCardFragment
        ...liveStreamLinkCardFragment
        ...consultationLinkCardFragment
      }
    }
    ... on CarouselBlock {
      id
      title
      carouselService: service
      isVisible
      cards {
        ...shoutoutLinkCardFragment
        ...bundleLinkCardFragment
        ...liveStreamLinkCardFragment
        ...productBlockFragment
        ...consultationLinkCardFragment
      }
    }
    ... on VideoPreviewBlock {
      id
      url
      isVisible
      videoPlatform: platform
    }
    ... on MusicPreviewBlock {
      id
      url
      musicPlatform: platform
      isVisible
      playerSize
    }
    ... on TextBlock {
      content
    }
    ...mailingListBlockFragment
    ...productBlockFragment
    ...twitterEmbedBlockFragment
  }
  blockStyles {
    buttonType
    buttonShape
    transparency
  }
  colors {
    text
    buttonText
    buttonBackground
    tipButtonText
    tipButtonBackground
  }
  fonts {
    text
  }
  backgroundStyles {
    __typename
    ... on LinkPhotoBackground {
      imageUrl
      image {
        path
      }
      transparency
    }
    ... on LinkCoverBackground {
      color
      image {
        path
      }
      imageUrl
      transparency
    }
    ... on LinkGradientBackground {
      color
    }
    ... on LinkSolidBackground {
      color
    }
  }
  profile {
    avatar {
      path
      url
    }
    name
    avatarUrl
    description
  }
  mainCustomDomainName {
    domainName
  }
}
`
const creatorLinkByUsernameQuery = `
${creatorLinkFragment}
query creatorLinkByUsername($username: String!) {
  creatorLinkByUsername(username: $username) {
    ...creatorLinkFragment
  }
}
`

const creatorLinkByIdQuery = `
${creatorLinkFragment}
query creatorLinkById($id: ID!) {
  node(id: $id) {
    ... on CreatorLink {
      ...creatorLinkFragment
    }
  }
}
`

const graphqlRequest = async ({
  query,
  variables,
}: {
  query: string
  variables: any
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
  })

  return response.json()
}

export async function getCreatorLinkByUsername(username: string) {
  const { data } = await graphqlRequest({
    query: creatorLinkByUsernameQuery,
    variables: { username },
  })

  return data?.creatorLinkByUsername
}

export async function getCreatorLinkById(id: string) {
  const { data } = await graphqlRequest({
    query: creatorLinkByIdQuery,
    variables: { id },
  })

  return data?.node
}
