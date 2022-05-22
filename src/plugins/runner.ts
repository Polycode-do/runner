import * as Docker from "dockerode";
import { Writable } from "stream";

import fp from "fastify-plugin";

export interface RunnerPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<RunnerPluginOptions>(async (fastify, opts) => {
  const docker = new Docker();

  class SimpleStream extends Writable {
    private data = "";

    public getData() {
      return this.data;
    }

    public write(chunk: any) {
      this.data += chunk.toString();
      return true;
    }
  }

  const runner = {
    runJavaScript: async function (code: string) {
      const stdout = new SimpleStream();

      await docker.run(
        "node:16.14.2-alpine",
        [
          "sh",
          "-c",
          `echo "${code.replace('"', "'")}" > /index.js && node /index.js`,
        ],
        stdout
      );

      return { stdout: Buffer.from(stdout.getData()).toString(), stderr: null };
    },

    runJava: async function (code: string) {
      const stdout = new SimpleStream();

      await docker.run(
        "openjdk:19-jdk-slim",
        [
          "sh",
          "-c",
          `echo "${code.replace(
            '"',
            "'"
          )}" > /index.java && javac /index.java && java/index.class`,
        ],
        stdout
      );

      return { stdout: Buffer.from(stdout.getData()).toString(), stderr: null };
    },

    runRust: async function (code: string) {
      const stdout = new SimpleStream();

      await docker.run(
        "rust:1.61.0-slim",
        [
          "sh",
          "-c",
          `echo "${code.replace(
            '"',
            "'"
          )}" > /index.rs && rustc /index.rs && chmod +x /index && /index`,
        ],
        stdout
      );

      return { stdout: Buffer.from(stdout.getData()).toString(), stderr: null };
    },

    runPython: async function (code: string) {
      const stdout = new SimpleStream();

      await docker.run(
        "python:3.9.13-slim",
        [
          "sh",
          "-c",
          `echo "${code.replace('"', "'")}" > /index.py && python /index.py`,
        ],
        stdout
      );

      return { stdout: Buffer.from(stdout.getData()).toString(), stderr: null };
    },
  };

  fastify.decorate("runner", runner);
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    runner: {
      runJavaScript(code: string): Promise<{ stdout: string; stderr: string }>;
      runJava(code: string): Promise<{ stdout: string; stderr: string }>;
      runRust(code: string): Promise<{ stdout: string; stderr: string }>;
      runPython(code: string): Promise<{ stdout: string; stderr: string }>;
    };
  }
}
