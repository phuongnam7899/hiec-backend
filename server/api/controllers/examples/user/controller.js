import userModel from "../../models/user"

export class Controller {
    create(req,res){
        const user = req.body.user
        const email = user.email
        userModel.find({account:{email}})
        .then((userFound)=>{
            if(userFound){
                res.status(400).send("User found")
            }
            else{
                userModel.create({
                    
                })
                res.status(200).send("User not found")
                
            }
        })
    }
}


export default new Controller;