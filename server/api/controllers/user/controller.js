import userModel from "../../models/user"
import postModel from "../../models/post"
import tokenModel from "../../models/token"

export class Controller {
    changePassword(req,res){
        const {oldPassword,newPassword,token} = req.body;
        const {id} = req.params;
        // console.log(_id);
        tokenModel.findOne({token : token}).then((tokenFound) => {
            if(tokenFound){
                if(tokenFound.userID === id){
                try{
                    userModel.findById(id)
                    .then((userFound)=>{
                        if(userFound){
                            // console.log(typeof(userFound.account.password))
                            if(userFound.account.password === oldPassword){
                                userModel.findByIdAndUpdate(id,{"account.password":newPassword})
                                .then(()=>{
                                    res.status(200).send({success : 1})
                                })
                            }else{
                                res.send({success : 0, message : "Mật khẩu cũ không chính xác"})
                            }
                        }else{
                            res.send("Invalid ID")
                        }
                    })
                    }
                    catch(err){
                        res.send(err);
                    }}else{
                        res.send("Fail")
                    }
            }else{
                res.send("Fail")
            }
        })
    }
    updateInfo(req,res){
        const {id} = req.params
        const {name,dob,gender,phoneNumber,address,isWorking,describe,avatar,token}  = req.body
        const profile = {
            "name": name,
            "dob": dob,
            "gender": gender,
            "phoneNumber": phoneNumber,
            "address": address,
            "occupation": {
                "isWorking": isWorking,
                "describe": describe,
            },
            "avatar": avatar
        }
        tokenModel.findOne({token : token}).then((tokenFound) => {
            if(tokenFound){
                if(tokenFound.userID === id){
                    userModel.findByIdAndUpdate(id,{"profile":profile})
                    .then(success=>{
                        // console.log(success)
                        if(success){
                            res.status(200).send(success)
                        }else{
                            res.status(405).send("user not found")
                        }
                    })
                }else{
                    res.send("Fail")
                }
            }else{
                res.send("Fail")
            }
        })

    }


    // async deleteUserByID(req, res) {
    //     const { email } = req.params
    //     const user = await userModel.findOne({ "account.email": email })
    //     console.log(email)
    //     if (user) {
    //         console.log(user)
    //         postModel.deleteMany({ user: user._id }).then(deletedPost => {
    //             if (deletedPost) {
    //                 userModel.findByIdAndDelete(user._id)
    //                     .then((userDeleted) => {
    //                         if (userDeleted) {
    //                             res.status(200).send("user deleted")
    //                         }
    //                         else {
    //                             res.status(404).send("User not found")
    //                         }
    //                     })
    //             } else {
    //                 res.status(404).send("Cant delete post so cant delete user")
    //             }
    //         })
    //     } else {
    //         res.send({ message: "no" })
    //     }
    // }

    getUserByID(req, res) {
        const { id } = req.params
        userModel.findById(id)
            .then((userFound) => {
                if (userFound) {
                    const userInfo = JSON.parse(JSON.stringify(userFound));
                    delete userInfo.account.password;
                    // console.log(userInfo)
                    res.status(200).send(userInfo)
                } else {
                    res.status(404).send("user not found / ID wrong")
                }
            })
    }

}
export default new Controller();