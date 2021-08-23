import gql from 'graphql-tag';

export const getCumulus = gql`
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

export const ecosystems = gql`
  query ecosystems($search: searchEcosystemInput, $order: [orderEcosystemInput], $pagination: paginationInput!) {
    ecosystems(search: $search, order: $order, pagination: $pagination) {
      id
      name
    }
  }
`;

export const nodes = gql`
  query nodes($search: searchNodeInput, $order: [orderNodeInput], $pagination: paginationInput!) {
    nodes(search: $search, order: $order, pagination: $pagination) {
      id
      nomenclatura
      has_partner
      fid
      location
      cat_integr
      integrity
      cumulus_id
      ecosystem_id
      created_at
    }
  }
`;
