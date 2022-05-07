import * as trpc from "@trpc/server";
import { z } from "zod";
import { runJava, runJavaScript, runPython, runRust } from "./runner";

export type Run = {
  stderr: string;
  stdout: string;
  testsCompleted: string;
};

export enum Language {
  JAVASCRIPT = "javascript",
  RUST = "rust",
  PYTHON = "python",
  JAVA = "java",
}

export const appRouter = trpc.router().mutation("run", {
  // validate input with Zod
  input: z.object({
    code: z.string(),
    language: z.enum([
      Language.JAVASCRIPT,
      Language.RUST,
      Language.PYTHON,
      Language.JAVA,
    ]),
  }),
  async resolve({ input }) {
    let run;
    switch (input.language) {
      case Language.JAVASCRIPT:
        run = runJavaScript(input.code);
        break;
      case Language.RUST:
        run = runRust(input.code);
        break;
      case Language.PYTHON:
        run = runPython(input.code);
        break;
      case Language.JAVA:
        run = runJava(input.code);
        break;
      default:
        throw new Error("Unknown language");
    }
    return run;
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
