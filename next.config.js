require('dotenv').config();

module.exports = {
  env: {
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
    GITHUB_USER: process.env.GITHUB_USER,
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};
