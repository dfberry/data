import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { LoadedData } from './model.js';

async function loadUsers(): Promise<string[]> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../users.json');
  const data = await readFile(filePath, 'utf8');

  const users = JSON.parse(data);

  return users;
}
async function loadRepos(): Promise<string[]> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../repos.json');
  const data = await readFile(filePath, 'utf8');

  const repos = JSON.parse(data);

  return repos;
}
export async function loadData(): Promise<LoadedData> {
  const users = await loadUsers();
  const repos = await loadRepos();

  const response = {
    users,
    repos
  };

  console.log(response);

  return response;
}
