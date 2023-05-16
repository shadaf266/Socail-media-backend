import axios from "axios";
import { Request, Response } from "express";
import cron from "node-cron"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const fetchGroupsLkd =async (req: Request, res: Response) => {

    axios({
      url: `https://api.linkedin.com/v2/groupMemberships?q=member&member=urn:li:person:${req.body.personURN}&membershipStatuses=MEMBER`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
      },
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        res.send(err.data);
      });
  }

export const fetchPagesLkd = (req: Request, res: Response) => {
    axios({
      url: "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&state=APPROVED&projection=(*,elements*(*,organizationalTarget~(*)))",
      method: "get",
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
      },
    })
      .then((response) => res.send(response.data))
      .catch((err) => res.send(err.data));
  }


export const postTextLkd = (req: Request, res: Response) => {
    axios({
      url: "https://api.linkedin.com/rest/posts",
      method: "POST",
      data: {
        author: req.body.id,
        commentary: req.body.content,
        visibility: 'PUBLIC',
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      },
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
        "LinkedIn-Version": "202301",
      },
    })
      .then((response) => {
        res.send("completed");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

export const postPollLkd = (req:Request, res:Response) => {
    //console.log(req.body);
    let options: Array<object> = [];
    req.body.pollOptions.map((e: string) => {
      options.push({ text: e });
    });
    axios({
      url: "https://api.linkedin.com/rest/posts",
      method: "POST",
      data: {
        author: req.body.id,
        commentary: req.body.title,
        visibility: req.body.scope,
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
        content: {
          poll: {
            question: req.body.question,
            options: options,
            settings: { duration: "THREE_DAYS" },
          },
        },
      },
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202301",
      },
    })
      .then((response) => {
        console.log(response.data);
        res.send("completed");
      })
      .catch((e) => {
        console.log(e);
        res.send("Error");
      });
  }

export const postArticleLinkLkd =async (req: Request, res: Response) => {
  await prisma.facebook.create({data:{
    posttype:'image',
    accesstoken:req.body.access_token,
    entityid:'k',
    time:'k',
    message:'k',
    file:'k',
    poststatus:'k',
  }})
    axios({
      url: "https://api.linkedin.com/rest/posts",
      method: "POST",
      data: {
        author: req.body.id,
        commentary: req.body.text,
        visibility: req.body.scope,
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        content: {
          article: {
            source: req.body.url,
            title: req.body.title,
            description: req.body.content,
          },
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      },
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202301",
      },
    })
      .then(() => {
        res.send("completed");
      })
      .catch((err) => {
        console.log(err);
        res.send("Error");
      });
  }

export const postArticleImageLkd =async(req:Request, res:Response) => {
  //console.log(req.body.description);
  await axios({
    url: "https://api.linkedin.com/rest/posts",
    method: "POST",
    data: {
      author: req.body.id,
      commentary: req.body.title,
      visibility: req.body.scope,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        media: {
          altText: req.body.altText,
          id: req.body.asset,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    },
    headers: {
      Authorization: "Bearer " + req.body.accessToken,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202301",
    },
  })
    .then((response) => {
      console.log(response.data);
      res.send("completed");
    })
    .catch((e) => {
      console.log(e);
      res.send("Error");
    });
}

  export const postImageStepOneLkd = (req: Request, res:Response) => {
   // console.log(req.body);
    axios({
      url: "https://api.linkedin.com/rest/images?action=initializeUpload",
      method: "POST",
      data: {
        initializeUploadRequest: {
          owner: req.body.id,
        },
      },
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
        "LinkedIn-Version": "202301",
      },
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  export const imageUploadLkd = (req:Request, res:Response) => {
    
    
    axios({
      url: req.body.url,
      method: "POST",
      data: req.file?.buffer,
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "Content-Type": req?.file?.mimetype,
      }, 
    })
      .then(() => {
        res.send("Posted");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  export const postVideoStepOneLkd = (req:Request, res:Response) => {
    //console.log(req.body);
    axios({
      url: "https://api.linkedin.com/rest/videos?action=initializeUpload",
      method: "POST",
      data: {
        initializeUploadRequest: {
          owner: req.body.id,
          fileSizeBytes: 1055736,
          uploadCaptions: false,
          uploadThumbnail: false,
        },
      },
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
        "LinkedIn-Version": "202301",
      },
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  export const postVideoStepTwoLkd = (req:Request, res:Response) => {
   // console.log(req.body);
  //console.log(req.file);
    axios({
      url: req.body.url,
      method: "POST",
      data: req.file?.buffer,
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "Content-Type": " application/octet-stream",
      },
    })
      .then((response) => {
        res.send(response.headers.etag);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  export const postVideoFinalizeLkd =(req:Request, res:Response) => {
    axios({
      url: "https://api.linkedin.com/v2/videos?action=finalizeUpload",
      method: "POST",
      data: {
        finalizeUploadRequest: {
          video: req.body.asset,
          uploadToken: "",
          uploadedPartIds: [req.body.eTag],
        },
      },
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
      },
    })
      .then((response) => {
        console.log(response);
        res.send("Posted");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  export const postArticleVideoLkd = (req:Request, res:Response) => {
    //console.log(req.body);
    axios({
      url: "https://api.linkedin.com/rest/posts",
      method: "POST",
      data: {
        author: req.body.id,
        commentary: req.body.title,
        visibility: req.body.scope,
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        content: {
          media: {
            title: req.body.videoTitle,
            id: req.body.asset,
          },
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      },
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202301",
      },
    })
      .then((response) => {
        //console.log(response.data);
        res.send("completed");
      })
      .catch((e) => {
        //console.log(e);
        res.send("Error");
      });
  }


    
cron.schedule('00 19 * * *',async ()=>{
  console.log('hitted')
  const data = await prisma.linkedin.findMany({})
  
  data.map(async(each)=>{
    if(each.poststatus==='pending'){
      console.log(each.time)
      cron.schedule(each.time, async()=>{
        console.log('hitted2')
    await axios({
      url: "https://api.linkedin.com/rest/posts",
      method: "POST",
      data: {
        author: each.entityid,
        commentary: each.message,
        visibility: 'PUBLIC',
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        content: {
          media: {
            altText: 'image',
            id: each.file,
          },
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      },
      headers: {
        Authorization: "Bearer " + each.accesstoken,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202301",
      },
    }).then(async()=>{
      await prisma.linkedin.updateMany({
        where:{
          id:each.id
        },
        data:{
          poststatus:"success"
        }
      })
    }).catch(async ()=>{
      await prisma.linkedin.updateMany({
        where:{
          id:each.id
        },
        data:{
          poststatus:"error"
        }
      })
    })})}
  })
  
     })
