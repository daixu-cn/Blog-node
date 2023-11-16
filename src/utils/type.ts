import fs from "fs-extra";

export interface DirectoriesList {
  name: string;
  subDirectories: DirectoriesList[];
}
export interface Files extends fs.Stats {
  directory: boolean;
  name: string;
  url: string;
  path: string;
}
