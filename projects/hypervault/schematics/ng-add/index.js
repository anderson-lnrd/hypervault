"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = ngAdd;

const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@schematics/angular/utility/workspace");

// ── Font links to inject into index.html ──
const FONT_LINKS = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">',
];

// ── CSS variable block ──
const CSS_VARIABLES = `/* HyperVault — Global Styles */

:root {
  /* Cores (tema Cyber — sera sobrescrito pelo HyperThemeService se usado) */
  --background: #0f0f0f;
  --foreground: #fafafa;
  --card: #1a1a1a;
  --muted: #2a2a2a;
  --muted-foreground: #a3a3a3;
  --input: #242424;
  --border: #fafafa;
  --primary: #39ff14;
  --primary-foreground: #0f0f0f;
  --secondary: #ff1493;
  --secondary-foreground: #0f0f0f;
  --accent: #ffff00;
  --accent-foreground: #0f0f0f;
  --destructive: #ff4444;
  --destructive-foreground: #fafafa;

  /* Tipografia */
  --font-sans: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Space Mono', 'Courier New', monospace;

  /* Neo-Brutalist */
  --border-width: 4px;
  --border-radius: 0px;
  --shadow-offset: 4px;

  /* Density */
  --hyper-density: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--background);
  color: var(--foreground);
  margin: 0;
}
`;

function ngAdd(options) {
  return async (tree, context) => {
    const workspace = await workspace_1.getWorkspace(tree);
    const projectName = options.project || workspace.extensions.defaultProject;

    if (!projectName) {
      throw new schematics_1.SchematicsException(
        'Nao foi possivel determinar o projeto. Use --project=<nome>.'
      );
    }

    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new schematics_1.SchematicsException(
        `Projeto "${projectName}" nao encontrado no workspace.`
      );
    }

    const buildTarget = project.targets.get('build');
    if (!buildTarget) {
      throw new schematics_1.SchematicsException(
        `Projeto "${projectName}" nao tem target "build".`
      );
    }

    context.logger.info('');
    context.logger.info('⚡ HyperVault — Configurando seu projeto...');
    context.logger.info('');

    // 1. Add font links to index.html
    addFontLinks(tree, project, context);

    // 2. Add CSS variables to styles file
    addCssVariables(tree, buildTarget, options, context);

    // 3. Add stylePreprocessorOptions to angular.json
    await addIncludePaths(tree, workspace, projectName, buildTarget, context);

    context.logger.info('');
    context.logger.info('✅ HyperVault configurado com sucesso!');
    context.logger.info('');
    context.logger.info('Proximo passo: importe componentes nos seus standalone components:');
    context.logger.info('');
    context.logger.info("  import { HyperButton } from 'hypervault/button';");
    context.logger.info('');

    return tree;
  };
}

// ── 1. Font Links ──

function addFontLinks(tree, project, context) {
  const indexPath = getIndexHtmlPath(project);
  if (!indexPath || !tree.exists(indexPath)) {
    context.logger.warn('⚠ index.html nao encontrado — pule a adicao de fontes.');
    return;
  }

  const content = tree.readText(indexPath);

  // Check if already present
  if (content.includes('Space+Grotesk')) {
    context.logger.info('→ Fontes ja configuradas em index.html');
    return;
  }

  // Insert before </head>
  const headCloseIndex = content.indexOf('</head>');
  if (headCloseIndex === -1) {
    context.logger.warn('⚠ Tag </head> nao encontrada em index.html.');
    return;
  }

  const indent = '  ';
  const linksBlock = FONT_LINKS.map(l => `${indent}${l}`).join('\n');
  const updated = content.slice(0, headCloseIndex) + linksBlock + '\n' + content.slice(headCloseIndex);

  tree.overwrite(indexPath, updated);
  context.logger.info('→ Fontes adicionadas ao index.html');
}

// ── 2. CSS Variables ──

function addCssVariables(tree, buildTarget, options, context) {
  const stylesOption = buildTarget.options?.styles;
  if (!Array.isArray(stylesOption) || stylesOption.length === 0) {
    context.logger.warn('⚠ Nenhum arquivo de estilos encontrado no build target.');
    return;
  }

  // Find the main styles file
  const mainStyle = typeof stylesOption[0] === 'string' ? stylesOption[0] : stylesOption[0].input;

  if (!tree.exists(mainStyle)) {
    context.logger.warn(`⚠ Arquivo ${mainStyle} nao encontrado.`);
    return;
  }

  const content = tree.readText(mainStyle);

  // Check if already present
  if (content.includes('--primary') && content.includes('--font-sans')) {
    context.logger.info('→ CSS variables ja configuradas em ' + mainStyle);
  } else {
    // Prepend CSS variables
    const updated = CSS_VARIABLES + '\n' + content;
    tree.overwrite(mainStyle, updated);
    context.logger.info('→ CSS variables adicionadas em ' + mainStyle);
  }

  // Add scrollbar import if enabled
  if (options.scrollbar !== false) {
    const currentContent = tree.readText(mainStyle);
    if (!currentContent.includes('hypervault/styles/scrollbar')) {
      const scrollbarImport = "@use 'hypervault/styles/scrollbar';\n";

      // Insert after first comment block or at the top
      const commentEnd = currentContent.indexOf('*/');
      if (commentEnd !== -1) {
        const insertPos = commentEnd + 2;
        const updated = currentContent.slice(0, insertPos) + '\n' + scrollbarImport + currentContent.slice(insertPos);
        tree.overwrite(mainStyle, updated);
      } else {
        tree.overwrite(mainStyle, scrollbarImport + currentContent);
      }
      context.logger.info('→ Scrollbar customizado importado em ' + mainStyle);
    }
  }
}

// ── 3. Include Paths ──

async function addIncludePaths(tree, workspace, projectName, buildTarget, context) {
  const includePath = 'node_modules';

  const currentOptions = buildTarget.options || {};
  const preprocessorOptions = currentOptions.stylePreprocessorOptions || {};
  const currentPaths = preprocessorOptions.includePaths || [];

  if (currentPaths.includes(includePath)) {
    context.logger.info('→ SCSS include paths ja configurados');
    return;
  }

  const newPaths = [...currentPaths, includePath];

  await workspace_1.updateWorkspace(workspace, (ws) => {
    const proj = ws.projects.get(projectName);
    const bt = proj?.targets.get('build');
    if (bt) {
      if (!bt.options) bt.options = {};
      if (!bt.options.stylePreprocessorOptions) {
        bt.options.stylePreprocessorOptions = {};
      }
      bt.options.stylePreprocessorOptions.includePaths = newPaths;
    }
  });

  context.logger.info('→ SCSS include path "node_modules" adicionado ao angular.json');
}

// ── Helpers ──

function getIndexHtmlPath(project) {
  const buildTarget = project.targets.get('build');
  if (!buildTarget) return null;

  // Check for index option
  const indexOption = buildTarget.options?.index;
  if (typeof indexOption === 'string') return indexOption;
  if (indexOption && typeof indexOption === 'object' && indexOption.input) return indexOption.input;

  // Fallback: source root + index.html
  const sourceRoot = project.sourceRoot || project.root + '/src';
  return sourceRoot + '/index.html';
}
