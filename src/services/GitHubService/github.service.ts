import Bottleneck from 'bottleneck';
import { GitHubRepository } from './DAL/github.repository';
import { GitHubIntegrationRepository } from './DAL/github-integration.repository';
import { Repository, RepositoryDetails } from './github.interfaces';

const limiter = new Bottleneck({
  maxConcurrent: 2,
});

export class GitHubService {
  private repository: GitHubRepository;
  private integrationRepository: GitHubIntegrationRepository;

  constructor(token: string) {
    this.repository = new GitHubRepository(token);
    this.integrationRepository = new GitHubIntegrationRepository(token);
  }

  async getRepositories(): Promise<Repository[]> {
    return this.repository.getRepositories();
  }

  async getRepositoryDetailsWithLimit(
    owner: string,
    repoName: string,
  ): Promise<RepositoryDetails> {
    return limiter.schedule(() =>
      this.integrationRepository.getRepositoryDetails(owner, repoName),
    );
  }
}
