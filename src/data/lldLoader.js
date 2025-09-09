// src/data/lldLoader.js
// Dynamically loads Low Level Design (LLD) project files located under src/llds/**.
// Expected folder structure:
// src/llds/ProjectName/README.md (optional)
// src/llds/ProjectName/Foo.java
// src/llds/AnotherProject/Bar.java
//
// Usage: import loadLldProjects from './data/lldLoader';
// const projects = loadLldProjects();
//
// This uses Vite's import.meta.glob to include the raw file contents at build time.

const EXTENSION_LANGUAGE_MAP = {
  md: 'markdown',
  markdown: 'markdown',
  java: 'java',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  txt: 'text',
  plantuml: 'plantuml'
};

function toDisplayName(dirName) {
  // Replace dashes/underscores with spaces and title-case
  return dirName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default function loadLldProjects() {
  // Glob all relevant file types. Add more extensions as needed.
  const modules = import.meta.glob('../llds/**/*.{md,markdown,java,js,ts,py,txt,plantuml}', { as: 'raw', eager: true });

  const projects = {};

  Object.entries(modules).forEach(([path, content]) => {
    // path example: '../llds/ParkingLot/Car.java'
    const parts = path.split('/');
    const lldsIndex = parts.findIndex(p => p === 'llds');
    if (lldsIndex === -1 || lldsIndex + 1 >= parts.length) return;
    const projectDir = parts[lldsIndex + 1];
    const fileName = parts.slice(lldsIndex + 2).join('/');
    if (!fileName) return; // skip directory entries

    const displayName = toDisplayName(projectDir);
    if (!projects[displayName]) {
      projects[displayName] = {
        description: 'No description provided. Add a README.md to this project folder to populate details.',
        files: []
      };
    }

    const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'text';
    const language = EXTENSION_LANGUAGE_MAP[ext] || 'text';

    if (/README\.(md|markdown)$/i.test(fileName)) {
      // Use README content as description
      projects[displayName].description = content;
      // Also keep it in files list for preview
      projects[displayName].files.push({
        name: fileName,
        language: 'markdown',
        type: 'markdown',
        content
      });
    } else {
      projects[displayName].files.push({
        name: fileName,
        language,
        content
      });
    }
  });

  // Sort files alphabetically within each project for consistent ordering
  Object.values(projects).forEach(project => {
    project.files.sort((a, b) => a.name.localeCompare(b.name));
  });

  return projects;
}
