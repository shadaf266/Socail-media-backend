import axios from "axios";
import { Request, Response } from "express";
import cron from "node-cron"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const scheduleFbImage = async(req:Request, res:Response) => {
    //console.log(req.body.description);
    //console.log(req.body.form.file)
    console.log('api called')
    await prisma.facebook.create({data:{
    posttype:'image',
    accesstoken: req.body.accessToken,
    entityid:req.body.id,
    time:req.body.time,  
    message:req.body.message,
    file:'l', 
    poststatus:'pending'
    }}).then(
        ()=>{res.send('successfully scheduled facebook')
        console.log('hitted')
    }
    ).catch(
       ()=> res.send('error in scheduling')
    )
}
