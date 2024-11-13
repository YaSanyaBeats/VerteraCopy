import Entity from "./Entity.js";
import User from "./User.js";
import Errors from "../Utils/Errors.js";

class HelperPermission extends Entity {
    static TableName = 'helper_permissions';
    static PrimaryField = 'helperId';
    static SendMsgField = 'sendMsg';
    static HelperEditField = 'helperEdit';
    static ThemeEditField = 'themeEdit';
    static TranslationEditField = 'translationEdit';

    static async Validate(initiator, permName) {
        if(initiator.role != User.RoleClient) {
            const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.Request(sql, [initiator.id]);
            const perms = result[0];

            if(!perms[permName]) throw new Error(Errors.NotEnoughPerms);

            return perms[permName];
        }

        return true;
    }

    static async GetById(helperId) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [helperId]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} <> 0`;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(conn, helperId) {
        const sql = `INSERT INTO ${this.TableName} SET helperId = ?`;
        const result = await super.TransRequest(conn, sql, [helperId]);
        return helperId;
    }

    static async TransUpdate(helperId, permissions, conn) {
        const transFunc = async (conn) => {
            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [permissions, helperId]);

            return {
                affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus
            };
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
}

export default HelperPermission;