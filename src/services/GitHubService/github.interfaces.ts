export interface Owner {
  login: string;
}

export interface Repository {
  name: string;
  size: number;
  owner: Owner;
}

export interface RepositoryDetails extends Repository {
  isPrivate: boolean;
  numberOfFiles: number;
  ymlFileContent: string;
  activeWebhooks: Webhook[];
  error: string | null;
}

export interface Webhook {
  id: number;
  name: string;
}

export interface RepoFileData {
  fileCount: number;
  ymlFileContent: string;
}
