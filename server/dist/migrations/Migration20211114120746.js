"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20211114120746 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20211114120746 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
    }
}
exports.Migration20211114120746 = Migration20211114120746;
//# sourceMappingURL=Migration20211114120746.js.map