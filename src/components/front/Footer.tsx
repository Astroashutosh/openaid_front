import { Link } from "react-router-dom"


function Footer() {
  return (
    <>
    
       <footer className="border-t border-white/10 bg-[#03150D] py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="font-black text-xl text-white">OpenAid International</div>
              <div className="text-sm text-white/40 mt-1">Decentralized P2P System</div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
              <a href="#home" className="hover:text-[#D4A72C] transition">Home</a>
              <a href="#about" className="hover:text-[#D4A72C] transition">About</a>
              <a href="#system" className="hover:text-[#D4A72C] transition">System</a>
              <a href="#academy" className="hover:text-[#D4A72C] transition">Academy</a>
              <Link to="/login" className="hover:text-[#D4A72C] transition">Login</Link>
              <Link to="/register" className="hover:text-[#D4A72C] transition">Register</Link>
            </div>

            <div className="text-sm text-white/40 text-center md:text-right">
              &copy; {new Date().getFullYear()} OpenAid International. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    
    </>
  )
}

export default Footer