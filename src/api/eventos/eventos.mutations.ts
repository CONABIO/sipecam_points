import gql from 'graphql-tag';

/**
 * Monitores
 */
export const addMonitor = gql`
  mutation addMonitor(
    $first_name: String
    $last_name: String
    $second_last_name: String
    $contact: String
    $addCumulus_monitor: ID
  ) {
    addMonitor(
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
  mutation deleteMonitor($id: ID!) {
    deleteMonitor(id: $id)
  }
`;

export const updateMonitor = gql`
  mutation updateMonitor(
    $id: ID!
    $first_name: String
    $last_name: String
    $second_last_name: String
    $contact: String
    $addCumulus_monitor: ID
    $removeCumulus_monitor: ID
  ) {
    updateMonitor(
      id: $id
      first_name: $first_name
      last_name: $last_name
      second_last_name: $second_last_name
      contact: $contact
      addCumulus_monitor: $addCumulus_monitor
      removeCumulus_monitor: $removeCumulus_monitor
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

/**
 * Visitas
 */
export const addVisit = gql`
  mutation addVisit(
    $addCalendar: ID
    $addUser_visit: ID
    $addCumulus_visit: ID
    $addUnique_node_pristine: ID
    $addUnique_node_disturbed: ID
  ) {
    addVisit(
      addCalendar: $addCalendar
      addUser_visit: $addUser_visit
      addCumulus_visit: $addCumulus_visit
      addUnique_node_pristine: $addUnique_node_pristine
      addUnique_node_disturbed: $addUnique_node_disturbed
    ) {
      id
      user_id
      calendar_id
      cumulus_id
      calendar_id
      pristine_id
      disturbed_id
    }
  }
`;

export const deleteVisit = gql`
  mutation deleteVisit($id: ID!) {
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
    $addUnique_node_pristine: ID
    $removeUnique_node_pristine: ID
    $addUnique_node_disturbed: ID
    $removeUnique_node_disturbed: ID
  ) {
    addVisit(
      id: $id
      addCalendar: $addCalendar
      removeCalendar: $removeCalendar
      addUser_visit: $addUser_visit
      removeUser_visit: $removeUser_visit
      addCumulus_visit: $addCumulus_visit
      removeCumulus_visit: $removeCumulus_visit
      addUnique_node_pristine: $addUnique_node_pristine
      removeUnique_node_pristine: $removeUnique_node_pristine
      addUnique_node_disturbed: $addUnique_node_disturbed
      removeUnique_node_disturbed: $removeUnique_node_disturbed
    ) {
      id
      user_id
      calendar_id
      cumulus_id
      calendar_id
      pristine_id
      disturbed_id
    }
  }
`;
