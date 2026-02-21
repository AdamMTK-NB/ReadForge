// app/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { GitHubLoginButton } from './components/GitHubLoginButton';
import { RepoList } from './components/RepoList';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  let repos = [];
  let user = null;

  if (token) {
    // Fetch user data
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (userRes.ok) {
      user = await userRes.json();
      
      // Fetch repositories
      const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (reposRes.ok) {
        repos = await reposRes.json();
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            README Generator
          </h1>
          <p className="text-xl text-gray-400">
            Connect your GitHub account and generate professional README files for your repositories
          </p>
        </header>

        {!token ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm max-w-md w-full text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <h2 className="text-2xl font-semibold mb-2">Connect with GitHub</h2>
                <p className="text-gray-400">
                  Sign in to access your repositories and generate README files automatically
                </p>
              </div>
              <GitHubLoginButton />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center gap-4">
                <img 
                  src={user?.avatar_url} 
                  alt={user?.login}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-xl font-semibold">Welcome, {user?.name || user?.login}</h2>
                  <p className="text-gray-400 text-sm">{user?.public_repos} public repositories</p>
                </div>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
                >
                  Disconnect
                </button>
              </form>
            </div>

            <RepoList repos={repos} />
          </div>
        )}
      </div>
    </main>
  );
}