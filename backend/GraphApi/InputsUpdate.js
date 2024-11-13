export const InputsUpdate = `
    input TicketUpdate {
        initiatorId: Int
        recipientId: Int
        assistantId: Int
        statusId: Int
        title: String
        unitId: Int
        themeId: Int
        subThemeId: Int
        reaction: Int
    }

    input TicketClientUpdate {
        reaction: Int
        assistantId: Int
    }

    input MessageUpdate {
        readed: Boolean
        isActive: Boolean
    }

    input UserUpdate {
        name: String
        surname: String
        patronymic: String
        countryId: Int
        password: String
        isActive: Boolean
        phone: String
        email: String
    }

    input ClientUpdate {
        idRef: Int!
    }

    input HelperUpdate {
        jobTitleId: Int
        birthday: DateTime
        departmentIds: [Int]
        permissions: HelperPermissionsUpdate
    }

    input HelperPermissionsUpdate {
        sendMsg: Boolean!
        helperEdit: Boolean!
        themeEdit: Boolean!
        translationEdit: Boolean!
    }

    input TranslationUpdate {
        code: String!
        lang: String!
        stroke: String!
    }

    input CountryUpdate {
        lang: String!
        code: String
        stroke: String
        isActive: Boolean
        langIds: [Int]
    }

    input LangUpdate {
        name: String
        code: String
        iconPath: String
        isActive: Boolean
    }

    input TicketStatusUpdate {
        stroke: String!
        lang: String!
    }

    input HelperJobTitleUpdate {
        stroke: String!
        lang: String!
    }

    input SubThemeUpdate {
        themeId: Int
        orderNum: Int
        visibility: Int
        stroke: String
        departmentIds: [Int]
        lang: String!
    }

    input ThemeUpdate {
        unitId: Int
        orderNum: Int
        visibility: Int
        stroke: String
        lang: String!
    }

    input UnitUpdate {
        orderNum: Int
        visibility: Int
        stroke: String
        lang: String!
    }

    input DepartmentUpdate {
        stroke: String
        lang: String!
        individual: Boolean
    }
`;