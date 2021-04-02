// const authController=require('../controllers/auth');
// const sinon = require('sinon');
// const { expect } = require('chai');
// const sequelize = require('../util/test_database');
// const feedController=require('../controllers/feed')
// const User=require('../models/User-test');

// describe('FeedController-createPost',function(){

//     before(function(done)
//     {
//         sequelize.sync()
//         .then(result=>{
//           return User.create({
//                 id:3,
//                 email:'dipan@mail.com',
//                 password:"pass12$",
//                 name:'dipan'
//             })
//         })
//         .then(()=>{
//             console.log('hello');
//             done();
//         })
//     }
//     )
//     it('should return the newly created post',function(done){

//         const req={
//             userId:3,
//             body:{
//                 title:"title",
//                 content:"content"
//             }
//         }

//         const res={
//             status:(status)=>{
//                 return this;
//             },
//             json:()=>{}

//         }

//         feedController.createPost(req,res,()=>{})
//         .then(post=>{
//             expect(post.title).to.be('title');
//             expect(post).to.have.property('userId',3);
//             done();
//         })
        
//     })
    
//      after(function(done){
//          User.destroy()
//          .then(()=>{
//             return sequelize.close();
//          }).then(()=>{
//              console.log('hello later');
//              done();
//          })
//      })
// })