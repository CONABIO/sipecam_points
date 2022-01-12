import gql from 'graphql-tag';

/**
 * Calendario
 */
export const getCalendar = gql`
  query calendars($search: searchCalendarInput, $order: [orderCalendarInput], $pagination: paginationInput!) {
    calendars(search: $search, order: $order, pagination: $pagination) {
      id
      date_started
      date_finished
      order
    }
  }
`;

/**
 * Monitores
 */
export const getMonitores = gql`
  query monitors($search: searchMonitorInput, $order: [orderMonitorInput], $pagination: paginationInput!) {
    monitors(search: $search, order: $order, pagination: $pagination) {
      id
      first_name
      last_name
      second_last_name
      contact
    }
  }
`;

/**
 * Visitas
 */
export const getVisits = gql`
  query visits($search: searchVisitInput, $order: [orderVisitInput], $pagination: paginationInput!) {
    visits(search: $search, order: $order, pagination: $pagination) {
      id
      cumulus_id
      cumulus_visit {
        id
        name
      }
      unique_node_pristine {
        id
        nomenclatura
        location
        cat_integr
        cumulus_id
        ecosystem_id
      }
      unique_node_disturbed {
        id
        nomenclatura
        location
        cat_integr
        cumulus_id
        ecosystem_id
      }
      comments
      date_sipecam_first_season
      date_sipecam_second_season
      date_first_season
      date_second_season
      report_first_season
      report_second_season
    }
  }
`;

/**
 * Entregas
 */
export const getFileDelivers = gql`
  query delivered_files($pagination: paginationInput!) {
    delivered_files(pagination: $pagination) {
      node_delivered_files {
        fid
        nomenclatura
      }
      who_delivers
      reception_date
      audio_files
      image_files
      video_files
      total_files
    }
  }
`;
