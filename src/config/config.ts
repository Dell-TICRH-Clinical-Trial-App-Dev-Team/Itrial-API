import dotenvExtended from 'dotenv-extended';
import dotenvParseVariables from 'dotenv-parse-variables';

const env = dotenvExtended.load({
  path: process.env.ENV_FILE || './config/.env.dev',
  defaults: './config/.env.defaults',
  schema: './config/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
});

const parsedEnv = dotenvParseVariables(env);

interface Config {
  mongoUrl: string;
  port: number;
  domain: string;
  audience: string;
  isTesting: boolean;
}

const config: Config = {
  mongoUrl: parsedEnv.MONGO_URL as string,
  port: parsedEnv.PORT as number,
  domain: parsedEnv.AUTH0_DOMAIN as string,
  audience: parsedEnv.AUTH0_AUDIENCE as string,
  isTesting: parsedEnv.IS_TESTING as boolean,
};

export default config;
