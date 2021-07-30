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
}

const config: Config = {
  mongoUrl: parsedEnv.MONGO_URL as string,
  port: parsedEnv.PORT as number,
};

export default config;
