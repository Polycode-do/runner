import fp from "fastify-plugin";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { appRouter, AppRouter } from "./router";

export default fp<FastifyTRPCPluginOptions<AppRouter>>(
  async (fastify, opts) => {
    fastify.register(fastifyTRPCPlugin, {
      trpcOptions: { router: appRouter },
    });
  }
);
