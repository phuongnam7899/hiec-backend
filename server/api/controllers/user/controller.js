import userModel from "../../models/user"
import postModel from "../../models/post"

export class Controller {
    changePassword(req,res){
        const {oldPassword,newPassword} = req.body;
        const {id} = req.params;
        // console.log(_id);
        try{
        userModel.findById(id)
        .then((userFound)=>{
            if(userFound){
                console.log(typeof(userFound.account.password))
                if(userFound.account.password === oldPassword){
                    userModel.findByIdAndUpdate(id,{"account.password":newPassword})
                    .then(()=>{
                        res.json({
                            message : "Đổi mật khẩu thành công",
                            success : 1
                        })
                    })
                }
                else{
                    res.json({
                        message : "Mật khẩu cũ không đúng",
                        success : 0
                    })
                }
            }
        })
        }
        catch(err){
            res.send(err);
        }
    }
    updateInfo(req,res){
        const {id} = req.params
        const {name,dob,gender,phoneNumber,address,isWorking,describe,avatar}  = req.body
        const profile = {
            "name":name,
            "dob":dob,
            "gender":gender,
            "phoneNumber":phoneNumber,
            "address":address,
            "occupation":{
                "isWorking":isWorking,
                "describe":describe,
            },
            "avatar":avatar
        }
        userModel.findByIdAndUpdate(id,{"profile":profile})
        .then(success=>{
            console.log(success)
            if(success){
                res.status(200).send(success)
            }else{
                res.status(405).send("user not found")
            }
        })
    }


    deleteUserByID(req,res){
        const {id} = req.params
        postModel.deleteMany({user : id}).then(deletedPost=>{
            if(deletedPost){
                userModel.findByIdAndDelete(id)
                .then((userDeleted)=>{
                    if(userDeleted){
                        res.status(200).send("user deleted")
                    }
                    else{
                        res.status(404).send("User not found")
                    }
                })
            }else{
                res.status(404).send("Cant delete post so cant delete user")
            }
        })

    }

    getUserByID(req,res){
        const {id} = req.params
        userModel.findById(id)
        .then((userFound)=>{
            if(userFound){
                const userInfo = JSON.parse(JSON.stringify(userFound));
                delete userInfo.account.password;
                // console.log(userInfo)
                res.status(200).send(userInfo)
            }else{
                res.status(404).send("user not found / ID wrong")
            }
        })
    }

    register(req, res) {
        const { email, password, name, dob, isWorking } = req.body
        userModel.findOne({"account.email":email})
            .then((userFound) => {
                console.log(userFound)
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