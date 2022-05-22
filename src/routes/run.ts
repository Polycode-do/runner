import { FastifyPluginAsync } from "fastify";

const run: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: { code: string; language: string } }>(
    "/run",
    async function (request, reply) {
      const { code, language } = request.body;

      switch (language) {
        case "javascript":
          return await fastify.runner.runJavaScript(code);
        case "java":
          return await fastify.runner.runJava(code);
        case "rust":
          return await fastify.runner.runRust(code);
        case "python":
          return await fastify.runner.runPython(code);
        default:
          return { stdout: "", stderr: "" };
      }
    }
  );
};

export default run;
