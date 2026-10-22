export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Bookly. Built with Next.js, TypeScript and Tailwind CSS.
      </div>
    </footer>
  );
}