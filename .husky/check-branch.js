import { execSync } from "child_process";

try {
  // Get the current branch name safely across all platforms
  const branch = execSync("git branch --show-current").toString().trim();

  if (branch === "main") {
    console.error(
      '\n🛑 [Husky] Direct commits or pushes to the "main" branch are prohibited!',
    );
    console.error(
      "Please push to a feature branch and open a Pull Request instead.\n",
    );
    process.exit(1); // Non-zero exit code aborts the git push operation
  }
} catch (error) {
  console.error("Husky branch check failed:", error.message);
  process.exit(1);
}
