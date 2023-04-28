import axios from "axios";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const fetchGroupsFb= async (req: Request, res: Response) => {

    axios({
      url: `https://graph.facebook.com/${req.body.id}/groups`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
      },
    })
      .then((response) => {
        console.log(response)
        res.send(response.data);
      })
      .catch((err) => {
        res.send(err.data);
      });
  }

export const fetchPagesFb =(req: Request, res: Response) => {
    axios({
      url: `https://graph.facebook.com/${req.body.id}/accounts`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
      },
    })
      .then((response) => {
        console.log(response)
        res.send(response.data);
      })
      .catch((err) => {
        res.send(err.data);
      });
  }

export const postTextFb = (req: Request, res: Response) => {
    axios({
      url: `https://graph.facebook.com/${req.body.id}/feed`,
      method: "POST",
      data:{message:req.body.content},
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
      },
    })
      .then((response) => {
        console.log('success')
        res.send(response.data);
      })
      .catch((err) => {
        res.send(err.data);
      });
  }

export const postImageFb = (req: Request, res: Response) => {

    const photoData: any = new Blob([req.body.file], { type: 'image/jpeg' })
    const formData = new FormData
    console.log(photoData);
    
    formData.append('source',photoData)
    formData.append('message',req.body.message)
    formData.append('access_token',req.body.accessToken)
    console.log(req.body.id)
    console.log(req.body.message)
    console.log(req.body.accessToken)
    console.log(formData)
       axios({
          url:`https://graph.facebook.com/${req.body.id}/photos?access_token=${req.body.accessToken}`, 
          method: 'POST',
          data:formData,
      })
          .then((res: any) => {
       res.send('success')
          })
          .catch((e) => console.log(e))
  }