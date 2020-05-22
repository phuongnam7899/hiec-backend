import postModel from "../../models/post";
import userModel from "../../models/user";
import classModel from "../../models/class";
const nodemailer = require("nodemailer");
var moment = require('moment');

export class Controller {
  // async ranking(req, res) {

  //     // let t1,t2,t3;
  //     const now = Date.now();
  //     const week = 604800000;
  //     const month = 2629743830;
  //     const year = 31556926000;
  //     //  need username,ava,score
  //     async function findUserMostPosts(limit) {
  //         const time = now - limit;
  //         try {
  //             const findPost = await postModel.find({ postTime: { $gte: (now - limit) } }).sort("user").populate("user")
  //                 let object = {
  //                 }
  //                 let arrayPosts = [];
  //                 let count = 0;
  //                 findPost.forEach((post) => {
  //                     count++
  //                     if ( post.user && (post.user._id !== object.userId)) {
  //                         arrayPosts.push(object)
  //                         object = {
  //                             userId: post.user._id,
  //                             score: post.claps.length,
  //                             avatar : post.user.profile.avatar,
  //                             name : post.user.profile.name,
  //                         }
  //                     } else if( post.user && (post.user._id == object.userId)){
  //                         object.score+= post.claps.length;
  //                     }
  //                     if (count == findPost.length) {
  //                         arrayPosts.push(object)
  //                     }
  //                 })
  //                 arrayPosts.sort(function Value(a, b) {
  //                     return b.score - a.score;
  //                 })

  //                 return arrayPosts.splice(1).slice(0,10);

  //         }catch(err){
  //             console.log(err)
  //             return err
  //         }
  //     }
  //     let respondData = {
  //         // week: await findUserMostPosts(week),
  //         month: await findUserMostPosts(month),
  //         // year: await findUserMostPosts(year),
  //     }
  //     res.status(200).send(respondData)
  // }
  async getClassById(req, res) {
    const classId = req.params.id;
    const classFound = await classModel.findById(classId);
    res.send(classFound);
  }
  async createClass(req, res) {
    const { name, code, students } = req.body;
    const newClass = await classModel.create({
      name,
      code,
      students,
    });
    res.send(newClass);
  }

  async updateClass(req,res){
    //Tạm thời chỉ cho update name và code
    const {id, name, code} = req.body
    console.log(name)
    try{
      const newClass = await classModel.findByIdAndUpdate(id,{name, code})
      res.send(newClass)
    }catch(err){
      res.send(err)
    }
  }

  getAll(req, res) {
    const { page, perPage } = req.query;
    const options = {
      page: page,
      limit: perPage,
    };
    classModel.paginate({}, options, function (err, result) {
      // result.docs
      // result.totalDocs = 100
      // result.limit = 10
      // result.page = 1
      // result.totalPages = 10
      // result.hasNextPage = true
      // result.nextPage = 2
      // result.hasPrevPage = false
      // result.prevPage = null
      // result.pagingCounter = 1
      res.send({
        total: result.totalDocs,
        docs: result.docs,
      });
    });
  }
  async sendMail(req, res) {
    const { email } = req.body;
    console.log(email)
    //em quên pass gmail nên dùng tài khoản test
    let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: `${email}`,
    subject: "Hello ✔",
    text: "Hello world?",
    html: `<b>Hello world. Message sent successfully at ${moment().format('MMMM Do YYYY, h:mm:ss a')}</b>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // tài khoản test không gửi được mail thật, nếu gửi thành công sẽ xem được trong previewLink
  res.send({
    info,
    previewLink: nodemailer.getTestMessageUrl(info)
  })
  }
}

export default new Controller();
