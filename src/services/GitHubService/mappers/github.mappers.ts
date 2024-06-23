import { Repository } from '../github.interfaces';

export const mapRepositoryData = (repo: any): Repository => ({
  name: repo.name,
  size: repo.size,
  owner: {
    login: repo.owner.login,
  },
});
