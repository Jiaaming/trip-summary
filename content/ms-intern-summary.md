---
id: ms-intern-summary
title: 微软SDE实习总结
date: 2024-08-06
tags:
  - 技术
category: posts
---


## 项目背景

![](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240803213701.png)

在我于微软实习期间，我参与了 [VSCode Gradle 扩展](https://github.com/microsoft/vscode-gradle) 的开发工作。该扩展最初由三个独立组件组成：

1. **Gradle Task Server：** 后台运行，提供项目与任务信息，并执行 Gradle Tasks。
2. **Gradle Language Server：** 为 Gradle 脚本提供代码补全、诊断等语言功能。
3. **Gradle Project Importer：** 通过 **Gradle Build Server** 检测 Gradle 项目并导入到工作空间。

我的任务是将这些 Server 合并到一个进程中，但依然在不同线程中运行，从而减少内存占用。此合并是为了将该扩展集成到被广泛使用的 [VSCode Java Pack](https://github.com/microsoft/vscode-java-pack) 中，对 Java 开发者至关重要。

### 服务器之间的通信方式

| Server                | Client                      | Communication Method                                                                                                                        |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Task Server: Java     | Task Client: TypeScript     | [gRPC](https://grpc.io/): TCP socket                                                                                                        |
| Language Server: Java | Language Client: TypeScript | [Language Server Protocol](https://microsoft.github.io/language-server-protocol/), [JSON-RPC](https://www.jsonrpc.org/specification): Stdio |
| Build Server: Java    | Build Client: Java          | [Build Server Protocol](https://build-server-protocol.github.io/): Stdio                                                                    |

### 合并前架构

![Architecture Before Merge](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240803233221.png)

## 为什么要合并？

最初扩展会启动三个独立的 Java 进程：

1. **Task Server：** 又称 Gradle Server，微软从 [Richard Willis](https://github.com/badsyntax) 接手，是最早的服务。
2. **Language Server：** 同样由 Richard Willis 开发，负责语言功能。
3. **Build Server：** 微软后续添加，用于项目导入，更多细节见 [这里](https://github.com/microsoft/build-server-for-gradle)。

这种结构带来大量额外开销，因为三个进程同时运行，如下图：

![Process Overhead](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/bfm.png)

我们的目标是将扩展集成到供大量 Java 开发者使用的 VSCode Java Pack 中，因此降低内存消耗十分必要。

一开始 Task Server 和 Language Server 会随扩展启动，而 Build Server 会在 Importer 加载时按需启动。

## 如何进行合并？

由于三个 Server 相互独立且不共享数据，因此只需要调整启动方式，使用 Java 多线程同时运行即可相互独立。

### 合并后的架构

![Architecture After Merge](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240804104905.png)

---

## 第一步：合并 Task Server 与 Build Server

### 关键挑战

1. **标准输入输出冲突**
   进程合并后无法再复用标准输入输出（Stdio），否则多个线程会冲突。
   也不能使用 TCP Socket（安全原因）。
   最终使用了 [Named Pipes](https://en.wikipedia.org/wiki/Named_pipe)（命名管道），符合 VSCode 安全要求。

2. **Windows 兼容性复杂**
   Java 对 Windows 命名管道支持并不好，需要 OS 级处理。
   Unix 用 Unix Domain Socket，Windows 用 `AsynchronousFileChannel`。

```Java
// Build Server 与 Build Client 之间的连接
org.eclipse.lsp4j.jsonrpc.Launcher<BuildClient> launcher = new 
    org.eclipse.lsp4j.jsonrpc.Launcher.Builder<BuildClient>()
    .setOutput(outputStream)
    .setInput(inputStream)
    .setLocalService(gradleBuildServer)
    .setRemoteInterface(BuildClient.class)
    .setExecutorService(Executors.newCachedThreadPool())
    .create();
buildTargetService.setClient(launcher.getRemoteProxy());
```

3. **命名管道创建问题**
   Node.js 中如 [net.Socket](https://nodejs.org/api/net.html#netcreateserveroptions-connectionlistener) 可直接监听命名管道。
   为填补能力差距，我实现了一个额外层 —— [BspProxy](https://github.com/microsoft/vscode-gradle/blob/b71fcb2e1e4c8aeafc9ece92a13659f47e5c6009/extension/src/bs/BspProxy.ts#L16)，用于连接 Build Server 与 Build Client。

4. **管道路径传递机制**

* **Build Server 与 BspProxy：** 管道由扩展启动前生成随机路径，再传入 Build Server。
* **Build Client 与 BspProxy：** Build Client 在 Gradle Import 流程中启动，由 Java Language Server 控制。
  如何将管道路径传回扩展？

幸运的是，`JavaLanguageServerPlugin` 可以通知 VSCode：

```java
// 发送命名管道路径给 VSCode
private void sendImporterPipeName(String pipeName) {
    JavaLanguageServerPlugin.getInstance().getClientConnection()
        .sendNotification("gradle.onWillImporterConnect", pipeName);
}
```

```typescript
// VSCode 接收到 Java 通知
private registerCommand(): void {
    this.context.subscriptions.push(
        vscode.commands.registerCommand("gradle.onWillImporterConnect", (pipeName: string) => {
            this._onImporterReady.fire(path.resolve(pipeName));
        })
    );
}
```

由于初始化流程由 Import 控制，通信只能单向通知，因此使用轮询判断 VSCode 是否已准备好连接。

### 完整连接流程如下：

![Connection Workflow](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240804110358.png)

这是整个项目中最复杂的部分，但最终成功将 Build Server 与 Task Server 合并。

---

## 第二步：将 Language Server 合并进 Gradle Server

这一部分相对简单。VSCode Language Server/Client 支持多种连接方式。

通过将 Language Server 作为本地依赖并使用命名管道通信，我顺利完成了合并。

### 依赖管理挑战

Gradle Server 与 Gradle Language Server 存在共享依赖。
通过为 Language Server 制作 [fat JAR](https://stackoverflow.com/questions/19150811/what-is-a-fat-jar)，并置于 Gradle Server classpath 末尾，成功避免冲突。

---

## 合并后的性能表现

合并后仅保留一个 Java 进程 `GradleServer`：

![af-merge](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/af-merge.png)

### 如何测试性能？

主要关注 **内存消耗**。
合并前，通过监控三个独立进程的 RSS（常驻内存）求和获取总内存占用。

#### 合并前监控逻辑

1. **轮询获取三个 Server 的 PID**
2. 使用 `psutil` 读取每个进程 RSS，并求和
3. 启动 VSCode 之前运行脚本，每秒记录一次内存占用

> 💡 **什么是 RSS？**
> RSS = 实际占用物理内存，包括：
>
> * Java Heap
> * Metaspace
> * Code Cache
> * JVM Runtime & Stack

#### 合并后监控方法

使用 Plotly 绘制 **合并前（3 进程） VS 合并后（单进程）** 的内存折线图。
对比版本包括：

* 3.13.5（合并前）
* 3.16.2（合并后）

---

## 性能结果对比

测试四种不同规模的项目：

| Project Size | Description                                                           | Number of Gradle Tasks |
| ------------ | --------------------------------------------------------------------- | ---------------------- |
| Small        | 使用 `Gradle init` 初始化的基础项目                                             | 34                     |
| Medium       | [microsoft/vscode-gradle](https://github.com/microsoft/vscode-gradle) | ~380                   |
| Large        | [apache/lucene](https://github.com/apache/lucene)                     | ~3,300                 |
| Super Large  | [gradle/gradle](https://github.com/gradle/gradle)                     | ~42,000                |

#### Small 项目

![small2](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/small2.png)

#### Medium 项目

![medium](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/newplot.png)

#### Large 项目

![large](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/large-copy.png)

#### Super Large 项目

![super-large](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/Screenshot%202024-08-13%20at%2012.01.35.png)

---

测试显示，尤其在小型项目下，内存节省非常明显，证明了合并架构的效率提升。


