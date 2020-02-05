import userModel from "../../models/user"


export class Controller {
    changePassword(req,res){
        const {id} = req.params
        const {oldPassword,newPassword} = req.body
        userModel.findById(id)
        .then((userFound)=>{
            if(userFound){
                console.log(typeof(userFound.account.password))
                if(userFound.account.password === oldPassword){
                    userModel.findByIdAndUpdate(id,{"account.password":newPassword})
                    .then(()=>{
                        res.status(200).send("change password")
                    })
                }else{
                    res.status(405).send("Invalid old password")
                }
            }else{
                res.status(405).send("Invalid ID")
            }
        })
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
                res.status(200).send("user updated")
            }else{
                res.status(405).send("user not found")
            }
        })
    }


    deleteUserByID(req,res){
        const {id} = req.params
        userModel.findByIdAndDelete(id)
        .then((userDeleted)=>{
            if(userDeleted){
                res.status(200).send("User deleted")
            }
            else{
                res.status(404).send("User not found")
            }
        })
    }

    getUserByID(req,res){
        const {id} = req.params
        userModel.findById(id)
        .then((userFound)=>{
            if(userFound){
                res.status(200).send(userFound)
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