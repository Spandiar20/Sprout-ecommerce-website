import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/server/schema'


const sql = neon('postgresql://neondb_owner:npg_YTmx5Ztjh6HM@ep-yellow-math-a42c6hwz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
export const db = drizzle({ client: sql, schema, logger:true })