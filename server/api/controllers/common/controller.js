import postModel from "../../models/post";
import userModel from "../../models/user";
import classModel from "../../models/class";
const nodemailer = require("nodemailer");
var moment = require('moment');

export class Controller {
  async ranking(req, res) {

      // let t1,t2,t3;
      const now = Date.now();
      const week = 604800000;
      const month = 2629743830;
      const year = 31556926000;
      //  need username,ava,score
      async function findUserMostPosts(limit) {
          const time = now - limit;
          try {
              const findPost = await postModel.find({ postTime: { $gte: (now - limit) } }).sort("user").populate("user")
                  let object = {
                  }
                  let arrayPosts = [];
                  let count = 0;
                  findPost.forEach((post) => {
                      count++
                      if ( post.user && (post.user._id !== object.userId)) {
                          arrayPosts.push(object)
                          object = {
                              userId: post.user._id,
                              score: post.claps.length,
                              avatar : post.user.profile.avatar,
                              name : post.user.profile.name,
                          }
                      } else if( post.user && (post.user._id == object.userId)){
                          object.score+= post.claps.length;
                      }
                      if (count == findPost.length) {
                          arrayPosts.push(object)
                      }
                  })
                  arrayPosts.sort(function Value(a, b) {
                      return b.score - a.score;
                  })

                  return arrayPosts.splice(1).slice(0,10);

          }catch(err){
              console.log(err)
              return err
          }
      }
      let respondData = {
          // week: await findUserMostPosts(week),
          // month: await findUserMostPosts(month),
          year: await findUserMostPosts(year),
      }
      res.status(200).send(respondData)
  }
}

 

export default new Controller();
