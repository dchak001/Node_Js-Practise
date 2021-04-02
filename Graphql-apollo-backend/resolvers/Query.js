const { Sequelize } = require("sequelize");
const Link = require("../models/Link");

exports.feed = async (parent, args, context) => {
    const count = await Link.count();
    const where = args.filter ?
        {
           [Sequelize.Op.or]:[ {description: {
                [Sequelize.Op.like]: '%' + args.filter + '%'
            }},
            {url: {
                [Sequelize.Op.like]: '%' + args.filter + '%'
            }
        }] }: {};

    const sortInput = args.orderBy;
    const order=sortInput? [
        ['createdAt', sortInput.createdAt||'DESC'],
        ['description', sortInput.description||'ASC'],
        ['url', sortInput.url||'ASC']
    ]:[]
    let links = await Link.findAll({
        where,
        offset: args.skip || 0,
        limit: args.limit || count,
        order  
    });
    // links=links.map(async (link)=>{
    //     const postedBy=await link.getUser();
    //     const votes=await link.getVotes();
    //     return {
    //         id:link.id,
    //         description:link.description,
    //         url:link.url,
    //         postedBy,
    //         votes,
    //         createdAt:link.createdAt.toISOString()
    //     }
    // })
    return {
        links,
        count
    }
}