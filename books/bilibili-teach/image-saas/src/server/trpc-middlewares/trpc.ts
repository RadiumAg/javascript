import { getServerSession } from '@/server/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { db } from '../db/db';
import jwt, { JwtPayload } from 'jsonwebtoken';

const t = initTRPC.create();

const { router, procedure } = t;

const withSessionMiddleware = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession();

  return next({
    ctx: {
      session,
    },
  });
});

const loggedProcedure = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();
  console.log('[DEBUG] api time', Date.now() - start);
  return result;
});

const withLoggerProcedure = procedure.use(loggedProcedure);

const protectedProcedure = procedure
  .use(loggedProcedure)
  .use(withSessionMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'FORBIDDEN',
      });
    }

    return next({
      ctx: {
        session: ctx.session!,
      },
    });
  });

const withAppProcedure = withLoggerProcedure.use(async ({ ctx, next }) => {
  const header = await headers();
  const apiKey = header.get('api-key');
  const signedToken = header.get('signed-token');

  if (apiKey) {
    const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
      where: (apiKeys, { eq, and, isNull }) =>
        and(eq(apiKeys.key, apiKey), isNull(apiKeys.deletedAt)),
      with: {
        app: {
          with: {
            user: true,
          },
        },
      },
    });

    if (apiKeyAndAppUser == null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }

    return next({
      ctx: {
        app: apiKeyAndAppUser.app,
        user: apiKeyAndAppUser.app.user,
      },
    });
  } else if (signedToken) {
    const payload = jwt.decode(signedToken);
    if (!(payload as JwtPayload).clientId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'ClientId not found',
      });
    }

    const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
      where: (apiKeys, { eq, and, isNull }) =>
        and(
          eq(apiKeys.clientId, (payload as JwtPayload).clientId),
          isNull(apiKeys.deletedAt),
        ),
      with: {
        app: {
          with: {
            user: true,
          },
        },
      },
    });

    if (apiKeyAndAppUser == null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }

    try {
      jwt.verify(signedToken, apiKeyAndAppUser.key);
    } catch {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid signed token',
      });
    }

    return next({
      ctx: {
        app: apiKeyAndAppUser.app,
        user: apiKeyAndAppUser.app.user,
      },
    });
  }

  throw new TRPCError({
    code: 'FORBIDDEN',
  });
});

export { router, protectedProcedure, withAppProcedure };
