import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

export const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string
}}>();

//middleware
blogRouter.use("/*", async (c,next)=>{
  const token = c.req.header("Authorization")?.replace('Bearer ', '').trim() || '';
const user = await verify(token, c.env.JWT_SECRET);

  try{
    if(user){
      c.set('userId',user.id as string)
      await next();
    }else(
      c.status(403)
    )
  }catch(e){
    c.status(403);
        return c.json({ error: "user not found" });
  }
})  


//create blog
blogRouter.post('/', async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId") 
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    const blog = await prisma.post.create({
      data:{
        title: body.title,
        content: body.content,
        authorId:parseInt(authorId)
      }
    })
    return c.json({
      id: blog.id
  })
  }catch(e){
    c.status(403);
        return c.json({ error: "cannot create blog" });
  }

})


//update blog
blogRouter.put('/', async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    const blog = await prisma.post.update({
      where:{
        id :body.id
      },
      data:{
        title: body.title,
        content: body.content,
      }
    })
    return c.json({
      id: blog.id
  })
  }catch(e){
    c.status(403);
    console.error("Error creating blog:", e);
        return c.json({ error: "cannot update blog" });
  }
  })  


//get bulk blog
blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    const blogs = await prisma.post.findMany();
    return c.json({
      blogs
  })
  }catch(e){
    c.status(403);
        return c.json({ error: "cannot display blogs" });
  }
  })

  
//get blog
blogRouter.get('/:id', async (c) => {
  const id = await c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    const blog = await prisma.post.findFirst({
      where:{
        id :parseInt(id)
      }
    })
    return c.json({blog})
  }catch(e){
    c.status(403);
        return c.json({ error: "cannot update blog" });
  }
  })  



