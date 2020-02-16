import newsModel from "../../models/news"
import userModel from "../../models/user"

export class Controller {
    async createNewNews(req,res){
        const {category,tags,postTime,title,content} = req.body;
        const emptyNews = {
            viewer : [],
            clap : [],
            comments : []
        }
            try{
                const newNews = await newsModel.create({...emptyNews,tags,postTime,title,content,category})
                res.send(newNews)
            }catch(err){
                res.send(err)
            }
            
    }

    getNewsByID(req,res){
        const newsID = req.params.id;
        // console.log(newsID)
        if(newsID) {
            newsModel.findById(newsID).then((newsFound) => {
                if(newsFound) res.send(newsFound)
                else res.send("News not found")
            }).catch(err => res.send(err))
        }
    }
    async deleteNewsByID(req,res){
        //TO-DO : user gửi req phải là chủ của bài viết
        const newsID = req.params.id;
        try{
            const deletedNews = await newsModel.findByIdAndDelete(newsID)
            res.send(deletedNews) 
        }catch (err){
            res.send(err)
        }
    }
    async addClap(req,res){
        //TO-DO : user cần tồn tại 
        const {userID,newsID} = req.body;
        try{
            const newsBefore = await newsModel.findById(newsID);
            console.log(newsBefore)
            if(!newsBefore) res.send("news not found")
            else{
                if(!newsBefore.clap.includes(userID)){
                    // console.log(newsBefore.claps)
                    // console.log(userID)
                    const clapsBefore = [...newsBefore.clap];
                    clapsBefore.push(userID)
                    console.log(clapsBefore)
    
                    newsModel.findByIdAndUpdate(newsID,{clap : clapsBefore}).then((beforeUpdated) => {
                        res.send({message:"updated successfully" ,data:beforeUpdated})
                    }).catch((err) => res.send(err))
                }else{
                    res.send({message :"user clapped before"})
                }
        }
        }catch(err){
            res.send(err)
        }

    }

    async addComment(req,res){
        //TO-DO : check người dùng có tồn tại
        const {newsID, user, content, time} = req.body;
        const emptyComment = {
            replies : []
        }
        const newComment = {...emptyComment, user, content, time};
        try {
            const news = await newsModel.findById(newsID);
            const commentsBefore = [...news.comments];
            commentsBefore.push(newComment);
            newsModel.findByIdAndUpdate(newsID,{comments : commentsBefore}).then((beforeUpdated) => {
                res.send({message:"updated successfully"})
            }).catch((err) => res.send(err))
        } catch (error) {
            res.send(error)
        }
    }
    async addReplyToComment(req,res){
        //TO-DO : check người dùng có tồn tại
        const {newsID, commentID, user, content, time} = req.body;
        // const emptyComment = {
        //     replies : []
        // }
        const newReply = {user, content, time};
        try {
            const news = await newsModel.findById(newsID);
            const commentsBefore = [...news.comments];
            for( let i = 0; i < commentsBefore.length; i++){
                if(commentsBefore[i]._id == commentID){
                    // console.log(commentsBefore[i]._id)
                    // console.log(commentID)
                    // console.log("---")
                    commentsBefore[i].replies.push(newReply);
                    break;
                }
            }
            newsModel.findByIdAndUpdate(newsID,{comments : commentsBefore}).then((beforeUpdated) => {
                res.send({message:"updated successfully",data:beforeUpdated})
            }).catch((err) => res.send(err))
        } catch (error) {
            res.send(error)
        }
    }
    async addView(req,res){
        //TO-DO : user cần tồn tại 
        const {userID,newsID} = req.body;
        try{
            const newsBefore = await newsModel.findById(newsID);
            if(!newsBefore) res.send("news not found")
            else{
                if(!newsBefore.viewer.includes(userID)){
                    // console.log(newsBefore.claps)
                    // console.log(userID)
                    const viewersBefore = [...newsBefore.viewer];
                    viewersBefore.push(userID)
                    console.log(viewersBefore)
    
                    newsModel.findByIdAndUpdate(newsID,{viewer : viewersBefore}).then((beforeUpdated) => {
                        res.send({message:"updated successfully" ,data:beforeUpdated})
                    }).catch((err) => res.send(err))
                }
                else{
                    res.send({message:"viewed before",data:newsBefore})
                }
        }

        }catch(err){
            res.send(err)
        }
    }
    async searchByTag(req,res){
        const {tagList,category} = req.body;
        console.log(tagList)
        try{
            const newss = await newsModel.find({ "tags" : { $all : tagList } , category : category })
            console.log(newss)
            res.send(newss)
        }catch(err){
            res.send(err)
        }
    }
    async searchByKeyword(req,res){
        const keyword = req.query.keyword;
        const category = req.query.category;
        console.log(keyword)
        try{
            const newss = await newsModel.find({category : category});
            const foundList = newss.filter((news) => {
                return news.title.toUpperCase().includes(keyword.toUpperCase())
            })
            res.send(foundList)
        }catch(err){
            res.send(err)
        }
    }

    async getRecent(req,res){
        const number = req.body.number;
        const sortedByTime = await newsModel.find().sort([["postTime" , -1]]).limit(number)
        res.send(sortedByTime)
    }
    async getHotNews(req,res){
        const {number,category,limit} = req.body;
        console.log(req.body)
        try{
            const sortedByTime = await newsModel.find({category : category}).sort([["postTime" , -1]]).limit(limit)
            const sortedByTimeCopy = [...sortedByTime];
            console.log(sortedByTimeCopy)
            for(let i = 0; i < sortedByTimeCopy.length - 1; i++){
                // console.log(i)
                for(let j = i; j < sortedByTimeCopy.length;j++){
                    // console.log(j)
                    // console.log(`Before : ${sortedByTimeCopy[j].clap.length} - ${sortedByTimeCopy[i].clap.length}`)
                    if(sortedByTimeCopy[j].clap.length > sortedByTimeCopy[i].clap.length){
                        // console.log("swap")
                        sortedByTimeCopy[j] = [sortedByTimeCopy[i],sortedByTimeCopy[i] = sortedByTimeCopy[j]][0]
                        // console.log(`After : ${sortedByTimeCopy[j].clap.length} - ${sortedByTimeCopy[i].clap.length}`)
                    }
                }
            }
            if(number <= sortedByTimeCopy.length ){
                res.send(sortedByTimeCopy.slice(0,number))
            }else{
                res.send(sortedByTimeCopy)
            }
        }catch(err){
            res.send(err)
        }

    }
    async search(req,res){
        const {tags,keyword,sortBy,page} = req.body;
        console.log(page)
        console.log(tags)
        console.log(tags === ["energy"])
        console.log(keyword === "")
        console.log(sortBy === "claps")
        console.log(page === 0)
        const perPage = 5;
        let filteredByTagAndTime;
        let filteredByTagAndClap;
        if(sortBy === "claps"){
            try{
                const filteredByTag = tags.length > 0 ? await newsModel.find({ "tags" : { $all : tags } }).populate("user") : await newsModel.find().populate("user")
                console.log(filteredByTag)
                const filteredByTagCopy = [...filteredByTag];
                // console.log(filteredByTagCopy)
                for(let i = 0; i < filteredByTagCopy.length; i++){
                    // console.log(i)
                    for(let j = i; j < filteredByTagCopy.length;j++){
                        // console.log(j)
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
                // console.log(page)
                // console.log(perPage)

                console.log(finalFiltered.slice(perPage * page, perPage * (page + 1)))
                res.send(finalFiltered.slice(perPage * page, perPage * (page + 1)))
                
            }catch(err){
                console.log(err)
            }
        }else if (sortBy === "time"){
            try{
                filteredByTagAndTime = tags.length > 0 ? await newsModel.find({ "tags" : { $all : tags } }).sort([["postTime" , -1]]).populate("user") : await newsModel.find().sort([["postTime" , -1]]).populate("user") ;
                const finalFiltered = filteredByTagAndTime.filter((post) => {
                        return post.title.toUpperCase().includes(keyword.toUpperCase())
                    })
                    res.send(finalFiltered)
                
            }catch(err){
                console.log(err)
            }
        }
}
}
export default new Controller();