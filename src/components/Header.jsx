export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto flex items-center justify-center py-4 px-6 md:px-10">
        <img
          src="/images/optiimage-logo.png"
          alt="OptiImage"
          className="h-10 md:h-12"
        />
      </div>
    </header>
  );
}
