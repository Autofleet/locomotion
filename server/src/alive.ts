import git from 'git-last-commit';

let lastCommit = { shortHash: null, subject: null, branch: null };

git.getLastCommit((err, commit) => {
  lastCommit = commit || {};
});

export default (req, res) => {
  res.json({
    status: 'ok',
    lastCommit: {
      shortHash: lastCommit.shortHash,
      subject: lastCommit.subject,
      branch: lastCommit.branch,
    },
  });
};
