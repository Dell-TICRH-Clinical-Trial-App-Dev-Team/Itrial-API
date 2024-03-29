import jwt from 'express-jwt';
import config from './config';
import jwks from 'jwks-rsa';

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.domain}/.well-known/jwks.json`,
  }),
  audience: config.audience,
  issuer: `https://${config.domain}/`,
  algorithms: ['RS256'],
});

export default jwtCheck;
