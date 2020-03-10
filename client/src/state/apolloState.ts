import {ApolloClient} from 'apollo-client';
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {apiEndpoint} from '../clientConfig';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: `${apiEndpoint}`,
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});
