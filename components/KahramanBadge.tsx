import Link from "next/link";

export default function KahramanBadge() {
  return (
    <footer className="w-full border-t-[3px] border-black bg-white py-6 mt-auto z-10">
      <div className="max-w-[1000px] mx-auto px-4 flex items-center justify-between">
        
        <div className="text-black font-black uppercase tracking-tight text-sm">
          &copy; {new Date().getFullYear()} Discobolos
        </div>

        <Link
          href="https://kahramanlabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-white border-[3px] border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] transition-all group"
          aria-label="KahramanLabs Portfolio"
        >
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 120 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="group-hover:scale-110 transition-transform"
          >
            <rect x="16" y="16" width="96" height="96" fill="black" />
            <rect x="8" y="8" width="96" height="96" fill="white" stroke="black" strokeWidth="8" />
            <text x="56" y="74" fontFamily="system-ui, -apple-system, Arial, sans-serif" fontWeight="900" fontSize="52" fill="black" textAnchor="middle" letterSpacing="-2">KB</text>
          </svg>
        </Link>
        
      </div>
    </footer>
  );
}