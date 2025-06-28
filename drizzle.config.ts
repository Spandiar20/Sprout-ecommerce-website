import 'dotenv/config';
import { Config } from 'drizzle-kit';

export default {
  out: './server/migrations',
  schema: './server/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_YTmx5Ztjh6HM@ep-yellow-math-a42c6hwz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
} satisfies Config