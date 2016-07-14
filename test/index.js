import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';

import * as Errors from '@revolttv/errors';

import authorized  from '../src';

chai.use(sinonChai);

describe('authorized-middleware', () => {
    let next;

    beforeEach(() => {
        next = sinon.spy();
    });

    it('should exist', () => {
        expect(authorized).to.exist.and.be.a('function');
    });

    it('should return a middleware function', () => {
        let middleware = authorized();

        expect(middleware).to.exist.and.be.a('function');
    });

    it('should call next() with UnauthenticatedError if no user is in request object', () => {
        let middleware = authorized();

        middleware({}, {}, next);

        expect(next).to.have.been.called;
        expect(next.firstCall.args[0]).to.be.an.instanceof(Errors.UnauthenticatedError);
    });

    it('should call next() with UnauthorizedError if user does not have appropriate role', () => {
        let middleware = authorized(['test']);

        middleware({ user: { roles: ['other'] } }, {}, next);

        expect(next).to.have.been.called;
        expect(next.firstCall.args[0]).to.be.an.instanceof(Errors.UnauthorizedError);
    });

    it('should call next() if user has matching role', () => {
        let middleware = authorized(['test']);
        middleware({ user: { roles: ['test'] } }, {}, next);
        expect(next).to.have.been.calledOnce.and.calledWith();
    });

    it('should allow a singular role to be specified', () => {
        let middleware = authorized('test');
        middleware({ user: { roles: ['test'] } }, {}, next);
        expect(next).to.have.been.calledOnce.and.calledWith();
    });

    it('should handle complex roles', () => {
        let middleware = authorized(['test', 'something', 'secret']);
        middleware({ user: { roles: ['admin', 'test', 'other'] } }, {}, next);
        expect(next).to.have.been.calledOnce.and.calledWith();

        next.reset();

        middleware = authorized(['secret', 'something', 'test2']);
        middleware({ user: { roles: ['admin', 'test', 'other'] } }, {}, next);
        expect(next).to.have.been.calledOnce;
        expect(next.firstCall.args[0]).to.be.an.instanceof(Errors.UnauthorizedError);
    });
});
