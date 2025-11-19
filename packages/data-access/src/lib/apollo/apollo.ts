// packages/data-access/src/lib/apollo.ts

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT

if (!GRAPHQL_ENDPOINT) {
  throw new Error('GraphQL Endpoint is not set!')
}

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'no-cache' },
    query: { fetchPolicy: 'no-cache' },
  },
})

export { apolloClient }
