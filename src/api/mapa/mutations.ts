import gql from 'graphql-tag';

export const cumulus = gql`
  query cumulus($search: searchCumulusInput, $order: [orderCumulusInput], $pagination: paginationInput!) {
    cumulus(search: $search, order: $order, pagination: $pagination) {
      id
      name
      geometry
      criteria_id
      user_ids
    }
  }
`;
