import userModel from "../../models/user"
import tokenModel from "../../models/token"
import jwt from "jsonwebtoken"
export class Controller {
    signIn(req, res) {
        let {email,password} = req.body;
        // console.log(req.body);
        if(!email || !password) res.status(406).send({message : "Missing email or password"});
        else{
            userModel.findOne({account : {email, password}})
                        .then((userFound) => {
                            if(!userFound) res.status(401).send({message : "Wrong email or password"});
                            else{
                                const payload = {
                                    email: email,
                                    password: password
                                }
                                const token = jwt.sign(payload, process.env.SECRET_KEY);
                                const userInfo = JSON.parse(JSON.stringify(userFound));
                                tokenModel.create({token : token, userID : userInfo._id}).then((tokenCreated) => {
                                    // console.log(tokenCreated)
                                })
                                console.log(userInfo)
                                delete userInfo.account;
                                const responseData = {token,userInfo};
                                res.status(200).send(responseData)
                            }
                        }).catch((err) => {
                                console.log(err)
                        })
        }
    }
    signOut(req,res){
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        console.log(token)
        tokenModel.findOneAndUpdate({token : token, isActive : true},{isActive : false}).then((updatedToken) => {
            if(updatedToken){
                console.log(updatedToken)
                res.send("Logged out")
            }else{
                res.send("Token invalid")
            }
        })
    }
}
export default new Controller();