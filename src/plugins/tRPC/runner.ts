import * as Docker from "dockerode";
import { Writable } from "stream";

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

export async function runJavaScript(code: string) {
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
}

export async function runJava(code: string) {
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
}

export async function runRust(code: string) {
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
}

export async function runPython(code: string) {
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
}
