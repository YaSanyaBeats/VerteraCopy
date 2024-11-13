import Entity from "./Entity.js";
import Translation from "./Translation.js";

class TicketStatus extends Entity {
    static TableName = 'ticket_statuses';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static TranslationType = 'ticketStatus'

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = { nameCode };
            const result = await super.TransRequest(conn, sql, [insertFields]);
            return nameCode;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            const row = await this.GetById(id);
            const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode);
            return translationResult;
        });
    }

    static async DeleteCascade(id) {
        return await super.Transaction(async (conn) => {
            const curTicketStatus = await this.GetById(id);
            const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [id]);

            const translationResult = await Translation.TransDelete(conn, curTicketStatus.nameCode);

            return result.affectedRows;
        });
    }
}

export default TicketStatus;