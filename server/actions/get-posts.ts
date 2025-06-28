"use server"

import { db } from "@/server"
import { posts } from "@/server/schema"

export default async function getPosts(){
    const data = await db.select().from(posts);

    if(!data){
        return { error: "No posts found man" }
    }
    return { success: data }
}