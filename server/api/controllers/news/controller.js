import newsModel from "../../models/news";
import userModel from "../../models/user";

export class Controller {
  async createNewNews(req, res) {
    const { category, tags, postTime, title, content } = req.body;
    const emptyNews = {
      viewer: []
    };
    try {
      const newNews = await newsModel.create({
        ...emptyNews,
        tags,
        postTime,
        title,
        content,
        category
      });
      res.send(newNews);
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
    try {
      const deletedNews = await newsModel.findByIdAndDelete(newsID);
      res.send(deletedNews);
    } catch (err) {
      res.send(err);
    }
  }
  async addView(req, res) {
    //TO-DO : user cần tồn tại
    const { userID, newsID } = req.body;
    try {
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
      }else{
          res.send({success : 0, message : "user undefined"})
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
    res.send(sortedByTime);
  }
  async getHotNews(req, res) {
    const { number, category, limit } = req.body;
    console.log(req.body);
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
      if (number <= sortedByTimeCopy.length) {
        console.log(sortedByTimeCopy.slice(0, number));
        res.send(sortedByTimeCopy.slice(0, number));
      } else {
        console.log(sortedByTimeCopy);
        res.send(sortedByTimeCopy);
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
  async search(req, res) {
    const { tags, keyword, sortBy, page, category } = req.body;
    console.log(req.body);
    const perPage = 5;
    let filteredByTagAndTime;
    let filteredByTagAndClap;
    if (sortBy === "claps") {
      try {
        const filteredByTag =
          tags.length > 0
            ? await newsModel.find({ tags: { $all: tags }, category: category })
            : await newsModel.find({ category: category });
        console.log(filteredByTag);
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
