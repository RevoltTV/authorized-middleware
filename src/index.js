import _ from 'lodash';

import {
    UnauthenticatedError,
    UnauthorizedError
} from '@revolttv/errors';

export default (roles) => {
    if (_.isString(roles)) {
        roles = [roles];
    }

    function authorized(req, res, next) {
        if (!req.user) {
            return next(new UnauthenticatedError());
        }

        if (_.size(_.intersection(roles, _.get(req, 'user.roles', []))) > 0) {
            return next();
        }

        return next(new UnauthorizedError());
    }

    authorized.roles = roles;

    return authorized;
};
