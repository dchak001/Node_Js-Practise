const { expect } = require('chai');
const authMiddleware = require('../middleware/is-auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

describe('Auth Middleware', function () {

    it('should throw an error if authorization header is not present', function () {
        const req = {
            get: () => {
                return null;
            }
        }

        expect(authMiddleware.isAuth.bind(this, req, {}, () => { })).to.throw('Not Authenticated');

    })

    it('should have a property called userId inside request if it is valid ', function () {

        const req = {
            get: (header) => {
                return 'Bearer xyz';
            }
        }

        sinon.stub(jwt, 'verify');

        jwt.verify.returns({ userId: 'abc' });

        authMiddleware.isAuth(req, {}, () => { })
        expect(req).to.have.property('userId', 'abc');

        jwt.verify.restore();
    })

    it('should throw an error is jwt is malformed ', function () {

        const req = {
            get: (header) => {
                return 'Bearer xyz';
            }
        }

        expect(authMiddleware.isAuth.bind(this,req, {}, () => { })).to.throw();
    })
})