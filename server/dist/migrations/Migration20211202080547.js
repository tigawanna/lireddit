"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20211202080547 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20211202080547 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "user" add column "email" text not null;');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    }
}
exports.Migration20211202080547 = Migration20211202080547;
//# sourceMappingURL=Migration20211202080547.js.map