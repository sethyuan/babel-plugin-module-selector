import * as path from "path"
import * as fs from "fs"

function pathExists(filePath, extensions) {
  if (path.extname(filePath)) {
    return fs.existsSync(filePath)
  } else {
    return extensions.some((ext) => fs.existsSync(`${filePath}${ext}`))
  }
}

export default ({types: t}) => {
  function transformImportCall(p, state) {
    const roots = state.opts.roots.map((root) => path.join(process.cwd(), root))
    const selectorsRoot = state.opts.selectorsRoot
    const selector = process.env.BABEL_MODULE_SELECTOR || state.opts.selector
    const exts = state.opts.extensions || [".js", ".jsx"]
    const source = p.get("source")
    const currentFile = state.file.opts.filename
    const sourceText = source.node.value
    const currentFileDir = path.dirname(currentFile)

    if (source.type === "StringLiteral"
        && selector
        && roots.some((root) => currentFile.includes(root))
        && sourceText.startsWith(".")) {
      const root = roots.find((root) => currentFile.includes(root))

      const destPath = path.join(
        root,
        selectorsRoot,
        selector,
        path.relative(
          root,
          path.join(currentFileDir, sourceText)
        )
      )

      if (destPath !== currentFile && pathExists(destPath, exts)) {
        const modulePath = path.relative(
          path.dirname(state.file.opts.filename),
          destPath,
        )
        source.replaceWith(t.stringLiteral(modulePath))
      }
    }
  }

  return {
    visitor: {
      ImportDeclaration: {
        exit(p, state) {
          transformImportCall(p, state)
        }
      }
    }
  }
}
