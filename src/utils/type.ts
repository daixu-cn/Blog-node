import fs from "fs-extra";

export interface DirectoriesList {
  name: string;
  subDirectories: DirectoriesList[];
}

export interface FileStats extends fs.Stats {
  name: string;
  path: string;
}
