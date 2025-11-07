import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const fgoFuturesLink = new HttpLink({
  uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/En2vb9DWdZ7Qpw1e111Rb3jGR2oWEDN2dB2YnPuhw21h`,
});

export const graphFGOFuturesClient = new ApolloClient({
  link: fgoFuturesLink,
  cache: new InMemoryCache(),
});


const fgoLink = new HttpLink({
  uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/4jujS6j8wMahNTSzN2T8wN7iTiEfNRQfoYYQL7Q1Bn9X`,
});

export const graphFGOClient = new ApolloClient({
  link: fgoLink,
  cache: new InMemoryCache(),
});


