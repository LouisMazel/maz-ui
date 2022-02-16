const types = require("commitlint-config-cz/lib/types")();

module.exports = {
  types: types.map((type) => {
    const base = { type, hidden: false };
    if (type === "feat") return { ...base, section: "Features" };
    if (type === "fix") return { ...base, section: "Bug Fixes" };
    if (type === "docs") return { ...base, section: "Docs" };
    if (type === "chore") return { ...base, section: "Others" };
    if (type === "improvement") return { ...base, section: "Improvements" };
    return { ...base, hidden: true };
  }),
  scripts: {
    pretag:
      "CURR_TAG=$(cat package.json | jq -r .version); git tag -d $CURR_TAG; exit 0",
  },
};
