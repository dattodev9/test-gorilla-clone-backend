import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostgresModule } from './shared/modules/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { UserProfileModule } from './features/user-profile/user-profile.module';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { JwtModule } from './shared/modules/jwt-auth/jwt.module';
import { TestModule } from './features/test/test.module';
import { AssessmentModule } from './features/assessment/assessment.module';
import { CandidateModule } from './features/candidate/candidate.module';
import { S3Module } from './shared/modules/aws-s3/s3.module';
import { RoleMiddleware } from './middlewares/role.middleware';
import { AuthorizationModule } from './features/authorization/authorization.module';
import { AppService } from './app.service';

const publicRoutes = [
  { path: '/sign-in', method: RequestMethod.POST },
  { path: '/candidate/:id/submit-assessment', method: RequestMethod.POST },
  { path: '/candidate/:id/assessment', method: RequestMethod.GET },
  { path: '/candidate/:id/assessment-overview', method: RequestMethod.GET },
  { path: '/candidate/:id/tracking', method: RequestMethod.PATCH },
  { path: '/coding-question/:id/run', method: RequestMethod.POST },
];

const adminAndHRRoutes = [
  { path: '/user-info', method: RequestMethod.GET },
  { path: '/logout', method: RequestMethod.POST },
  { path: '/change-password', method: RequestMethod.POST },
  { path: '/assessment', method: RequestMethod.ALL },
  { path: '/assessment/:id', method: RequestMethod.ALL },
  { path: '/assessment/:view', method: RequestMethod.ALL },
  { path: '/test', method: RequestMethod.ALL },
  { path: '/candidate', method: RequestMethod.ALL },
  { path: '/candidate/:id', method: RequestMethod.ALL },
];

const adminAndSpecialistRoutes = [
  { path: '/user-info', method: RequestMethod.GET },
  { path: '/logout', method: RequestMethod.POST },
  { path: '/test', method: RequestMethod.ALL },
  { path: '/test/:id', method: RequestMethod.ALL },
  { path: '/test/:id/latest-order-question', method: RequestMethod.GET },
  { path: '/test/:id/one-choice-question', method: RequestMethod.ALL },
  { path: '/test/:id/multiple-choice-question', method: RequestMethod.ALL },
  { path: '/one-choice-question', method: RequestMethod.ALL },
  { path: '/one-choice-question/:id', method: RequestMethod.ALL },
  { path: '/multiple-choice-question', method: RequestMethod.ALL },
  { path: '/multiple-choice-question/:id', method: RequestMethod.ALL },
  { path: '/coding-question', method: RequestMethod.ALL },
  { path: '/coding-question/:id', method: RequestMethod.ALL },
  { path: '/change-password', method: RequestMethod.POST },
];

const adminOnlyRoutes = [
  { path: '/authorization/*', method: RequestMethod.ALL },
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    PostgresModule,
    S3Module,
    AuthenticationModule,
    UserProfileModule,
    TypeOrmModule.forFeature([User]),
    JwtModule,
    TestModule,
    AssessmentModule,
    CandidateModule,
    AuthorizationModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(...publicRoutes)
      .forRoutes('*');

    this.configureRoleMiddlewares(consumer);
  }

  private configureRoleMiddlewares(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoleMiddleware([UserRole.ADMIN, UserRole.HR]))
      .exclude(...adminAndSpecialistRoutes)
      .forRoutes(...adminAndHRRoutes);

    consumer
      .apply(RoleMiddleware([UserRole.ADMIN, UserRole.SPECIALIST]))
      .exclude(...adminAndHRRoutes)
      .forRoutes(...adminAndSpecialistRoutes);

    consumer
      .apply(RoleMiddleware([UserRole.ADMIN]))
      .exclude(...adminAndHRRoutes, ...adminAndSpecialistRoutes)
      .forRoutes(...adminOnlyRoutes);
  }
}
