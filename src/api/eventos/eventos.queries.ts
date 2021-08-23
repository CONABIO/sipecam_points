import gql from 'graphql-tag';

export const getCalendar = gql`
  query calendars($search: searchCalendarInput, $order: [orderCalendarInput], $pagination: paginationInput!) {
    calendars(search: $search, order: $order, pagination: $pagination) {
      id
      date_started
      date_finished
    }
  }
`;

export const getVisitas = gql`
  query visits($search: searchVisitInput, $order: [orderVisitInput], $pagination: paginationInput!) {
    visits(search: $search, order: $order, pagination: $pagination) {
      id
      user_id
      calendar_id
      created_at
      cumulus_id
      node_id
      calendar {
        id
        date_started
        date_finished
      }
      user_visit {
        first_name
        last_name
        email
        username
      }
      cumulus_visit {
        id
        name
      }
      unique_node {
        id
        nomenclatura
        location
        cat_integr
        integrity
        cumulus_id
        ecosystem_id
      }
    }
  }
`;
