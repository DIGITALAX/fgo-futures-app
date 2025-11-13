import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const fgoFuturesLink = new HttpLink({
  uri: "/api/graphql/futures",
});

export const graphFGOFuturesClient = new ApolloClient({
  link: fgoFuturesLink,
  cache: new InMemoryCache(),
});

const fgoLink = new HttpLink({
  uri: "/api/graphql/fgo",
});

export const graphFGOClient = new ApolloClient({
  link: fgoLink,
  cache: new InMemoryCache(),
});
