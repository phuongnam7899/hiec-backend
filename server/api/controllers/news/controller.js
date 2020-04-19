import newsModel from "../../models/news";
import userModel from "../../models/user";
import tokenModel from "../../models/token";

export class Controller {
  async createNewNews(req, res) {
    const { category, tags, postTime, title, content, token, userID } = req.body;
    const emptyNews = {
      viewer: []
    };

    const tokenFound = await  tokenModel.findOne({ token: token })
    const userFound =  await userModel.findById(userID)

    try {
      if (tokenFound && tokenFound.userID === userID && userFound.isAdmin) {
     
        const newNews = await newsModel.create({
          ...emptyNews,
          tags,
          postTime,
          title,
          content,
          category,
          isGhimed: false,
        });
       
        res.send(newNews);
      } else {
        throw new Error({ message: "hacker khong co phan su o day" })
      }
    } catch (err) {
      res.send(err);
    }
  }

  getNewsByID(req, res) {
    const newsID = req.params.id;
    // console.log(newsID)
    if (newsID) {
      newsModel
        .findById(newsID)
        .then(newsFound => {
          if (newsFound) res.send(newsFound);
          else res.send("News not found");
        })
        .catch(err => res.send(err));
    }
  }
  async deleteNewsByID(req, res) {
    //TO-DO : user gửi req phải là chủ của bài viết
    const newsID = req.params.id;
    const { userID, token } = req.params;

    const tokenFound = await tokenModel.findOne({ token: token })
    const userFound = await userModel.findById(userID)
    
    try {
      if (tokenFound && tokenFound.userID === userID && userFound.isAdmin) {
        const deletedNews = await newsModel.findByIdAndDelete(newsID);
       
        res.send(deletedNews);
      } else {
        throw new Error({ message: "Hacker ???" })
      }
    } catch (err) {
      res.send(err);
    }
  }
  async addView(req, res) {
    //TO-DO : user cần tồn tại
    const { userID, newsID, token } = req.body;
    const tokenFound = await tokenModel.findOne({ token: token })
    const userFound = await userModel.findById(userID)
    try {
      if (tokenFound && tokenFound.userID === userID) 
      {
      const user = await userModel.findById(userID);
      if (user) {
        try {
          const newsBefore = await newsModel.findById(newsID);
          if (!newsBefore) res.send("news not found");
          else {
            if (!newsBefore.viewer.includes(userID)) {
              // console.log(newsBefore.claps)
              // console.log(userID)
              const viewersBefore = [...newsBefore.viewer];
              viewersBefore.push(userID);
              // console.log(viewersBefore)

              newsModel
                .findByIdAndUpdate(newsID, { viewer: viewersBefore })
                .then(beforeUpdated => {
                  res.send({
                    message: "updated successfully",
                    data: beforeUpdated
                  });
                })
                .catch(err => res.send(err));
            } else {
              res.send({ message: "viewed before", data: newsBefore });
            }
          }
        } catch (err) {
          res.send(err);
        }
      } else {
        res.send({ success: 0, message: "user undefined" })
      }
    }else{
      res.send({success : 0,message : "user undefined - no token found"})
    }
    } catch (err) {
      console.log(err);
    }
  }
  async searchByTag(req, res) {
    const { tagList, category } = req.body;
    // console.log(tagList)
    try {
      const newss = await newsModel.find({
        tags: { $all: tagList },
        category: category
      });
      // console.log(newss)
      res.send(newss);
    } catch (err) {
      res.send(err);
    }
  }
  async searchByKeyword(req, res) {
    const keyword = req.query.keyword;
    const category = req.query.category;
    // console.log(keyword)
    try {
      const newss = await newsModel.find({ category: category });
      const foundList = newss.filter(news => {
        return news.title.toUpperCase().includes(keyword.toUpperCase());
      });
      res.send(foundList);
    } catch (err) {
      res.send(err);
    }
  }

  async getRecent(req, res) {
    const { number, category } = req.body;
    const sortedByTime = await newsModel
      .find({ category: category })
      .sort([["postTime", -1]])
      .limit(number);
    let array = [];
    sortedByTime.forEach(post => {
      let newPost = JSON.parse(JSON.stringify(post));
      delete newPost.tags;
      delete newPost.viewers;  
      array.push(newPost)
    });
    res.send(array);
  }

  async ghimNews(req, res) {
    const { id, token, userID } = req.body;
    const tokenFound = await tokenModel.findOne({ token: token })
    const userFound = await userModel.findById(userID)

    try {
      if (tokenFound && tokenFound.userID === userID && userFound.isAdmin) {
        const news = await newsModel.findById(id);
        if (news) {
          
          const updateOld = await newsModel.findOneAndUpdate({ isGhimed: true, category: news.category }, { isGhimed: false });
          const updateNew = await newsModel.findByIdAndUpdate(id, { isGhimed: true })
          res.send("Update bài ghim thành công");
        } else {
          throw new Error({ "message": "ID SAI" });
        }
      } else {
        throw new Error({ "message": "THIẾU/SAI TOKEN" });
      }

    } catch (err) {
      res.send(err)
    }
  }

  async getGhimNews(req, res) {
    const { category } = req.params;
    try {
      const ghimNews = await newsModel.findOne({ isGhimed: true, category: category });
      if (ghimNews) {
        res.send(ghimNews)
      } else {
        throw new Error("Not found ghim News")
      }
    } catch (err) {
      res.send(err)
    }
  }

  async getHotNews(req, res) {
    const { number, category, limit } = req.body;
    // console.log(req.body);
    try {
      const sortedByTime = await newsModel
        .find({ category: category })
        .sort([["postTime", -1]])
        .limit(limit);
      const sortedByTimeCopy = [...sortedByTime];
      // console.log(sortedByTimeCopy)
      for (let i = 0; i < sortedByTimeCopy.length - 1; i++) {
        // console.log(i)
        for (let j = i; j < sortedByTimeCopy.length; j++) {
          // console.log(j)
          // console.log(`Before : ${sortedByTimeCopy[j].clap.length} - ${sortedByTimeCopy[i].clap.length}`)
          if (
            sortedByTimeCopy[j].viewer.length >
            sortedByTimeCopy[i].viewer.length
          ) {
            // console.log("swap")
            sortedByTimeCopy[j] = [
              sortedByTimeCopy[i],
              (sortedByTimeCopy[i] = sortedByTimeCopy[j])
            ][0];
            // console.log(`After : ${sortedByTimeCopy[j].clap.length} - ${sortedByTimeCopy[i].clap.length}`)
          }
        }
      }
      let array = [];
      sortedByTimeCopy.forEach(post => {
        let newPost = JSON.parse(JSON.stringify(post));
        delete newPost.tags;
        delete newPost.viewers;  
        array.push(newPost)
      });
      res.send(array);
      if (number <= sortedByTimeCopy.length) {
        // console.log(sortedByTimeCopy.slice(0, number));
        res.send(array.slice(0, number));
      } else {
        // console.log(sortedByTimeCopy);
        res.send(array);
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
  async search(req, res) {
    const { tags, keyword, sortBy, page, category } = req.body;
    // console.log(req.body);
    const perPage = 5;
    let filteredByTagAndTime;
    let filteredByTagAndClap;
    if (sortBy === "claps") {
      try {
        const filteredByTag =
          tags.length > 0
            ? await newsModel.find({ tags: { $all: tags }, category: category })
            : await newsModel.find({ category: category });
        // console.log(filteredByTag);
        const filteredByTagCopy = [...filteredByTag];
        // console.log(filteredByTagCopy)
        for (let i = 0; i < filteredByTagCopy.length; i++) {
          // console.log(i)
          for (let j = i; j < filteredByTagCopy.length; j++) {
            // console.log(filteredByTagCopy[j])
            // console.log(`Before : ${filteredByTagCopy[j].claps.length} - ${filteredByTagCopy[i].claps.length}`)
            if (
              filteredByTagCopy[j].viewer.length >
              filteredByTagCopy[i].viewer.length
            ) {
              // console.log("swap")
              filteredByTagCopy[j] = [
                filteredByTagCopy[i],
                (filteredByTagCopy[i] = filteredByTagCopy[j])
              ][0];
              // console.log(`After : ${filteredByTagCopy[j].claps.length} - ${filteredByTagCopy[i].claps.length}`)
            }
          }
        }
        filteredByTagAndClap = filteredByTagCopy;
        const finalFiltered = filteredByTagAndClap.filter(post => {
          return post.title.toUpperCase().includes(keyword.toUpperCase());
        });
        // console.log(page)
        // console.log(perPage)

        // console.log(finalFiltered.slice(perPage * page, perPage * (page + 1)))
        res.send(finalFiltered.slice(perPage * page, perPage * (page + 1)));
      } catch (err) {
        console.log(err);
      }
    } else if (sortBy === "time") {
      try {
        filteredByTagAndTime =
          tags.length > 0
            ? await newsModel
              .find({ tags: { $all: tags }, category: category })
              .sort([["postTime", -1]])
            : await newsModel
              .find({ category: category })
              .sort([["postTime", -1]]);
        const finalFiltered = filteredByTagAndTime.filter(post => {
          return post.title.toUpperCase().includes(keyword.toUpperCase());
        });
        res.send(finalFiltered.slice(perPage * page, perPage * (page + 1)));
      } catch (err) {
        console.log(err);
      }
    }
  }


}
export default new Controller();
