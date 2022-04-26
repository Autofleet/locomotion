const git = require('git-last-commit');

let lastCommit = {};

git.getLastCommit((err, commit) => {
  lastCommit = commit || {};
});

module.exports = (req, res) => {
  res.json({
    status: 'ok',
    lastCommit: {
      shortHash: lastCommit.shortHash,
      subject: lastCommit.subject,
      branch: lastCommit.branch,
    },
  });
};
