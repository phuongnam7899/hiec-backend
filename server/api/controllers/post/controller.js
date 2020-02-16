import postModel from "../../models/post"
import userModel from "../../models/user"
// import post from "../../models/post";
import axios from "axios"

export class Controller {
    async createNewPost(req,res){
        const {tags,user,postTime,title,content} = req.body;
        const emptyPost = {
            viewers : [],
            claps : [],
            comments : []
        }
        if(tags && user && postTime && title && content){
            const userFound = await userModel.findById(user);
            if(userFound){
            postModel.create({...emptyPost,tags,user,postTime,title,content}).then((createdPost) => {
                res.send({message : "success",data :createdPost});
            }).catch(err => res.send(err))
        }else res.send({message : "user not found"})
        }
    }

    getPostByID(req,res){
        const postID = req.params.id;
        if(postID) {
            postModel.findById(postID).then((postFound) => {
                if(postFound) res.send(postFound)
                else res.send("Post not found")
            }).catch(err => res.send(err))
        }
    }
    async getPostsByUser(req,res){
        const perPage = 10
        const pageNumber = Math.max(0, req.body.page)
        const userID = req.body.id;
        console.log(pageNumber);
        const user = await userModel.findById(userID);
        if(!user) res.send("user not found")
        else {
            const posts = await postModel.find({user : userID}).sort([["postTime", -1]]).limit(perPage).skip(perPage * pageNumber).populate("user")
            let arrayPost = []
            posts.forEach(post=>{
                let newPost = JSON.parse(JSON.stringify(post))
                delete newPost.user.account;
                arrayPost.push( newPost );
                // console.log(post);
            })
            res.send(arrayPost);
            
            // res.send(posts)
        } 
    }
    async deletePostByID(req,res){
        //TO-DO : user gửi req phải là chủ của bài viết
        const postID = req.params.id;
        try{
            const deletedPost = await postModel.findByIdAndDelete(postID)
            res.send(deletedPost) 
        }catch (err){
            res.send(err)
        }
    }
    async addClap(req,res){
        //TO-DO : user cần tồn tại 
        const {userID,postID} = req.body;
        const postBefore = await postModel.findById(postID);
        console.log(postBefore)
        if(!postBefore) res.send("post not found")
        else{
            if(!postBefore.claps.includes(userID)){
                // console.log(postBefore.claps)
                // console.log(userID)
                const clapsBefore = [...postBefore.claps];
                clapsBefore.push(userID)
                console.log(clapsBefore)

                postModel.findByIdAndUpdate(postID,{claps : clapsBefore}).then((beforeUpdated) => {
                    res.send({message:"updated successfully" ,data:beforeUpdated})
                }).catch((err) => res.send(err))
            }else{
                res.send({message :"user clapped before"})
            }
    }
    }

    async addComment(req,res){
        //TO-DO : check người dùng có tồn tại
        const {postID, user, content, time} = req.body;
        const emptyComment = {
            replies : []
        }
        const newComment = {...emptyComment, user, content, time};
        try {
            const post = await postModel.findById(postID);
            const commentsBefore = [...post.comments];
            commentsBefore.push(newComment);
            postModel.findByIdAndUpdate(postID,{comments : commentsBefore}).then((beforeUpdated) => {
                res.send({message:"updated successfully"})
            }).catch((err) => res.send(err))
        } catch (error) {
            res.send(error)
        }
    }
    async addReplyToComment(req,res){
        //TO-DO : check người dùng có tồn tại
        const {postID, commentID, user, content, time} = req.body;
        // const emptyComment = {
        //     replies : []
        // }
        const newReply = {user, content, time};
        try {
            const post = await postModel.findById(postID);
            const commentsBefore = [...post.comments];
            for( let i = 0; i < commentsBefore.length; i++){
                if(commentsBefore[i]._id == commentID){
                    // console.log(commentsBefore[i]._id)
                    // console.log(commentID)
                    // console.log("---")
                    commentsBefore[i].replies.push(newReply);
                    break;
                }
            }
            postModel.findByIdAndUpdate(postID,{comments : commentsBefore}).then((beforeUpdated) => {
                res.send({message:"updated successfully",data:beforeUpdated})
            }).catch((err) => res.send(err))
        } catch (error) {
            res.send(error)
        }
    }
    async addView(req,res){
        //TO-DO : user cần tồn tại 
        const {userID,postID} = req.body;
        try{
            const postBefore = await postModel.findById(postID);
            if(!postBefore) res.send("post not found")
            else{
                if(!postBefore.viewers.includes(userID)){
                    // console.log(postBefore.claps)
                    // console.log(userID)
                    const viewersBefore = [...postBefore.viewers];
                    viewersBefore.push(userID)
                    console.log(viewersBefore)
    
                    postModel.findByIdAndUpdate(postID,{viewers : viewersBefore}).then((beforeUpdated) => {
                        res.send({message:"updated successfully" ,data:beforeUpdated})
                    }).catch((err) => res.send(err))
                }
                else{
                    res.send({message:"viewed before",data:postBefore})
                }
        }

        }catch(err){
            res.send(err)
        }
    }
    async searchByTag(req,res){
        const {tagList} = req.body;
        console.log(tagList)
        try{
            const posts = await postModel.find({ "tags" : { $all : tagList } }).sort([["postTime" , -1]])
            console.log(posts)
            res.send(posts)
        }catch(err){
            res.send(err)
        }
    }
    async searchByKeyword(req,res){
        const keyword = req.query.keyword;
        console.log(keyword)
        try{
            const posts = await postModel.find();
            const foundList = posts.filter((post) => {
                return post.title.toUpperCase().includes(keyword.toUpperCase())
            })
            res.send(foundList)
        }catch(err){
            res.send(err)
        }
    }

    async getRecent(req,res){
        const number = req.body.number;
        const sortedByTime = await postModel.find().sort([["postTime" , -1]]).limit(number)
        res.send(sortedByTime)
    }
    async getHotPost(req,res){
        const {number,limit} = req.body.number;
        try{
            const sortedByTime = await postModel.find().sort([["postTime" , -1]]).limit(limit)
            const sortedByTimeCopy = [...sortedByTime];
            console.log(sortedByTimeCopy)
            for(let i = 0; i < sortedByTimeCopy.length - 1; i++){
                console.log(i)
                for(let j = i; j < sortedByTimeCopy.length;j++){
                    console.log(j)
                    console.log(`Before : ${sortedByTimeCopy[j].claps.length} - ${sortedByTimeCopy[i].claps.length}`)
                    if(sortedByTimeCopy[j].claps.length > sortedByTimeCopy[i].claps.length){
                        console.log("swap")
                        sortedByTimeCopy[j] = [sortedByTimeCopy[i],sortedByTimeCopy[i] = sortedByTimeCopy[j]][0]
                        console.log(`After : ${sortedByTimeCopy[j].claps.length} - ${sortedByTimeCopy[i].claps.length}`)
                    }
                }
            }
            if(number <= sortedByTimeCopy.length ){
                res.send(sortedByTimeCopy.slice(0,number - 1))
            }else{
                res.send(sortedByTimeCopy)
            }
        }catch(err){
            res.send(err)
        }

    }
    async search(req,res){
        const {tags,keyword,sortBy,page} = req.body;
        const perPage = 5;
        let filteredByTagAndTime;
        let filteredByTagAndClap;
        if(sortBy === "clap"){
            try{
                const filteredByTag = await postModel.find({ "tags" : { $all : tags } })
                // console.log(filteredByTag)
                const filteredByTagCopy = [...filteredByTag];
                // console.log(filteredByTagCopy)
                for(let i = 0; i < filteredByTagCopy.length - 1; i++){
                    // console.log(i)
                    for(let j = i; j < filteredByTagCopy.length;j++){
                        console.log(j)
                        // console.log(`Before : ${filteredByTagCopy[j].claps.length} - ${filteredByTagCopy[i].claps.length}`)
                        if(filteredByTagCopy[j].claps.length > filteredByTagCopy[i].claps.length){
                            // console.log("swap")
                            filteredByTagCopy[j] = [filteredByTagCopy[i],filteredByTagCopy[i] = filteredByTagCopy[j]][0]
                            // console.log(`After : ${filteredByTagCopy[j].claps.length} - ${filteredByTagCopy[i].claps.length}`)
                        }
                    }
                }
                filteredByTagAndClap = filteredByTagCopy;
                const finalFiltered = filteredByTagAndClap.filter((post) => {
                    return post.title.toUpperCase().includes(keyword.toUpperCase())
                })
                res.send(finalFiltered.slice(perPage * page, perPage * (page + 1)))
                
            }catch(err){
                console.log(err)
            }
        }else if (sortBy === "time"){
            try{
                filteredByTagAndTime = await postModel.find({ "tags" : { $all : tags } }).sort([["postTime" , -1]]);
                const finalFiltered = filteredByTagAndTime.filter((post) => {
                        return post.title.toUpperCase().includes(keyword.toUpperCase())
                    })
                    res.send(finalFiltered)
                
            }catch(err){
                console.log(err)
            }
        }
}}
export default new Controller();