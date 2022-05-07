import { Language } from "../plugins/tRPC/router";
import * as k8s from "@kubernetes/client-node";

export class Job extends k8s.V1Job {
  apiVersion = "batch/v1";
  kind = "Job";
  metadata = {
    name: "runner",
  };
  spec = {
    template: {
      metadata: {
        name: "runner",
      },
      spec: {
        containers: [
          {
            name: "runner",
            image: "",
            command: [""],
            env: [
              {
                name: "CODE",
                value: "",
              },
            ],
          },
        ],
        restartPolicy: "Never",
      },
    },
  };

  constructor(code: string, language: Language) {
    super();
    switch (language) {
      case Language.JAVA:
        this.metadata.name = "runner-java";
        this.spec.template.spec.containers[0].image = "openjdk:19-jdk-alpine";
        this.spec.template.spec.containers[0].env[0].value = code;
        this.spec.template.spec.containers[0].command = [
          "sh",
          "-c",
          "echo $CODE > /index.java && javac /index.java && java -cp /index.class Runner",
        ];
        break;
      case Language.JAVASCRIPT:
        this.metadata.name = "runner-javascript";
        this.spec.template.spec.containers[0].image = "node:16.14.2-alpine";
        this.spec.template.spec.containers[0].env[0].value = code;
        this.spec.template.spec.containers[0].command = [
          "sh",
          "-c",
          "echo $CODE > /index.js && node /index.js",
        ];
        break;
      case Language.PYTHON:
        this.metadata.name = "runner-python";
        this.spec.template.spec.containers[0].image = "python:3.9.12";
        this.spec.template.spec.containers[0].env[0].value = code;
        this.spec.template.spec.containers[0].command = [
          "sh",
          "-c",
          "echo $CODE > /index.py && python /index.py",
        ];
        break;
      case Language.RUST:
        this.metadata.name = "runner-rust";
        this.spec.template.spec.containers[0].image = "rust:1.60";
        this.spec.template.spec.containers[0].env[0].value = code;
        this.spec.template.spec.containers[0].command = [
          "sh",
          "-c",
          "echo $CODE > /index.rs && rustc /index.rs && ./index",
        ];
        break;
      default:
        throw new Error("Unknown language");
    }
  }
}
