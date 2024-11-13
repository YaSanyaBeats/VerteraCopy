import Entity from "./Entity.js";
import Translation from "./Translation.js";

class Department extends Entity {
    static TableName = 'departments';
    static PrimaryField = 'id';
    static NameField = 'name';
    static TranslationType = 'department'

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

            let insertFields = { nameCode };
            if (fields.individual) insertFields.individual = fields.individual;

            const result = await super.TransRequest(conn, sql, [insertFields]);
            return nameCode;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if (fields.stroke) {
                const row = await this.GetById(id);
                const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;

            const updateFields = {};
            if (fields.individual) updateFields.individual = fields.individual;
            else return super.EmptyUpdateInfo;

            const result = await super.TransRequest(conn, sql, [updateFields, id]);
            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        });
    }

    // Cascade deleting Department & SubTheme to department link
    static async DeleteCascade(id) {
        return await super.Transaction(async (conn) => {
            const curDepartment = await this.GetById(id);
            const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [id]);

            const translationResult = await Translation.TransDelete(conn, curDepartment.nameCode);

            return result.affectedRows;
        });
    }
}

export default Department;