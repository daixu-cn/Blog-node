export interface DirectoriesList {
  name: string;
  subDirectories: DirectoriesList[];
}

export interface FileResult {
  directory?: boolean;
  name: string;
  path?: string;
  url?: string;
  lastModified?: string;
  size?: number;
}
