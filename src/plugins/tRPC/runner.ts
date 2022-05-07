import { Language } from "./router";
import * as k8s from "@kubernetes/client-node";
import { Job } from "../../models/Job";

const kc = new k8s.KubeConfig();
kc.loadFromFile("kubeconfig");
const client = kc.makeApiClient(k8s.BatchV1Api);

export async function runJavaScript(code: string) {
  const job = new Job(code, Language.JAVASCRIPT);
  try {
    await client.readNamespacedJob(job.metadata.name, "runner");

    const patch = {
      op: "replace",
      path: "/spec/template/spec/containers[0]/env[0]",
      value: {
        name: "CODE",
        value: code,
      },
    };

    const options = {
      headers: { "Content-type": "application/json" },
    };
    await client.patchNamespacedJob(
      job.metadata.name,
      "runner",
      patch,
      undefined,
      undefined,
      options
    );
  } catch (e) {
    console.log(e);
    await client.createNamespacedJob("runner", job);
  }
}

export async function runPython(code: string) {}

export async function runRust(code: string) {}

export async function runJava(code: string) {}
