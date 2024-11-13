import { gql } from "@apollo/client";

export const TABLE_TICKETS = gql`
  query ($token: String!, $filters: TicketFilter!, $lang: String!) {
    helperQuery(token: $token) {
      ticketList(filters: $filters) {
        count
        array {
          id
          link
          title
          initiator {
            id
            outerId
          }
          recipient {
            id
            name
            surname
            patronymic
          }
          subTheme {
            name(lang: $lang) {
              stroke
            }
            theme {
              name(lang: $lang) {
                stroke
              }
              unit {
                name(lang: $lang) {
                  stroke
                }
              }
            }
          }
          date
          subTheme {
            theme {
              name(lang: $lang) {
                stroke
              }
            }
          }
          lastMessage {
            sender {
              name
              surname
              patronymic
            }
            date
          }
          messages {
            text
          }
          status {
            id
            name(lang: $lang) {
              stroke
            }
          }
        }
      }
    }
  }
`;

export const TABLE_TICKETS_USER = gql`
  query (
    $token: String!
    $clientId: Int!
    $filters: TicketClientFilter!
    $lang: String!
  ) {
    clientQuery(token: $token) {
      ticketListByClient(clientId: $clientId, filters: $filters) {
        count
        array {
          id
          link
          title
          initiator {
            id
            outerId
          }
          recipient {
            id
            name
            surname
            patronymic
          }
          subTheme {
            name(lang: $lang) {
              stroke
            }
            theme {
              name(lang: $lang) {
                stroke
              }
              unit {
                name(lang: $lang) {
                  stroke
                }
              }
            }
          }
          date
          subTheme {
            theme {
              name(lang: $lang) {
                stroke
              }
            }
          }
          lastMessage {
            sender {
              name
              surname
              patronymic
            }
            date
          }
          messages {
            text
          }
          status {
            id
            name(lang: $lang) {
              stroke
            }
          }
        }
      }
    }
  }
`;

export const MESSAGES_CHAT = gql`
  query ($token: String!, $link: String!, $lang: String!) {
    clientQuery(token: $token) {
      ticket(link: $link) {
        id
        title
        log {
          date
          type
          initiator {
            id
            name
            surname
            patronymic
            role
          }
          info
        }
        recipient {
          id
          name
          surname
          patronymic
          country {
            name(lang: $lang) {
              stroke
            }
          }
        }
        assistant {
          id
          name
          surname
          patronymic
        }
        reaction
        initiator {
          id
          name
          surname
          patronymic
          country {
            name(lang: $lang) {
              stroke
            }
          }
        }
        messages {
          id
          text
          visibility
          isActive
          removable
          attachs {
            id
            path
            name
          }
          sender {
            id
            name
            surname
            patronymic
            role
          }
          date
        }
        status {
          id
          name(lang: $lang) {
            stroke
          }
        }
        subTheme {
          id
          name(lang: $lang) {
            stroke
          }
          departments {
            id
            name(lang: "ru") {
              stroke
            }
          }
          theme {
            id
            name(lang: $lang) {
              stroke
            }
            unit {
              id
              name(lang: $lang) {
                stroke
              }
            }
          }
        }
      }
    }
  }
`;

export const MESSAGE = gql`
  query ($token: String!, $id: Int!) {
    clientQuery(token: $token) {
      message(id: $id) {
        sender {
          id
        }
      }
    }
  }
`;

export const MESSAGES_CHAT_CLIENT = gql`
  query ($token: String!, $link: String!, $lang: String!) {
    clientQuery(token: $token) {
      ticket(link: $link) {
        id
        title
        recipient {
          id
          name
          surname
          patronymic
        }
        assistant {
          id
          name
          surname
          patronymic
        }
        reaction
        initiator {
          id
          name
          surname
          patronymic
        }
        messages {
          id
          text
          visibility
          removable
          attachs {
            id
            path
            name
          }
          sender {
            id
            name
            surname
            patronymic
            role
          }
          date
        }
        status {
          id
          name(lang: $lang) {
            stroke
          }
        }
        subTheme {
          id
          name(lang: $lang) {
            stroke
          }
          departments {
            id
            name(lang: "ru") {
              stroke
            }
          }
          theme {
            id
            name(lang: $lang) {
              stroke
            }
            unit {
              id
              name(lang: $lang) {
                stroke
              }
            }
          }
        }
      }
    }
  }
`;

export const LOGIN = gql`
  query ($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      user {
        id
        name
        surname
        role
      }
    }
  }
`;

export const LOGIN_OUTER = gql`
  query ($sessionKey: String!) {
    loginOuter(sessionKey: $sessionKey) {
      token
      user {
        id
        name
        surname
        patronymic
        role
      }
    }
  }
`;

export const TRANSLATE = gql`
  query ($lang: String!) {
    translationList(lang: $lang) {
      type
      code
      stroke
    }
  }
`;

export const USER = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      user(id: $id) {
        name
        surname
        patronymic
        role
      }
    }
  }
`;

export const THEME_LIST = gql`
  query ($token: String!, $lang: String!) {
    clientQuery(token: $token) {
      allThemeTree {
        id
        name(lang: $lang) {
          stroke
        }
        visibility
        orderNum
        themes {
          id
          name(lang: $lang) {
            stroke
          }
          visibility
          orderNum
          subThemes {
            id
            name(lang: $lang) {
              stroke
            }
            visibility
            orderNum
            departments {
              id
              name(lang: "ru") {
                stroke
              }
            }
          }
        }
      }
    }
  }
`;

export const DEPARTMENTS_LIST = gql`
  query ($token: String!) {
    helperQuery(token: $token) {
      departmentList {
        id
        name(lang: "ru") {
          stroke
        }
      }
    }
  }
`;

export const ATTACHEMNTS_LIST = gql`
  query ($token: String!, $messageId: Int!) {
    clientQuery(token: $token) {
      attachmentList(messageId: $messageId) {
        id
        path
      }
    }
  }
`;

export const CURATORS_LIST = gql`
  query ($token: String!) {
    helperQuery(token: $token) {
      helperList {
        id
        jobTitle {
          id
          name(lang: "ru") {
            stroke
          }
        }
        birthday
        startWorkDate
        user {
          id
          name
          surname
          patronymic
          isActive
        }
        departments {
          id
          name(lang: "ru") {
            stroke
          }
        }
        permissions {
          sendMsg
          helperEdit
          themeEdit
          translationEdit
        }
      }
    }
  }
`;

export const HELPER = gql`
  query ($token: String!, $id: Int!, $lang: String!) {
    helperQuery(token: $token) {
      helper(id: $id) {
        id
        jobTitle {
          id
          name(lang: "ru") {
            stroke
          }
        }
        departments {
          id
          name(lang: "ru") {
            stroke
          }
        }
        birthday
        startWorkDate
        user {
          id
          name
          surname
          patronymic
          country {
            id
            name(lang: $lang) {
              stroke
            }
          }
          isActive
        }
        permissions {
          sendMsg
          helperEdit
          themeEdit
          translationEdit
        }
      }
    }
  }
`;

export const HELPER_PERMS = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      helperPerms(id: $id) {
        sendMsg
        helperEdit
        themeEdit
        translationEdit
      }
    }
  }
`;

export const JOB_TITLE_LIST = gql`
  query ($token: String!, $lang: String!) {
    helperQuery(token: $token) {
      jobTitleList {
        id
        name(lang: $lang) {
          stroke
        }
      }
    }
  }
`;

export const COUNTRY_LIST = gql`
  query ($token: String!, $lang: String!) {
    clientQuery(token: $token) {
      countryList {
        id
        code
        name(lang: $lang) {
          stroke
        }
        langs {
          id
          code
          name
        }
      }
    }
  }
`;

export const COUNTRY = gql`
  query ($token: String!, $id: Int!, $lang: String!) {
    clientQuery(token: $token) {
      country(id: $id) {
        id
        code
        name(lang: $lang) {
          code
          stroke
        }
        langs {
          id
          name
        }
      }
    }
  }
`;

export const LANGUAGE_LIST = gql`
  query ($token: String!) {
    clientQuery(token: $token) {
      langList {
        id
        code
        name
      }
    }
  }
`;

export const UNIT = gql`
  query ($token: String!, $id: Int!, $lang: String!) {
    helperQuery(token: $token) {
      unit(id: $id) {
        name(lang: $lang) {
          stroke
        }
        visibility
        orderNum
      }
    }
  }
`;

export const THEME = gql`
  query ($token: String!, $id: Int!, $lang: String!) {
    helperQuery(token: $token) {
      theme(id: $id) {
        name(lang: $lang) {
          stroke
        }
        visibility
        orderNum
        unit {
          id
          name(lang: $lang) {
            stroke
          }
        }
      }
    }
  }
`;

export const SUBTHEME = gql`
  query ($token: String!, $id: Int!, $lang: String!) {
    helperQuery(token: $token) {
      subTheme(id: $id) {
        name(lang: $lang) {
          stroke
        }
        orderNum
        visibility
        theme {
          id
          name(lang: $lang) {
            stroke
          }
          unit {
            id
            name(lang: $lang) {
              stroke
            }
          }
        }
        departments {
          id
          name(lang: "ru") {
            stroke
          }
        }
      }
    }
  }
`;

export const STATS = gql`
  query ($token: String!, $filters: HelperStatsFilter!) {
    helperQuery(token: $token) {
      helperStatList(filters: $filters) {
        helper {
          id
          user {
            name
            surname
            patronymic
          }
        }
        stats {
          totalTickets
          newTickets
          inProgressTickets
          onRevisionTickets
          onExtensionTickets
          onMentorTickets
          closedTickets
          avgReplyTime
          likes
          dislikes
          notRated
          fantasy
        }
      }
    }
  }
`;

export const HELPER_STATS = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      helper(id: $id) {
        stats {
          totalTickets
          newTickets
          inProgressTickets
          onRevisionTickets
          onExtensionTickets
          onMentorTickets
          closedTickets
          avgReplyTime
          likes
          dislikes
          notRated
          fantasy
        }
      }
    }
  }
`;

export const STATUS_LIST = gql`
  query ($token: String!, $lang: String!) {
    helperQuery(token: $token) {
      ticketStatusList {
        id
        name(lang: $lang) {
          stroke
        }
      }
    }
  }
`;

export const TRANSLATION_LIST = gql`
  query ($token: String!) {
    helperQuery(token: $token) {
      translationListFull {
        id
        code
        translations {
          lang
          stroke
        }
      }
    }
  }
`;
