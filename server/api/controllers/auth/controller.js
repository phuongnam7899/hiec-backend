import userModel from "../../models/user"
import tokenModel from "../../models/token"
import jwt from "jsonwebtoken"
import Axios from "axios";


export class Controller {
    signIn(req, res) {
        let { email, password } = req.body;
        // console.log(req.body);
        if (!email || !password) res.status(406).send({ message: "Missing email or password" });
        else {
            userModel.findOne({ account: { email, password } })
                .then((userFound) => {
                    if (!userFound) res.status(401).send({ message: "Wrong email or password" });
                    else {
                        const payload = {
                            email: email
                        }
                        const token = jwt.sign(payload, process.env.SECRET_KEY);
                        const userInfo = JSON.parse(JSON.stringify(userFound));
                        tokenModel.create({ token: token, userID: userInfo._id }).then((tokenCreated) => {
                            // console.log(tokenCreated)
                        })
                        // console.log(userInfo)
                        delete userInfo.account;
                        const responseData = { token, userInfo };
                        res.status(200).send(responseData)
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
    }
    async signOut(req, res) {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const userID = req.query.id;
        const tokenFound = await tokenModel.findOne({token:token})
     
        if(tokenFound && tokenFound.userID === userID){
            tokenModel.findOneAndDelete({token : token}).then((updatedToken) => {
                if (updatedToken) {
                    res.send("Logged out")
                } else {
                    res.send("Token invalid")
                }
            })
        }else{
            res.send({message : "No token existed", code : 400})
        }
     
    }
    async register(req, res) {
        const { email, password, name} = req.body
        const API_KEY = "4400dfa242f74c78f41b83207cc6357a"
        const API_KEY_2 = "aed954457acea07785e297189d0a903f"
        try {
            if(password.length >= 8 && name &&  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                await Axios.get(`http://apilayer.net/api/check?access_key=${API_KEY_2}&email=${email}`)
                .then(response => {
                    return response.data
                })
                .then(data => {
                    if (data.smtp_check) {
                        userModel.findOne({ "account.email": email })
                            .then((userFound) => {
                                
                                if (userFound) {
                                    res.send({message : "Account existed",code : 405})
                                }
                                else {
                                    userModel.create({
                                        isAdmin: false,
                                        account: {
                                            email: email,
                                            password: password
                                        },
                                        profile: {
                                            name: name,
                                            gender: "",
                                            phoneNumber: "",
                                            dob: null,
                                            occupation: {
                                                isWorking: false,
                                                describe: new Object // jobTitle - companyName or school - major
                                            },
                                            address: "",
                                            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQcVTlEXUHIyBJGKGKRcdKVOYhb22zka6_CZ0VwJ4z2c7wSlWw6&usqp=CAU"
                                        }
                                    })
                                    res.send({message : "Account has been created",code : 200})
                                }
                            })
                    }else{
                        res.send({message : "Email doesnt exist",code : 400})
                    }
                })
            }
            else{
                res.send({message : "not enough info"})
            }
        } catch (err) {
            res.send(err)
        }

    }
}
export default new Controller();
