const Label = require('../models/labels');
const User = require('../models/users');

class LabelsController {
    async find (ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        ctx.body = await Label.find({name: new RegExp(ctx.query.q)}).limit(perPage).skip(page * perPage);
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const label = await Label.findById(ctx.params.id).select(selectFields);
        ctx.body = label;
    }
    
    async create (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const label = await new Label(ctx.request.body).save();
        ctx.body = label;
    }

    async update (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const label = await Label.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true});
        ctx.body = label;
    }

    async checkLabelExist(ctx, next) {
        const label = await Label.findById(ctx.params.id);
        if (!label) {
            ctx.throw(404, '该标签不存在');
        }
        await next();
    }
    
    async listLabelsFollowers (ctx) {
        const users = await User.find({ tags: ctx.params.id });
        ctx.body = users;
    }
}

module.exports = new LabelsController();