import jwt from 'jsonwebtoken';

function jwtTokens({id,name,lastName, email,phone,country,city,address,birthdate,role}) {
    const user = {id,name,lastName, email,phone,country,city,address,birthdate,role};
    const accessToken = jwt.sign(user,  process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
    const refreshToken = jwt.sign(user,  process.env.REFRESH_TOKEN_SECRET, {expiresIn: '2h'});
    return ({accessToken, refreshToken});
}

export {jwtTokens};