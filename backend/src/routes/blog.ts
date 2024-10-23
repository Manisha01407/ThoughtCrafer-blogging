import { createBlogInput, updateBlogInput } from '@manisha1414/blogging-module';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono'
import { verify } from 'hono/jwt'

export const blog = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string,
    }
}>();

blog.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(' ')[1];

    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    c.set('userId', payload.id as string);
    await next()
})

blog.post('/', async (c) => {
    const userId = c.get('userId');

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Input not correct"
        })
    }

    try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: parseInt(userId)
            }
        });
        console.log(post);
        return c.json({
            id: post.id
        });
    } catch (e) {
        console.log(e);
        c.status(403);
        return c.json({ error: "error while adding the post" });
    }
})

blog.put('/', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Input not correct"
        })
    }

    prisma.post.update({
        where: {
            id: body.id,
            authorId: Number(userId)
        },
        data: {
            title: body.title,
            content: body.content
        }
    });

    return c.text('updated post');

})

blog.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }

        }
    });

    return c.json(posts);
})

blog.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // const param = c.req.param("id");
        const post = await prisma.post.findFirst({
            where: {
                id: Number(id),
            },
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!blog) {
            c.status(404);
            return c.json({
                error: "Blog not found",
            });
        }
        return c.json({
            post,
        });
    } catch (error) {
        c.status(411);
        return c.json({
            error: "Error while fetching blog",
        });
    }
})
