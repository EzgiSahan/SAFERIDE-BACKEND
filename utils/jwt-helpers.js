import jwt from 'jsonwebtoken';
// import {} from 'dotenv/config';
const ACCESS_TOKEN_SECRET = "fdksjafjnasbnvhsaR65512341asjh123h1ji5hj12hu21y4h1j2ndksjafjnasbnvhsadfh1j2ndss"
const REFRESH_TOKEN_SECRET = "kakljfdkjasklfdnmasci23ui4u198274389jqfwdh871rnjfqu8dw817h24nuh34178uijsajhnfq9h"

function jwtTokens({user_id, user_name, user_email}) {
    const user = {user_id, user_name, user_email};
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {expiresIn: '2h'});
    return ({accessToken, refreshToken});
}

export {jwtTokens};