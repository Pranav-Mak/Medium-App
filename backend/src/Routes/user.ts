import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'


export const userRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
  }>();

/////////////SIGN UP
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
  return c.json(user)
}catch(e){
  return c.status(403);
}  
})


/////////////SIGN IN
userRouter.post('/signin', async (c) => {
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    try{
      const user = await prisma.user.findUnique({
        where: {
          email:body.email,
          password:body.password
        } 
      }) 
      if (!user) {
        c.status(403);
        return c.json({ error: "user not found" });
    }
      const token = await sign({id: user.id},c.env.JWT_SECRET);
      return c.json({
        jwt: token
      })
    }catch(e){
      return c.status(403);
    }  
    })
