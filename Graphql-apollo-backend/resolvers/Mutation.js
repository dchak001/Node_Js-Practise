const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Vote = require('../models/Vote')
const { APP_SECRET } = require('../util/auth')

async function signup(parent, args, context, info) {
    // 1
    const password = await bcrypt.hash(args.password, 12)

    // 2
    console.log(args);
    const user = await User.create({
        ...args,
        password
    })

    // 3
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // 4
    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    // 1
    const user = await User.findOne({ where: { email: args.email } });
    if (!user) {
        throw new Error('No such user found')
    }

    // 2
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // 3
    return {
        token,
        user,
    }
}

async function post(parent, args, context) {
    const { userId } = context;

    const user = await User.findByPk(userId);
    if (!user)
        throw new Error('Not Authenticated');
    const post = await user.createLink({
        url: args.url,
        description: args.description
    });

    context.pubsub.publish("NEW_LINK", {
        newLink: post
    })

    return post;

}

async function vote(parent, args, context, info) {
    // 1
    const userId = context.userId;

    // 2
    const vote = await Vote.findOne({
        where:{
            userId:userId,
            linkId:args.linkId
        }
    })

    if (vote) {
        throw new Error(`Already voted for link: ${args.linkId}`)
    }

    // 3
    const newVote = await Vote.create({
        userId:userId,
        linkId:args.linkId
    })
    context.pubsub.publish("NEW_VOTE", {
        newVote:newVote
    })

    return newVote
}

module.exports = {
    signup,
    login,
    post,
    vote,
}