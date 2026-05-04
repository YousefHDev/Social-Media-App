import path  from 'node:path'
import connectDB from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import PostController from './modules/post/post.controller.js'
import { globalErrorHandling } from './utilies/error.Response.js'
import cors from 'cors';
import usermodel from './DB/model/User.model.js'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import {createHandler} from 'graphql-http'
import playground from 'graphql-playground-middleware-express'
import { endpoint } from './modules/user/user.auth.js'
import { schema } from './modules/app.graph.js'

const limiter = rateLimit({
    limit : 5,
    windowMs:2*60*1000,
    message : "rate limit reached",
    statusCode : 429
})
const postlimiter = rateLimit({
    limit : 2,
    windowMs:2*60*1000
})
const bootstrap = (app, express) => {
// let whitelist = process.env.WHITELIST.split(",") || [];
// console.log(whitelist);
// app.use(async (req, res, next) => {
//     console.log(req.header('origin'));
  
//     if (!whitelist.includes(req.header('origin'))) {
//       return next(new Error('Not Allowed By CORS', { status: 403 }));
//     }
  
//     await res.header('Access-Control-Allow-Origin', req.header('origin'));
//     await res.header('Access-Control-Allow-Headers', '*');
//     await res.header('Access-Control-Allow-Private-Network', 'true');
//     await res.header('Access-Control-Allow-Methods', '*');
  
//     console.log("Origin Work");
//     next();
//   });
  

// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
    app.use(cors())
    app.use('/auth',limiter)
    app.use('/post',postlimiter)
    app.use(helmet())

    // async function test(params) {
    //     const user = await usermodel.insertMany([{
    //         username :"Yousef Hesham",
    //         email : `${Date.now()}kjsj@gmail.com`,
    //         password : "ewaer"
    //     }])
    // }
    // test()

    app.use('uploads',express.static(path.resolve("../src/uploads")))
    app.use(express.json())
    
    app.get("/playground" , playground.default({endpoint:'/graphql'}))
    app.use("/graphql" ,createHandler({schema:schema}) )

    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/post", PostController)



    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })



    connectDB()
    //app.use(globalErrorHandling)
    


}

export default bootstrap
