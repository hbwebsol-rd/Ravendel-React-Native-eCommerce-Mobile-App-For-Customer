import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  from,
} from '@apollo/client';
import { getToken, isEmpty } from './utils/helper';
import { BASEURL } from './utils/config';

const httpLink = createHttpLink({
  uri: `${BASEURL}graphql`,
});
const authMiddleware = new ApolloLink(async (operation, forward) => {
  const token = await getToken();
  // console.log(token)
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: !isEmpty(token) ? token : '',
    },
  }));
  return forward(operation);
});
const APclient = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});
export default APclient;
