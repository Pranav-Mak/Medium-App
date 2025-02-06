import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


export const userRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
  }>();


userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
  const user = await prisma.user.create({
    data: {
      email:body.email,
      password:body.password
    }
  });
  const token = await sign({id: user.id},c.env.JWT_SECRET);
  return c.json({
    jwt: token
  })
}catch(e){
  return c.status(403);
}  
})



userRouter.post('/signin', (c) => {
   return c.text('Hello Hono!')
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
 })  