import { StatusCodes } from 'http-status-codes';
import { CustomError, IErrorResponse, winstonLogger } from '@wuyuding2583/jobber-shared';
import cookieSession from 'cookie-session';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import hpp from 'hpp';
import { Logger } from 'winston';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import http from 'http';
import { config } from '@gateway/config';
import { elasticSearch } from '@gateway/elasticsearch';
import { appRoutes } from '@gateway/routes';

const SERVER_PORT = 4000;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gateway-service', 'debug');

export class GatewayServer {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.startElasticsearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: config.NODE_ENV !== 'development'
        // sameSite:none
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routeMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticsearch(): void {
    elasticSearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use((req: Request, res: Response, _next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exist.`, '');
      res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist.' });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.log('error', `gateway-service ${error.comingFrom}:`, error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private startServer(app: Application): void {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.log('error', `gateway-service startServer() error:`, error);
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    try {
      log.info(`gateway-service has start with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`gateway-service is running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', `gateway-service startHttpServer() error:`, error);
    }
  }
}
