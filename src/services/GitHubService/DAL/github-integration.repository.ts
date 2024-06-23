import axios, { AxiosRequestConfig } from 'axios';
import { RepoFileData, RepositoryDetails } from '../github.interfaces';
import { GITHUB_API_BASE_URL } from '../github.constants';

export class GitHubIntegrationRepository {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async getAllFiles(
    owner: string,
    repoName: string,
    path = '',
  ): Promise<RepoFileData> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `token ${this.token}` },
    };

    let fileCount = 0;
    let ymlFileContent = '';

    try {
      const contentsResponse = await axios.get(
        `${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}/contents/${path}`,
        config,
      );
      const files = contentsResponse.data;

      for (const file of files) {
        if (file.type === 'file') {
          fileCount++;
          if (file.name.endsWith('.yml') && !ymlFileContent) {
            const fileResponse = await axios.get(file.url, config);
            ymlFileContent = Buffer.from(
              fileResponse.data.content,
              'base64',
            ).toString('utf-8');
          }
        } else if (file.type === 'dir') {
          const nestedResult = await this.getAllFiles(
            owner,
            repoName,
            file.path,
          );
          fileCount += nestedResult.fileCount;
          if (!ymlFileContent && nestedResult.ymlFileContent) {
            ymlFileContent = nestedResult.ymlFileContent;
          }
        }
      }

      return { fileCount, ymlFileContent };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      console.error(
        `Error fetching files for repository ${owner}/${repoName}:`,
        errorMessage,
      );
      throw new Error(
        `Failed to fetch files for repository ${owner}/${repoName}`,
      );
    }
  }

  async getRepositoryDetails(
    owner: string,
    repoName: string,
  ): Promise<RepositoryDetails> {
    console.log(`Fetching details for repository: ${owner}/${repoName}`);
    const config: AxiosRequestConfig = {
      headers: { Authorization: `token ${this.token}` },
    };

    try {
      const repoResponse = await axios.get(
        `${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}`,
        config,
      );
      const repo = repoResponse.data;

      const { fileCount, ymlFileContent }: RepoFileData =
        await this.getAllFiles(owner, repoName);

      const webhooksResponse = await axios.get(
        `${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}/hooks`,
        config,
      );
      const webhooks = webhooksResponse.data;

      return {
        name: repo.name,
        size: repo.size,
        owner: {
          login: repo.owner.login,
        },
        isPrivate: repo.private,
        numberOfFiles: fileCount,
        ymlFileContent: ymlFileContent,
        activeWebhooks: webhooks.map((webhook: any) => ({
          id: webhook.id,
          name: webhook.name,
        })),
        error: null,
      };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      console.error(
        `Error fetching details for repository ${owner}/${repoName}:`,
        errorMessage,
      );
      return {
        name: `${owner}/${repoName}`,
        size: null,
        owner: null,
        isPrivate: null,
        numberOfFiles: null,
        ymlFileContent: null,
        activeWebhooks: null,
        error: errorMessage,
      } as unknown as RepositoryDetails;
    }
  }
}
