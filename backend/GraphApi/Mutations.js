import { ObjectMutations } from "./ObjectMutations.js";

export const Mutations = `
    ${ObjectMutations}

    type ClientMutation {
        class: String!

        addClientUser(userFields: UserInsert!, clientFields: ClientInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!, notification: Boolean!): TicketInsertInfo!
        addMessage(fields: MessageInsert!): Int!

        updateMessage(id: Int!, fields: MessageUpdate!): UpdateInfo!
        updateClientUser(id: Int!, userFields: UserUpdate!, clientFields: ClientUpdate!): UpdateInfo!
        updateTicketByClient(id: Int!, fields: TicketClientUpdate!): UpdateInfo!
    }

    type HelperMutation {
        class: String!

        updateTicket(id: Int!, fields: TicketUpdate!, departmentId: Int): UpdateInfo!
        splitTicket(id: Int!, argsList: [TicketSplitArgItem!]!): Int!
        redirectTicketToMentor(id: Int!, mentorId: Int!): Int!
        addTicketMass(ticketFields: TicketInsert!, messageFields: MessageInsert!, notification: Boolean!, idsOuter: Boolean!, ids: [Int]!): [Int]!
                      
        helperObj: HelperObjMutation!
        themeObj: ThemeObjMutation!
        translationObj: TranslationObjMutation!
    }

    type AdminMutation {
        class: String!

        addTicketStatus(fields: TicketStatusInsert!): String!
        addJobTitle(fields: HelperJobTitleInsert!): String!
        addDepartment(fields: DepartmentInsert!): String!

        updateDepartment(id: Int!, fields: DepartmentUpdate!): UpdateInfo!
        updateTicketStatus(id: Int!, fields: TicketStatusUpdate!): UpdateInfo!
        updateHelperJobTitle(id: Int!, fields: HelperJobTitleUpdate!): UpdateInfo!
        updateHelperPerms(id: Int!, fields: HelperPermissionsUpdate!): UpdateInfo!

        deleteDepartment(id: Int!) : Int!
    }
`;