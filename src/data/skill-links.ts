const base = "https://github.com/yktsnet/sdlc-kit/blob/main/units";

export const skillLinks: Record<string, string> = {
  "/issue-draft": `${base}/flow-team/.claude/skills/issue-draft/SKILL.md`,
  "/issue-work": `${base}/flow-team/.claude/skills/issue-work/SKILL.md`,
  "/rework-review": `${base}/flow-team/.claude/skills/rework-review/SKILL.md`,
  "issue-verifier": `${base}/flow-team/.claude/agents/issue-verifier.md`,
  "screen-operator": `${base}/flow-team/.claude/agents/screen-operator.md`,
  "/client-next": `${base}/flow-client/.claude/skills/client-next/SKILL.md`,
  "/qa-send": `${base}/customer/.claude/skills/qa-send/SKILL.md`,
  "/qa-collect": `${base}/customer/.claude/skills/qa-collect/SKILL.md`,
};
