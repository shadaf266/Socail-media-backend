import axios from "axios";
import { Request, Response } from "express";
import cron from "node-cron"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const scheduleLkdImage = async(req:Request,res:Response) =>{
    console.log(req,res)
    await prisma.linkedin.create({data:{
        posttype:'image',
        accesstoken: req.body.accessToken,
        entityid:req.body.id,
        time:req.body.time,  
        message:req.body.message,
        file:req.body.asset, 
        poststatus:'pending'
        }}).then(
            ()=>res.send('successfully scheduled')
        ).catch(
           ()=> res.send('error in scheduling')
        )
        
}