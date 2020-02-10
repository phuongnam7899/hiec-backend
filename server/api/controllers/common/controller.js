import postModel from "../../models/post"
import userModel from "../../models/user"

export class Controller {
    async ranking(req, res) {
        const now = Date.now();
        const week = 604800000;
        const month = 2629743830;
        const year = 31556926000;
        //  need username,ava,score
        async function findUserMostPosts(limit) {
            try {
                const findPost = await postModel.find({ postTime: { $gte: (now - limit) } }).sort("user").populate("user")
                    let object = {
                        // userId: "user đểu nhé",
                        // name: "Không có tên",
                        // score: 0,
                        // avatar : ""
                        
                    }
                    let arrayPosts = [];
                    let count = 0;
                    // console.log(findPost)
                    findPost.forEach((post) => {
                        // console.log(object.userId)
                        count++ 
                        if (post.user._id !== object.userId) {
                            arrayPosts.push(object)
                            object = {
                                userId: post.user._id,
                                score: 1,
                                avatar : post.user.profile.avatar,
                                name : post.user.profile.name,
                            }
                        } else {
                            object.score+= post.claps.length;
                        }
                        if (count == findPost.length) {
                            arrayPosts.push(object)
                        }
                    })
                    // arrayPosts.sort(function Value(a, b) {
                    //     return b.numberOfPosts - a.numberOfPosts;
                    // })
                    
                    return arrayPosts.splice(1).reverse().slice(0,10);

            }catch(err){
                console.log(err)
                return err
            }
        }
        

        let respondData = {
            week: await findUserMostPosts(week),
            month: await findUserMostPosts(month),
            year: await findUserMostPosts(year),
        }
        // console.log(51)
    
        // console.log(respondData)
        res.status(200).send(respondData)
    }

}




export default new Controller();