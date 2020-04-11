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
                                // console.log(userInfo)
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
        // console.log(token)
        tokenModel.findOneAndUpdate({token : token, isActive : true},{isActive : false}).then((updatedToken) => {
            if(updatedToken){
                // console.log(updatedToken)
                res.send("Logged out")
            }else{
                res.send("Token invalid")
            }
        })
    }
    register(req, res) {
        const { email, password, name, dob, isWorking } = req.body
        userModel.findOne({"account.email":email})
            .then((userFound) => {
                // console.log(userFound)
                if (userFound) {
                    res.status(405).send("Account existed")
                }
                else {
                    userModel.create({
                        isAdmin: false,
                        account: {
                            email:email,
                            password:password
                        },
                        profile: {
                            name: name,
                            gender:"",
                            phoneNumber: "",
                            dob: dob,
                            occupation: {
                                isWorking: isWorking,
                                describe: new Object // jobTitle - companyName or school - major
                            },
                            address: "",
                            avatar: "https://i.pinimg.com/236x/8c/87/6e/8c876ed0976c074a8e7664fc21422fb0.jpg" 
                        }
                    })
                    res.status(200).send("Account has been created")
                }
            })
    }
}
export default new Controller();
