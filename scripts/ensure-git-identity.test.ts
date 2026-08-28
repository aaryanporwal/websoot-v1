import { describe, expect, test } from "bun:test";
import { chmod, copyFile, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "..");
const identityScript = path.join(repoRoot, "scripts/ensure-git-identity.sh");
const hookScript = path.join(repoRoot, ".githooks/commit-msg");
const installScript = path.join(repoRoot, "scripts/install-git-hooks.sh");

async function run(
  cwd: string,
  command: string[],
  env: Record<string, string> = {},
) {
  const result = Bun.spawnSync({
    cmd: command,
    cwd,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = result.stdout.toString();
  const stderr = result.stderr.toString();
  if (result.exitCode !== 0) {
    throw new Error(
      `${command.join(" ")} failed (${result.exitCode})\n${stdout}\n${stderr}`,
    );
  }
  return stdout.trim();
}

async function createRepo() {
  const root = await mkdtemp(path.join(os.tmpdir(), "git-identity-"));
  await run(root, ["git", "init"]);
  await run(root, ["git", "config", "--local", "commit.gpgsign", "false"]);
  return root;
}

describe("ensure-git-identity", () => {
  test("rewrites Cursor Agent identity to the repo author", async () => {
    const root = await createRepo();
    await run(root, [
      "git",
      "config",
      "--local",
      "user.name",
      "Cursor Agent",
    ]);
    await run(root, [
      "git",
      "config",
      "--local",
      "user.email",
      "cursoragent@cursor.com",
    ]);

    await run(root, ["bash", identityScript]);

    expect(await run(root, ["git", "config", "--local", "--get", "user.name"])).toBe(
      "Aaryan Porwal",
    );
    expect(await run(root, ["git", "config", "--local", "--get", "user.email"])).toBe(
      "aaryanporwal2233@gmail.com",
    );
  });

  test("leaves a human identity unchanged", async () => {
    const root = await createRepo();
    await run(root, ["git", "config", "--local", "user.name", "Someone Else"]);
    await run(root, [
      "git",
      "config",
      "--local",
      "user.email",
      "someone@example.com",
    ]);

    await run(root, ["bash", identityScript]);

    expect(await run(root, ["git", "config", "--local", "--get", "user.name"])).toBe(
      "Someone Else",
    );
    expect(await run(root, ["git", "config", "--local", "--get", "user.email"])).toBe(
      "someone@example.com",
    );
  });
});

describe("commit-msg hook", () => {
  test("strips Co-authored-by trailers", async () => {
    const root = await createRepo();
    const messagePath = path.join(root, "COMMIT_EDITMSG");
    await writeFile(
      messagePath,
      "Fix the thing.\n\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>\n",
    );

    await run(root, ["bash", hookScript, messagePath]);

    expect((await Bun.file(messagePath).text()).trim()).toBe("Fix the thing.");
  });

  test("rewrites author on a real commit when only .git/hooks is wired", async () => {
    const root = await createRepo();
    await run(root, [
      "git",
      "config",
      "--local",
      "user.name",
      "Cursor Agent",
    ]);
    await run(root, [
      "git",
      "config",
      "--local",
      "user.email",
      "cursoragent@cursor.com",
    ]);

    await mkdir(path.join(root, "scripts"), { recursive: true });
    await mkdir(path.join(root, ".githooks"), { recursive: true });
    await copyFile(identityScript, path.join(root, "scripts/ensure-git-identity.sh"));
    await copyFile(hookScript, path.join(root, ".githooks/commit-msg"));
    await copyFile(hookScript, path.join(root, ".git/hooks/commit-msg"));
    await chmod(path.join(root, "scripts/ensure-git-identity.sh"), 0o755);
    await chmod(path.join(root, ".git/hooks/commit-msg"), 0o755);

    await writeFile(path.join(root, "note.txt"), "hello\n");
    await run(root, ["git", "add", "note.txt"]);
    await run(root, ["git", "commit", "-m", "Add a note"]);

    const author = await run(root, ["git", "log", "-1", "--format=%an <%ae>"]);
    expect(author).toBe("Aaryan Porwal <aaryanporwal2233@gmail.com>");
  });
});

describe("install-git-hooks", () => {
  test("copies commit-msg into .git/hooks and rewrites Cursor identity", async () => {
    const root = await createRepo();
    await run(root, [
      "git",
      "config",
      "--local",
      "user.name",
      "Cursor Agent",
    ]);
    await run(root, [
      "git",
      "config",
      "--local",
      "user.email",
      "cursoragent@cursor.com",
    ]);

    await mkdir(path.join(root, "scripts"), { recursive: true });
    await mkdir(path.join(root, ".githooks"), { recursive: true });
    await copyFile(identityScript, path.join(root, "scripts/ensure-git-identity.sh"));
    await copyFile(installScript, path.join(root, "scripts/install-git-hooks.sh"));
    await copyFile(hookScript, path.join(root, ".githooks/commit-msg"));
    await chmod(path.join(root, "scripts/ensure-git-identity.sh"), 0o755);
    await chmod(path.join(root, "scripts/install-git-hooks.sh"), 0o755);

    await run(root, ["bash", path.join(root, "scripts/install-git-hooks.sh")]);

    expect(await Bun.file(path.join(root, ".git/hooks/commit-msg")).exists()).toBe(
      true,
    );
    expect(await run(root, ["git", "config", "--get", "core.hooksPath"])).toBe(
      ".githooks",
    );
    expect(await run(root, ["git", "config", "--local", "--get", "user.name"])).toBe(
      "Aaryan Porwal",
    );
  });
});
