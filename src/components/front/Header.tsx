import { useState } from "react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { Menu, X } from "lucide-react";


function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);


  return (
    <>

      <header className=" fixed top-0 left-0 w-full z-50 bg-[#082A1B]/90 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="h-[76px] flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black border border-[#D4A72C]/40 flex items-center justify-center font-black text-sm sm:text-lg text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.25)]">
                OAI
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
                  OpenAid
                </span>
                <span className="text-[10px] tracking-widest text-[#D4A72C] font-semibold uppercase block">
                  International
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-sm font-semibold">
              <Link to="/" className="text-[#F2C14E] hover:text-white transition">
                Home
              </Link>
              <a href="#about" className="text-[#F2C14E] hover:text-white transition">
                About
              </a>
              <a href="#system" className="text-[#F2C14E] hover:text-white transition">
                System
              </a>
              <a href="#income" className="text-[#F2C14E] hover:text-white transition">
                Income
              </a>
              <a href="#academy" className="text-[#F2C14E] hover:text-white transition">
                Academy
              </a>
         
                  <Link to="/testimonial" className="text-[#F2C14E] hover:text-white transition">
                Testimonials
              </Link>

     <Link to="/disclaimer" className="text-[#F2C14E] hover:text-white transition">
                Disclaimer
              </Link>

              <a href="#contact" className="text-[#F2C14E] hover:text-white transition">
                Contact
              </a>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher theme="dark" align="end" />

              <Link
                to="/login"
                className="px-5 py-2 rounded-full border border-[#D4A72C]/40 text-white text-sm font-semibold hover:bg-[#D4A72C]/10 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-bold text-sm shadow-[0_0_20px_rgba(212,167,44,0.25)] hover:shadow-[0_0_30px_rgba(212,167,44,0.4)] transition"
              >
                Register
              </Link>
            </div>

            {/* Mobile Toggle & Language */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSwitcher theme="dark" align="end" />
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="w-11 h-11 rounded-xl border border-[#D4A72C]/30 bg-black/40 text-[#D4A72C] flex items-center justify-center text-xl hover:bg-[#D4A72C]/10 transition"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-5 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 rounded-2xl bg-[#052718]/95 border border-[#D4A72C]/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-2">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  Home
                </Link>
                <a
                  href="#about"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  About
                </a>
                <a
                  href="#system"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  System
                </a>
                <a
                  href="#income"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  Income
                </a>
                <a
                  href="#academy"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  Academy
                </a>
                   <Link
                  to="/testimonial"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  Testimonials
                </Link>

       <Link
                  to="/disclaimer"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  Disclaimer
                </Link>



                <a
                  href="#contact"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 rounded-xl text-[#F2C14E] font-semibold text-sm hover:bg-[#D4A72C]/10 hover:text-white transition"
                >
                  Contact
                </a>

                <div className="my-3 border-t border-white/10" />

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full px-5 py-3 rounded-xl border border-[#D4A72C]/40 text-white font-semibold text-sm hover:bg-[#D4A72C]/10 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-bold text-sm shadow-[0_0_20px_rgba(212,167,44,0.3)] transition"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacing for fixed header */}
      <div className="h-[76px]" />

    </>
  )
}

export default Header