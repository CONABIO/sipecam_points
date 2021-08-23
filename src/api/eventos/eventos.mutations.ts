import gql from 'graphql-tag';

/**
 * Monitores
 */
export const addMonitor = gql`
  mutation addMonior(
    $first_name: String
    $last_name: String
    $second_last_name: String
    $contact: String
    $addCumulus_monitor: ID
  ) {
    addMonior(
      first_name: $first_name
      last_name: $last_name
      second_last_name: $second_last_name
      contact: $contact
      addCumulus_monitor: $addCumulus_monitor
    ) {
      id
      first_name
      last_name
      second_last_name
      contact
      cumulus_id
    }
  }
`;

export const deleteMonitor = gql`
  mutation deleteMonior($id: ID) {
    addMonior(id: $id)
  }
`;

export const updateMonitor = gql`
  mutation updateMonior(
    $id: ID!,
    $first_name: String,
    $last_name: String,
    $second_last_name: String,
    $contact: String,
    $addCumulus_monitor: ID,
    removeCumulus_monitor: ID
  ) {
    addMonior(id: $id, first_name: $first_name, last_name: $last_name, second_last_name: $second_last_name, contact: $contact, addCumulus_monitor: $addCumulus_monitor, removeCumulus_monitor: $removeCumulus_monitor) {
      id
      first_name
      last_name
      second_last_name
      contact
      cumulus_id
    }
  }
`;

/**
 * Visitas
 */
export const addVisit = gql`
  mutation addVisit($addCalendar: ID, $addUser_visit: ID, $addCumulus_visit: ID, $addUnique_node: ID) {
    addVisit(
      addCalendar: $addCalendar
      addUser_visit: $addUser_visit
      addCumulus_visit: $addCumulus_visit
      addUnique_node: $addUnique_node
    ) {
      id
      user_id
      calendar_id
      cumulus_id
      calendar_id
    }
  }
`;

export const deleteVisit = gql`
  mutation deleteVisit($id: ID) {
    addVisit(id: $id)
  }
`;

export const updateVisit = gql`
  mutation addVisit(
    $id: ID
    $addCalendar: ID
    $removeCalendar: ID
    $addUser_visit: ID
    $removeUser_visit: ID
    $addCumulus_visit: ID
    $removeCumulus_visit: ID
    $addUnique_node: ID
    $removeUnique_node: ID
  ) {
    addVisit(
      id: $id
      addCalendar: $addCalendar
      removeCalendar: $removeCalendar
      addUser_visit: $addUser_visit
      removeUser_visit: $removeUser_visit
      addCumulus_visit: $addCumulus_visit
      removeCumulus_visit: $removeCumulus_visit
      addUnique_node: $addUnique_node
      removeUnique_node: $removeUnique_node
    ) {
      id
      user_id
      calendar_id
      cumulus_id
      calendar_id
    }
  }
`;
