const authController=require('../controllers/auth');
const User = require('../models/user');
const sinon = require('sinon');
const { expect } = require('chai');

describe('AuthController-Login',function(){

    it('should throw an error when database operation fails',function(done){

        const findOneStub=sinon.stub(User,'findOne');

        findOneStub.throws();

        const req={
            body:{
                email:'dipan@mail.com',
                password:'pass12$'
            }
        }

        authController.login(req,{},()=>{}).then(result=>{
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode',500);
            done();
        })

        findOneStub.restore();
    })
    
     
})