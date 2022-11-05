const jwt = require("jsonwebtoken");
const handleErr = require("./HandleErr");
let refreshTokens = [];
const accessTokenKey = require('../constants/jwtpasswords').accessTokenKey
const refreshTokenKey = require('../constants/jwtpasswords').refreshTokenKey
// Middleware to authenticate user by verifying his/her jwt-token.
async function auth(req, res, next) {
    let token = req.headers["authorization"];
    if(token){
    token = token.split(" ")[1]; //Access token
    jwt.verify(token, accessTokenKey, async (err, user) => {
        if (user) {
            req.user = user;
            next();
        } else if (err.message === "jwt expired") {
            return res.json(handleErr('Access token expired'));
        } else {
            return res
                .status(403)
                .json(handleErr('User not authenticated'));
        }
    });
    }
    else {
        return res
            .status(403)
            .json(handleErr('Unauthorized'));
    }
}
 function verifyToken(token,refreshToken){
   return jwt.verify(token, accessTokenKey, (err, user) => {
        if(err){
            const result =  refreshAccessToken(refreshToken)
            if(result.success===true){
                return{
                    success:true,
                    token:result.token
                }
            }else{
                return {
                    success:false,
                    message:result.message
                }      
            }
           
        }
        else{
            let obj = {
                success:true,
                token
            }
            return obj
        }
    });
}
 function refreshAccessToken(refreshToken){
    return jwt.verify(refreshToken, refreshTokenKey, (err, user) => {
        if (!err) {
            const accessToken = jwt.sign({ user: user.name }, accessTokenKey, {
                expiresIn: "20s"
            });
            return {
                success:true,
                token:accessToken
            }
        } else {
            console.log('error->',err)
            return {
                success: false,
                message: "Invalid refresh token"
            };
        }
    });
}

module.exports = {
    auth,
    refreshTokens,
    refreshAccessToken,
    verifyToken
}