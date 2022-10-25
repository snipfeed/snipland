const basePath = '';
const mainDomain = 'pages.snipfeed.us';

const mainDomainWithScheme = `${
  process.env.NODE_ENV === 'production' ? 'https' : 'http'
}://${mainDomain}`;

const assetPrefix = mainDomainWithScheme;

module.exports = {
  basePath,
  mainDomain,
  assetPrefix,
  mainDomainWithScheme,
};
