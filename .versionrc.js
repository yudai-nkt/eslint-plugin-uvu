module.exports = {
  scripts: {
    prerelease: "tsm scripts/update-rules-table.ts && git add README.md",
  },
};
