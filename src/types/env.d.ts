declare namespace NodeJS {
  interface ProcessEnv {
    APP_PORT: string;
    WS_SERVER_PORT: string;
    SCHEME: string;
    PORT: string;
    DOMAIN: string;
    ASSET_DIR: string;
    ASSET_PREFIX: string;
    SITE_URL: string;
    SITE_MAP_PATH: string;

    MYSQL_HOST: string;
    MYSQL_DATABASE: string;
    MYSQL_PORT: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_CA: string;

    REDIS_PORT: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_FAMILY: string;
    REDIS_DB: string;

    JWT_SECRET_KEY: string;

    SECRET_QQ_APPID: string;
    SECRET_QQ_APPKEY: string;
    SECRET_GITHUB_CLIENTID: string;
    SECRET_GITHUB_CLIENTSECRET: string;

    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;

    ALI_ACCESS_KEY_ID: string;
    ALI_ACCESS_KEY_SECRET: string;
    ALI_OSS_REGION: string;
    ALI_OSS_BUCKET: string;
    ALI_OSS_IMAGE_WATERMARK: string;
    ALI_OSS_ASSET_PREFIX: string;
  }
}
