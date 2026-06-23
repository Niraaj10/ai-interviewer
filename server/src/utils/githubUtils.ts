import axios, { type AxiosProxyConfig } from 'axios';
import { GitHubRepo } from './types';

function getProxyConfig(): AxiosProxyConfig {
  const username = process.env.WEBSHARE_PROXY_USERNAME;
  const password = process.env.WEBSHARE_PROXY_PASS;

  if (!username || !password) {
    throw new Error('WEBSHARE_PROXY_USERNAME and WEBSHARE_PROXY_PASS must be set');
  }

  return {
    protocol: 'http',
    host: '198.105.121.200',
    port: 6462,
    auth: { username, password },
  };
}

/**
 * Extracts GitHub username from URL and fetches user repositories via Proxy.
 * @param githubUrl - Full GitHub profile URL
 * @returns Promise<GitHubRepo[]> - Array of user repositories
 */

export async function fetchUserRepos(githubUrl: string): Promise<GitHubRepo[]> {
  const normalizedUrl = githubUrl.endsWith("/") ? githubUrl.slice(0, -1) : githubUrl;
  const username = normalizedUrl.split("/").pop();
  
  if (!username) {
    throw new Error("Invalid GitHub URL");
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
      proxy: getProxyConfig(),
      headers: {
        'User-Agent': 'AI-Interview-App', 
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      desc: repo.description,
      starCount: repo.stargazers_count,
      url: repo.html_url,
      language: repo.language
    }));
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      throw new Error("GitHub API rate limit exceeded or IP blocked. Try rotating proxy.");
    }
    throw error;
  }
}   