const { ApolloServer,PubSub } = require('apollo-server');
const path = require('path');
const fs = require('fs');
const sequelize = require('./util/database');
const { getUserId } = require('./util/auth');
const UserModel = require('./models/User');
const LinkModel = require('./models/Link');
const VoteModel = require('./models/Vote');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')
const Subscription = require('./resolvers/Subscription')

const resolvers = {
 Query,
 Link,
 Mutation,
 User,
 Subscription,
 Vote
  }


const pubsub=new PubSub();//publish subscriptions

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'src', 'schema.graphql'),
    //'F:/Node Js Practise/Graphql-apollo-backend/src/schema.graphql',
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});



UserModel.hasMany(LinkModel,{constraints:true,onDelete:'CASCADE'});
LinkModel.belongsTo(UserModel);
UserModel.hasMany(VoteModel,{constraints:true,onDelete:'CASCADE'});
VoteModel.belongsTo(UserModel);
LinkModel.hasMany(VoteModel,{constraints:true,onDelete:'CASCADE'});
VoteModel.belongsTo(LinkModel);

sequelize
  //.sync({force:true})
  .sync()
  .then(() => {
    server.listen(3000)
      .then(({ url }) => {
        console.log('Server running on post ' + url);
      })
  })
  .catch(err => console.log(err));


