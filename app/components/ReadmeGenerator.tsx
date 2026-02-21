'use client';

import { useState } from 'react';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  default_branch: string;
}

interface ReadmeGeneratorProps {
  repo: Repo;
  onBack: () => void;
}

export function ReadmeGenerator({ repo, onBack }: ReadmeGeneratorProps) {
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<'professional' | 'casual' | 'technical'>('professional');
  const [sections, setSections] = useState({
    features: true,
    installation: true,
    usage: true,
    contributing: true,
    license: true,
  });

  const generateReadme = async () => {
    setLoading(true);
    
    // Simulate API call to generate README
    // In production, this would call your AI service
    setTimeout(() => {
      const generated = generateTemplateReadme(repo, tone, sections);
      setReadme(generated);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readme);
  };

  const downloadReadme = () => {
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to repositories
      </button>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">{repo.name}</h2>
        <p className="text-gray-400 mb-6">{repo.description || 'No description available'}</p>

        {!readme ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">README Tone</label>
              <div className="flex gap-3">
                {(['professional', 'casual', 'technical'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      tone === t 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Include Sections</label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(sections).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSections(prev => ({ ...prev, [key]: !value }))}
                    className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                      value 
                        ? 'bg-green-600/20 border-green-500/50 text-green-400' 
                        : 'bg-gray-700 border-gray-600 text-gray-500'
                    }`}
                  >
                    {value && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateReadme}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating README...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate README
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
              <button
                onClick={downloadReadme}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download README.md
              </button>
              <button
                onClick={() => setReadme('')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Regenerate
              </button>
            </div>
            
            <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm text-gray-300 font-mono border border-gray-700">
              {readme}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function generateTemplateReadme(repo: Repo, tone: string, sections: Record<string, boolean>): string {
  const title = repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  let readme = `# ${title}

`;
  
  if (repo.description) {
    readme += `${repo.description}

`;
  }

  readme += `## ${tone === 'casual' ? "What's this?" : 'Overview'}

`;
  
  if (tone === 'professional') {
    readme += `This project provides a robust solution for ${repo.name}. Built with ${repo.language || 'modern technologies'}, it offers reliable performance and maintainable code structure.

`;
  } else if (tone === 'casual') {
    readme += `Hey there! This is ${repo.name} - a cool project I built. Hope you find it useful!

`;
  } else {
    readme += `\`\`\`${repo.language || 'javascript'}
// Technical architecture
npm install ${repo.name}
\`\`\`

`;
  }

  if (sections.features) {
    readme += `## Features

- ✨ Core functionality implemented
- 🚀 Optimized for performance  
- 📦 Easy to integrate
- 🔧 Configurable options
- 📝 Well documented

`;
  }

  if (sections.installation) {
    readme += `## Installation

\`\`\`bash
# Clone the repository
git clone ${repo.html_url}.git

# Navigate to directory
cd ${repo.name}

# Install dependencies
npm install
\`\`\`

`;
  }

  if (sections.usage) {
    readme += `## Usage

\`\`\`${repo.language || 'javascript'}
import { main } from '${repo.name}';

// Basic usage
main();
\`\`\`

`;
  }

  if (sections.contributing) {
    readme += `## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

`;
  }

  if (sections.license) {
    readme += `## License

This project is licensed under the MIT License.

`;
  }

  readme += `---

<p align="center">
  Made with ❤️ by <a href="${repo.html_url.split('/').slice(0, -1).join('/')}">@${repo.full_name.split('/')[0]}</a>
</p>`;

  return readme;
}