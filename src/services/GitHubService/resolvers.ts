import { GitHubService } from './github.service';
import { Repository, RepositoryDetails } from './github.interfaces';

interface Context {
  token: string;
}

const resolvers = {
  Query: {
    repositories: async (
      _: any,
      __: any,
      { token }: Context,
    ): Promise<Repository[]> => {
      const service = new GitHubService(token);
      return service.getRepositories();
    },
    repositoryDetails: async (
      _: any,
      { names }: { names: string[] },
      { token }: Context,
    ): Promise<RepositoryDetails[]> => {
      const service = new GitHubService(token);
      const detailsPromises = names.map((name: string) => {
        const [owner, repoName] = name.split('/');
        return service.getRepositoryDetailsWithLimit(owner, repoName);
      });
      return Promise.all(detailsPromises);
    },
  },
};

export default resolvers;
