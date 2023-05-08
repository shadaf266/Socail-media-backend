//Crucial Imports
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import cors from "cors";
import cron from "node-cron"
import { fetchGroupsLkd, fetchPagesLkd, imageUploadLkd, postArticleImageLkd, postArticleLinkLkd, postArticleVideoLkd, postImageStepOneLkd, postPollLkd, postTextLkd, postVideoFinalizeLkd, postVideoStepOneLkd, postVideoStepTwoLkd,  } from "./controllers/linkedin";
import { fetchGroupsFb, fetchPagesFb, postImageFb, postTextFb } from "./controllers/facebook";
import { scheduleFbImage } from "./controllers/facebook/schedule";
import { scheduleLkdImage } from "./controllers/linkedin/schedule";
import * as dotenv from 'dotenv'
dotenv.config()

//Declaring Important variables
const upload = multer.diskStorage({
  destination:'/uploads'
});
const app: Express = express();
const port = process.env.PORT

//Using Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.raw({
    type: "image/jpg",
    limit: "10mb",
  })
);
app.use(
  cors({
    origin: "*",
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));
//Routes-->
app.get("/",(req:Request,res:Response)=>{
  res.send("welcome to backend")
})

app.post("/saveGroups", fetchGroupsLkd);

app.post("/savePages", fetchPagesLkd);

app.post("/postText",postTextLkd)

app.post("/postPoll", postPollLkd);

app.post("/postArticle/Link", postArticleLinkLkd);

app.post("/postArticle/Image", postArticleImageLkd);

app.post("/postImageStepOne", postImageStepOneLkd);

app.post("/imageUpload",multer({ storage: multer.memoryStorage() }).single("file"), imageUploadLkd);

//Video Apis
app.post("/postVideoStepOne", postVideoStepOneLkd);

app.post("/videoUploadStepTwo",multer({ storage: multer.memoryStorage() }).single("file"), postVideoStepTwoLkd);

app.post("/videoFinalizeStepThree", postVideoFinalizeLkd);

app.post("/postArticle/Video", postArticleVideoLkd);

app.post("/fbfetchGroups", fetchGroupsFb);

app.post("/fbfetchPages",fetchPagesFb);

app.post("/postTextFb",postTextFb);

app.post("/postImageFb",multer({ storage: multer.memoryStorage() }).single("file"), postImageFb);

//schedule apis

app.post("/schedulefbimage",multer({ storage: multer.memoryStorage() }).single("file"),scheduleFbImage)

app.post("/schedulelkdimage",scheduleLkdImage)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}/`);
});

