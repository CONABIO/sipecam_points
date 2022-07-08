import gql from 'graphql-tag';

/**
 * Visitas
 */
export const getVisits = gql`
  query visits($search: searchVisitInput, $order: [orderVisitInput], $pagination: paginationInput!) {
    visits(search: $search, order: $order, pagination: $pagination) {
      cumulus_visit {
        id
        name
        con_socio
        ecosystem_id
      }
      date_first_season
      date_second_season
      report_first_season
      report_second_season
    }
  }
`;

/**
 * Dispositivos
 */
export const getDevices = gql`
  query physical_devices(
    $search: searchPhysical_deviceInput
    $order: [orderPhysical_deviceInput]
    $pagination: paginationInput!
  ) {
    physical_devices(search: $search, order: $order, pagination: $pagination) {
      device {
        type
      }
      status
    }
  }
`;

/**
 *
 * Pequeños mamiferos
 */
export const getIndividuals = gql`
  query individuals($search: searchIndividualInput, $order: [orderIndividualInput], $pagination: paginationInput!) {
    individuals(search: $search, order: $order, pagination: $pagination) {
      associated_cumulus {
        id
        name
      }
    }
  }
`;

/**
 * Dispositivos desplegados
 */
export const getDeployments = gql`
  query deployments($search: searchDeploymentInput, $order: [orderDeploymentInput], $pagination: paginationInput!) {
    deployments(search: $search, order: $order, pagination: $pagination) {
      cumulus {
        id
        name
      }
      device {
        device {
          type
        }
      }
    }
  }
`;

/**
 * Visitas
 */
export const getTransects = gql`
  query transects($search: searchTransectInput, $order: [orderTransectInput], $pagination: paginationInput!) {
    transects(search: $search, order: $order, pagination: $pagination) {
      associated_node {
        id
        nomenclatura
      }
    }
  }
`;
