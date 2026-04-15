import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section text-center min-h-[60vh] flex items-center justify-center">
      <div>
        <div className="text-8xl font-sans font-bold text-green-100 mb-4">404</div>
        <h1 className="text-3xl font-bold text-dark mb-4">Page Not Found</h1>
        <p className="font-body text-gray-600 mb-8">That page doesn&apos;t exist. Let&apos;s get you back on track.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
