"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Posts_1 = require("./../entities/Posts");
const sleep_1 = require("../utils/sleep");
const isAuth_1 = require("./../middleware/isAuth");
const typeorm_1 = require("typeorm");
const Updoot_1 = require("./../entities/Updoot");
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Posts_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedPosts);
let PostResolver = class PostResolver {
    textSnippet(root) {
        return root.text.slice(0, 50);
    }
    async posts(limit, cursor, { req }) {
        await (0, sleep_1.sleep)(0);
        const reallimit = Math.min(50, limit);
        const reaLimitPlusOne = reallimit + 1;
        const replacements = [reaLimitPlusOne];
        if (req.session.userId) {
            replacements.push(req.session.userId);
        }
        let cursorIdx = 3;
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
            cursorIdx = replacements.length;
        }
        const posts = await (0, typeorm_1.getConnection)().query(`
select p.*,
json_build_object(
  '_id', u._id,
  'username', u.username,
  'email', u.email,
  'createdAt', u."createdAt",
  'updatedAt', u."updatedAt"
  ) creator,
${req.session.userId
            ? '(select value from updoot where "userId" = $2 and "postId" = p._id) "voteStatus"'
            : 'null as "voteStatus"'}
from post p
inner join public.user u on u._id = p."creatorId"
${cursor ? `where p."createdAt" < $${cursorIdx}` : ""}
order by p."createdAt" DESC
limit $1
`, replacements);
        const hasMore = posts.length === reaLimitPlusOne;
        return {
            posts: posts.slice(0, reallimit),
            hasMore
        };
    }
    post(_id) {
        return Posts_1.Post.findOne(_id, { relations: ["creator"] });
    }
    async createPost(input, { req }) {
        return Posts_1.Post.create(Object.assign(Object.assign({}, input), { creatorId: req.session.userId })).save();
    }
    async updatePost(_id, title) {
        const post = await Posts_1.Post.findOne(_id);
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            post.title = title;
            await Posts_1.Post.update({ _id }, { title });
        }
        return post;
    }
    async vote(postId, value, { req }) {
        const isUpdoot = value !== -1;
        const realvalue = isUpdoot ? 1 : -1;
        const userId = req.session.userId ? req.session.userId : 1;
        const updoot = await Updoot_1.Updoot.findOne({ postId, userId });
        if (updoot && updoot.value !== realvalue) {
            await (0, typeorm_1.getConnection)().transaction(async (tm) => {
                await tm.query(`
update  updoot 
set value=$1
where "userId"=$2 and "postId"=$3
`, [realvalue, userId, postId,]);
                await tm.query(`
update  post
set points=points+$1
where "_id"=$2
`, [2 * realvalue, postId,]);
            });
        }
        else if (!updoot) {
            await (0, typeorm_1.getConnection)().transaction(async (tm) => {
                await tm.query(`
insert into updoot ("userId","postId",value)
values($1,$2,$3);`, [userId, postId, realvalue]);
                await tm.query(`
update post 
set points=points+$1
where _id=$2;
`, [realvalue, postId]);
            });
        }
        return true;
    }
    async deletePost(_id, { req }) {
        await Posts_1.Post.delete({ _id, creatorId: req.session.userId })
            .then(e => console.log("is delete post ======", e))
            .catch(e => console.log("is delete error ======", e));
        return true;
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Posts_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedPosts),
    __param(0, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('cursor', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Posts_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Posts_1.Post),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Posts_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('postId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('value', () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(Posts_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map