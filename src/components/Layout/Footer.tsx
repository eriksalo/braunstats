interface FooterProps {
  generatedAt: string | null
}

export function Footer({ generatedAt }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 px-4 py-3 text-xs text-gray-400 text-center">
      <span>BraunStats — Denver Nuggets Stats Explorer</span>
      {generatedAt && (
        <span className="ml-2">
          · Data updated {new Date(generatedAt).toLocaleDateString()}
        </span>
      )}
    </footer>
  )
}
