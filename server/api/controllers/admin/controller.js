import postModel from "../../models/post";
import userModel from "../../models/user";
import tokenModel from "../../models/token"

export class Controller{
    async deletePost(req, res) {
       
        const { userID, token, postID } = req.params
        const tokenFound = await tokenModel.findOne({ token: token });
        const userFound = await userModel.findById(userID)
        try {
          if (tokenFound && tokenFound.userID === userID && userFound.isAdmin ) {
            const deletedPost = await postModel.findByIdAndDelete(postID);
            res.send({ message: "delete success" });
          } else {
            res.status(403).send({ message: "hello hacker" })
          }
        } catch (err) {
          res.send(err);
        }
      }

}

export default new Controller();