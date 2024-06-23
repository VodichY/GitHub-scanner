import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import axiosRetry from 'axios-retry';
import { mapRepositoryData } from '../mappers/github.mappers';
import { Repository } from '../github.interfaces';
import { GITHUB_API_BASE_URL } from '../github.constants';

axiosRetry(axios, {
  retries: 3,
  retryCondition: () => true,
});

export class GitHubRepository {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getRepositories(): Promise<Repository[]> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `token ${this.token}` },
    };

    try {
      const response = await axios.get(
        `${GITHUB_API_BASE_URL}/user/repos`,
        config,
      );
      return response.data.map(mapRepositoryData);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      console.error('Error fetching repositories:', errorMessage);
      throw new Error('Failed to fetch repositories');
    }
  }
}
