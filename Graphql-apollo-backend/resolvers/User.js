async function links(parent, args, context) {
    return await parent.getLinks();
  }
  

  async function votes(parent, args, context) {
    return await parent.getVotes();
  }

  function createdAt(parent,args,context)
  {
      return parent.createdAt.toISOString();
  }
  module.exports = {
    links,
    votes,
  }