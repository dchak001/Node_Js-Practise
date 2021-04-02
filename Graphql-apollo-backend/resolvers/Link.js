exports.postedBy = async function (parent, args, context) {
    return await parent.getUser();
}

exports.votes =async function(parent, args, context){
    return await parent.getVotes();
}


