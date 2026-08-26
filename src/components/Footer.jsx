export default function Footer() {
  return (
    <footer className="w-full py-6 px-6 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} OptiImage. All rights reserved.</p>
        <p>
          Powered by{' '}
          <a
            href="https://optiimage-server-ev2l.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-opti-blue hover:text-dark-blue transition-colors"
          >
            OptiImage API
          </a>
        </p>
      </div>
    </footer>
  );
}
