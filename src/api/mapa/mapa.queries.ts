import gql from 'graphql-tag';

/**
 * Cúmulos
 */
export const getCumulus = gql`
  query cumulus($search: searchCumulusInput, $order: [orderCumulusInput], $pagination: paginationInput!) {
    cumulus(search: $search, order: $order, pagination: $pagination) {
      id
      name
      geometry
      criteria_id
      user_ids
      ecosystem_id
    }
  }
`;

export const getOneCumulus = gql`
  query readOneCumulus($id: ID!) {
    readOneCumulus(id: $id) {
      id
      name
      geometry
      criteria_id
      user_ids
      ecosystem_id
    }
  }
`;

/**
 * Ecosistemas
 */
export const getEcosystems = gql`
  query ecosystems($search: searchEcosystemInput, $order: [orderEcosystemInput], $pagination: paginationInput!) {
    ecosystems(search: $search, order: $order, pagination: $pagination) {
      id
      name
    }
  }
`;

/**
 * Nodos
 */
export const getNodes = gql`
  query nodes($search: searchNodeInput, $order: [orderNodeInput], $pagination: paginationInput!) {
    nodes(search: $search, order: $order, pagination: $pagination) {
      id
      nomenclatura
      has_partner
      location
      cat_integr
      integrity
      cumulus_id
      ecosystem_id
    }
  }
`;

export const getOneNode = gql`
  query readOneNode($id: ID!) {
    readOneNode(id: $id) {
      id
      nomenclatura
      has_partner
      location
      cat_integr
      integrity
      cumulus_id
      ecosystem_id
    }
  }
`;
