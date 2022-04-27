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
      }
      date_first_season
      date_second_season
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
