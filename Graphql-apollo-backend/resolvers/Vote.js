const Vote = require("../models/Vote")

async function link(parent, args, context) {
    return await parent.getLink();
}

async function user(parent, args, context) {
    return await parent.getUser();
}

module.exports = {
    link,
    user,
}