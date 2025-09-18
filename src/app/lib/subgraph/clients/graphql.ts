import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const fgoFuturesLink = new HttpLink({
  uri: `https://api.studio.thegraph.com/query/109132/fgo-futures/version/latest`,
});

export const graphFGOFuturesClient = new ApolloClient({
  link: fgoFuturesLink,
  cache: new InMemoryCache(),
});


const fgoLink = new HttpLink({
  uri: `https://api.studio.thegraph.com/query/109132/fractional-garment-ownership/version/latest`,
});

export const graphFGOClient = new ApolloClient({
  link: fgoLink,
  cache: new InMemoryCache(),
});


