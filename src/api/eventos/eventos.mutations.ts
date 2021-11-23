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
    $comments: String
    $date_sipecam_first_season: Date
    $date_sipecam_second_season: Date
    $date_first_season: Date
    $date_second_season: Date
    $report_first_season: String
    $report_second_season: String
    $addCumulus_visit: ID
    $addUnique_node_pristine: ID
    $addUnique_node_disturbed: ID
    $addMonitors: [ID]
  ) {
    addVisit(
      comments: $comments
      date_sipecam_first_season: $date_sipecam_first_season
      date_sipecam_second_season: $date_sipecam_second_season
      date_first_season: $date_first_season
      date_second_season: $date_second_season
      report_first_season: $report_first_season
      report_second_season: $report_second_season
      addCumulus_visit: $addCumulus_visit
      addUnique_node_pristine: $addUnique_node_pristine
      addUnique_node_disturbed: $addUnique_node_disturbed
      addMonitors: $addMonitors
    ) {
      id
      cumulus_id
    }
  }
`;

export const deleteVisit = gql`
  mutation deleteVisit($id: ID!) {
    deleteVisit(id: $id)
  }
`;

export const updateVisit = gql`
  mutation updateVisit(
    $id: ID!
    $comments: String
    $date_sipecam_first_season: Date
    $date_sipecam_second_season: Date
    $date_first_season: Date
    $date_second_season: Date
    $report_first_season: String
    $report_second_season: String
    $addCumulus_visit: ID
    $removeCumulus_visit: ID
    $addUnique_node_pristine: ID
    $removeUnique_node_pristine: ID
    $addUnique_node_disturbed: ID
    $removeUnique_node_disturbed: ID
    $addMonitors: [ID]
    $removeMonitors: [ID]
  ) {
    updateVisit(
      id: $id
      comments: $comments
      date_sipecam_first_season: $date_sipecam_first_season
      date_sipecam_second_season: $date_sipecam_second_season
      date_first_season: $date_first_season
      date_second_season: $date_second_season
      report_first_season: $report_first_season
      report_second_season: $report_second_season
      addCumulus_visit: $addCumulus_visit
      removeCumulus_visit: $removeCumulus_visit
      addUnique_node_pristine: $addUnique_node_pristine
      removeUnique_node_pristine: $removeUnique_node_pristine
      addUnique_node_disturbed: $addUnique_node_disturbed
      removeUnique_node_disturbed: $removeUnique_node_disturbed
      addMonitors: $addMonitors
      removeMonitors: $removeMonitors
    ) {
      id
      cumulus_id
    }
  }
`;
