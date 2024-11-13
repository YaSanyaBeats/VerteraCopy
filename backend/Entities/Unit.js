import Entity from "./Entity.js";
import Translation from "./Translation.js";
import Theme from "./Theme.js";

class Unit extends Entity {
    static TableName = 'units';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static OrderField = 'orderNum';
    static VisibilityField = 'visibility';
    static TranslationType = 'unit';

    static async GetById(id, initiator, constraint) {
        let constraintSql = ``;

        if(constraint) {
            constraintSql += ` AND ${this.VisibilityField} < ${Theme.ValidateVisibility(initiator.role)}`;
        }

        const sql = `
            SELECT * FROM ${this.TableName} 
            WHERE ${this.PrimaryField} = ?
            ${constraintSql}
        `;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList(initiator, constraint) {
        let constraintSql = ``;

        if(constraint) {
            constraintSql += `WHERE ${this.VisibilityField} < ${Theme.ValidateVisibility(initiator.role)}`;
        }

        const sql = `
            SELECT * FROM ${this.TableName} 
            ${constraintSql}
            ORDER BY ${this.OrderField} ASC
        `;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = { nameCode, visibility: fields.visibility, orderNum: fields.orderNum };
            const result = await super.TransRequest(conn, sql, [insertFields]);
            return nameCode;
        });
    }

    static async TransUpdate(id, fields, initiator, conn) {
        const transFunc = async (conn) => {
            if (fields.stroke) {
                const row = await this.GetById(id, initiator);
                const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;

            const updateFields = {};
            if (fields.orderNum) updateFields.orderNum = fields.orderNum;
            if (fields.visibility) updateFields.visibility = fields.visibility;
            if (super.IsArgsEmpty(updateFields)) return super.EmptyUpdateInfo;

            const result = await super.TransRequest(conn, sql, [updateFields, id]);
            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        };

        if (!conn) {
            return await super.Transaction(async (conn) => {
                return await transFunc(conn);
            });
        }
        else {
            return await transFunc(conn);
        }
    }

    // Cascade deleting Unit & Themes & SubThemes & SubTheme to department link
    static async DeleteCascade(id) {
        return await super.Transaction(async (conn) => {
            const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [id]);

            const translationResult = await Translation.ClearUnused(conn);

            return result.affectedRows;
        });
    }
}

export default Unit;