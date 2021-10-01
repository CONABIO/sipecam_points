import gql from 'graphql-tag';

// https://gqlauth.sipecamdata.conabio.gob.mx/
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
      con_socio
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
      con_socio
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
      con_socio
      location
      cat_integr
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
      con_socio
      location
      cat_integr
      cumulus_id
      ecosystem_id
    }
  }
`;
