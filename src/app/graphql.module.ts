import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const uri = 'https://sipecamdata.conabio.gob.mx/graphql/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only', //'cache-and-network'
    },
    query: {
      fetchPolicy: 'network-only',
    },
  };

  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache({
      addTypename: false,
    }),
    defaultOptions,
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
