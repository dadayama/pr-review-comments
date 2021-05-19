import { Octokit } from '@octokit/rest';

export const useOctokit = (token) =>
  new Octokit({
    auth: token,
  });
