import { Hono } from "hono";



export const blogRouter = new Hono();


//create blog
blogRouter.post('/blog', (c) => {
    return c.text('Hello Hono!')
  })



//update blog
blogRouter.put('/blog', (c) => {
    return c.text('Hello Hono!')
  })  

//get blog
blogRouter.get('/blog/:id', (c) => {
    return c.text('Hello Hono!')
  })  


//get bulk blog
blogRouter.get('/blog/bulk', (c) => {
    return c.text('Hello Hono!')
  })    