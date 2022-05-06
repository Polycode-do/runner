import { Run } from "./router";

export function runJavaScript() {
  return { stderr: "js", stdout: "", testsCompleted: "" } as Run;
}

export function runPython() {
  return { stderr: "python", stdout: "", testsCompleted: "" } as Run;
}

export function runRust() {
  return { stderr: "rust", stdout: "", testsCompleted: "" } as Run;
}

export function runJava() {
  return { stderr: "java", stdout: "", testsCompleted: "" } as Run;
}
