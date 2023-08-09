import jwt from 'jsonwebtoken';

function jwtTokens({user_id, user_name, user_email,user_role}) {
    const user = {user_id, user_name, user_email,user_role};
    const accessToken = jwt.sign(user,  process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
    const refreshToken = jwt.sign(user,  process.env.REFRESH_TOKEN_SECRET, {expiresIn: '2h'});
    return ({accessToken, refreshToken});
}

export {jwtTokens};