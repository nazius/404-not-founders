export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-300">© {currentYear} 404 Not Founders Challenge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
