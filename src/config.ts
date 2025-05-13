import dotenv from 'dotenv';

dotenv.config();

export const config = {
    LOG_DIR_PATH: process.env.LOG_DIR_PATH,
    PORT: process.env.PORT,
    KIBO_LOCALE: process.env.KIBO_LOCALE,
    KIBO_TENANT: process.env.KIBO_TENANT,
    KIBO_SITE: process.env.KIBO_SITE,
    KIBO_MASTER_CATALOG: process.env.KIBO_MASTER_CATALOG,
    KIBO_CATALOG: process.env.KIBO_CATALOG,
    KIBO_CURRENCY: process.env.KIBO_CURRENCY,
    KIBO_AUTH_HOST: process.env.KIBO_AUTH_HOST,
    KIBO_API_HOST: process.env.KIBO_API_HOST,
    KIBO_CLIENT_ID: process.env.KIBO_CLIENT_ID,
    KIBO_SHARED_SECRET: process.env.KIBO_SHARED_SECRET,
    KIBO_API_ENV: process.env.KIBO_API_ENV,
    OCI_URL: process.env.OCI_URL,
    OCI_USERNAME: process.env.OCI_USERNAME,
    OCI_PASSWORD: process.env.OCI_PASSWORD,
    SCHEDULER_RUNNING: process.env.SCHEDULER_RUNNING,
    REMINDER_TIME: process.env.REMINDER_TIME,
}