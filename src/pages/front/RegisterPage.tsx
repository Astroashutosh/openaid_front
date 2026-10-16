



import React, { useState } from 'react';



import { Link } from 'react-router-dom';







import {



    Eye,



    EyeOff,



    Check,



    ArrowRight,



    User,



    Phone,



    Mail,



    Users,



    Lock,



    AlertCircle,



    CheckCircle2,



    X,



    FileText,



} from 'lucide-react';







import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';







type DocumentStep = 1 | 2;







export const RegisterPage: React.FC = () => {







    // Registration fields



    const [fullName, setFullName] = useState('');



    const [countryCode, setCountryCode] = useState('+60');



    const [phone, setPhone] = useState('');



    const [email, setEmail] = useState('');



    const [sponsorId, setSponsorId] = useState('OAI100001');



    const [sponsorValid, setSponsorValid] = useState<boolean | null>(true);



    const [password, setPassword] = useState('');



    const [passwordConfirm, setPasswordConfirm] = useState('');



    const [terms, setTerms] = useState(false);







    // Password visibility



    const [showPassword, setShowPassword] = useState(false);



    const [showConfirmPassword, setShowConfirmPassword] = useState(false);







    // Terms modal



    const [showTermsModal, setShowTermsModal] = useState(false);



    const [documentStep, setDocumentStep] = useState<DocumentStep>(1);



    const [acceptedDocuments, setAcceptedDocuments] = useState<number[]>([]);







    // Status



    const [isLoading] = useState(false);



    const [errorMessage, setErrorMessage] = useState('');







    const handleSponsorChange = (value: string) => {



        setSponsorId(value);



        setSponsorValid(value.trim().length >= 4);



    };







    // Validate the form, then open the terms review.



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {



        e.preventDefault();



        setErrorMessage('');







        if (!fullName.trim()) {



            setErrorMessage('Please enter your full name.');



            return;



        }







        if (!phone.trim()) {



            setErrorMessage('Please enter your phone number.');



            return;



        }







        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {



            setErrorMessage('Please enter a valid email address.');



            return;



        }







        if (sponsorId.trim().length < 4) {



            setErrorMessage('Please enter a valid Sponsor ID.');



            return;



        }







        if (password.length < 6) {



            setErrorMessage('Password must be at least 6 characters long.');



            return;



        }







        if (password !== passwordConfirm) {



            setErrorMessage('Passwords do not match. Please verify.');



            return;



        }







        if (!terms) {



            setErrorMessage(



                'Please agree to the Terms & Conditions and Privacy Policy.'



            );



            return;



        }







        setAcceptedDocuments([]);



        setDocumentStep(1);



        setShowTermsModal(true);



    };







    // Accept document 1 and move to document 2.



    const handleAcceptContinue = () => {



        setAcceptedDocuments((previous) =>



            previous.includes(1) ? previous : [...previous, 1]



        );







        setDocumentStep(2);



    };







    // Final step: only proceed after both documents are accepted.



    const handleCreateAccount = async (accepted: number[]) => {



        if (!accepted.includes(1) || !accepted.includes(2)) {



            setErrorMessage('Please accept both documents before registering.');



            return;



        }



        if (isLoading) return;


        setErrorMessage('');

        // 



        //   CONNECT YOUR REAL REGISTRATION API HERE.




        //  


        setErrorMessage(



            'Registration API is not connected. Please connect your backend endpoint.'



        );



    };







    const closeTermsModal = () => {



        if (isLoading) return;



        setShowTermsModal(false);



    };







    return (



        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#03150D]  flex flex-col">


            {/* Background */}

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(212,167,44,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(212,167,44,0.10),transparent_32%),linear-gradient(135deg,#03150D_0%,#082A1B_50%,#03150D_100%)]" />

            <div className="absolute inset-0 pointer-events-none opacity-[0.14] bg-[linear-gradient(rgba(212,167,44,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(212,167,44,.15)_1px,transparent_1px)] bg-[size:55px_55px]" />

            <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#D4A72C]/10 blur-[120px] pointer-events-none" />

            {/* Header */}



            <header



                className="relative z-20 w-full px-6 py-4 flex items-center justify-between"



            >



                <Link to="/" className="flex items-center gap-2.5">



                    <div className="w-10 h-10 rounded-xl bg-black border border-[#D4A72C]/40 flex items-center justify-center font-black text-sm text-[#D4A72C]">



                        OAI



                    </div>







                    <span className="font-extrabold text-white text-base tracking-tight hidden sm:inline">



                        OpenAid <span className="text-[#D4A72C]">International</span>



                    </span>



                </Link>







                <div className="flex items-center gap-3">



                    <LanguageSwitcher theme="dark" align="end" />







                    <Link



                        to="/login"



                        className="text-xs font-bold text-white hover:text-[#D4A72C] transition px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/5"



                    >



                        Member Login



                    </Link>



                </div>



            </header>







            {/* Registration Form */}



            <main



                className="relative z-10 flex-1 flex items-center justify-center px-3 sm:px-5 py-4 sm:py-6 min-h-0"



            >



                {!showTermsModal && (

                    <div className="w-full max-w-[1050px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[30px] border border-[#D4A72C]/25 bg-[#03150D]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl">







                        {/* Left Brand Panel */}



                        <div className="relative hidden lg:flex flex-col justify-between min-h-[720px] p-10 xl:p-12 bg-gradient-to-br from-[#0B3B27] via-[#082A1B] to-[#03150D] overflow-hidden border-r border-[#D4A72C]/15">



                            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D4A72C]/15 blur-3xl pointer-events-none" />







                            <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#D4A72C]/15 blur-3xl pointer-events-none" />







                            <div className="relative z-10">



                                <div className="w-16 h-16 rounded-2xl bg-black border border-[#D4A72C]/40 flex items-center justify-center">



                                    <span className="text-[#D4A72C] font-black text-2xl tracking-wider">



                                        OAI



                                    </span>



                                </div>







                                <h2 className="mt-8 text-4xl xl:text-5xl font-black leading-tight text-white">



                                    Build The Future



                                    <br />



                                    <span className="text-[#D4A72C]">Together.</span>



                                </h2>







                                <p className="mt-5 max-w-md text-white/60 text-sm leading-relaxed">



                                    Welcome to OpenAid International. Create your secure member



                                    account and join our decentralized peer-to-peer community



                                    funding ecosystem.



                                </p>



                            </div>







                            <div className="relative z-10 space-y-3.5 pt-6 border-t border-white/10">



                                {[



                                    'Decentralized ecosystem',



                                    'Smart contract powered',



                                    'Transparent transactions',



                                ].map((item) => (



                                    <div key={item} className="flex items-center gap-3.5">



                                        <div className="w-9 h-9 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/25 flex items-center justify-center text-[#D4A72C]">



                                            <Check className="w-4 h-4" />



                                        </div>



                                        <span className="text-white/80 text-xs font-semibold">



                                            {item}



                                        </span>



                                    </div>



                                ))}



                            </div>



                        </div>







                        {/* Right Registration Panel */}



                        <div className="p-6 sm:p-10 md:p-12 bg-[#03150D]/90 flex flex-col justify-center">







                            <div className="flex lg:hidden items-center justify-center mb-6">



                                <div className="w-14 h-14 rounded-2xl bg-black border border-[#D4A72C]/40 flex items-center justify-center">



                                    <span className="text-[#D4A72C] text-lg font-black">OAI</span>



                                </div>



                            </div>







                            <div className="mb-5">



                                <h1 className="text-2xl sm:text-3xl font-black text-white">



                                    Create Account



                                </h1>



                                <p className="mt-1 text-white/50 text-xs sm:text-sm">



                                    Join the OpenAid global community today.



                                </p>



                            </div>







                            {errorMessage && !showTermsModal && (



                                <div className="mb-4 p-3.5 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-medium flex items-center gap-2">



                                    <AlertCircle className="w-4 h-4 shrink-0" />



                                    <span>{errorMessage}</span>



                                </div>



                            )}







                            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">







                                {/* Full Name */}



                                <div>



                                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">



                                        Full Name



                                    </label>







                                    <div className="relative">



                                        <input



                                            type="text"



                                            value={fullName}



                                            onChange={(e) => setFullName(e.target.value)}



                                            placeholder="Enter your full name"



                                            autoComplete="name"



                                            required



                                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs sm:text-sm outline-none focus:border-[#D4A72C]/70 transition"



                                        />







                                        <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />



                                    </div>



                                </div>







                                {/* Country Dial and Phone */}



                                <div className="grid grid-cols-1  sm:grid-cols-[140px_1fr] gap-2.5">



                                    <div>



                                        <label className=" block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">



                                            Country Dial



                                        </label>







                                        <select



                                            value={countryCode}



                                            onChange={(e) => setCountryCode(e.target.value)}

                                            

                                            className="w-full h-12 px-3 rounded-xl bg-[#071B12]  border border-white/10  text-xs sm:text-sm outline-none focus:border-[#D4A72C]/70"



                                        >



                                            <option value="+60">+60 Malaysia</option>



                                            <option value="+1">+1 USA / Canada</option>



                                            <option value="+44">+44 UK</option>



                                            <option value="+234">+234 Nigeria</option>



                                            <option value="+91">+91 India</option>



                                            <option value="+971">+971 UAE</option>



                                            <option value="+62">+62 Indonesia</option>



                                            <option value="+63">+63 Philippines</option>



                                            <option value="+27">+27 South Africa</option>



                                        </select>



                                    </div>







                                    <div>



                                        <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">



                                            Phone Number



                                        </label>







                                        <div className="relative">



                                            <input



                                                type="tel"



                                                value={phone}



                                                onChange={(e) => setPhone(e.target.value)}



                                                placeholder="Enter mobile number"



                                                autoComplete="tel-national"



                                                required



                                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs sm:text-sm outline-none focus:border-[#D4A72C]/70 transition"



                                            />







                                            <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />



                                        </div>



                                    </div>



                                </div>







                                {/* Email */}



                                <div>



                                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">



                                        Email Address



                                    </label>







                                    <div className="relative">



                                        <input



                                            type="email"



                                            value={email}



                                            onChange={(e) => setEmail(e.target.value)}



                                            placeholder="Enter your email address"



                                            autoComplete="email"



                                            required



                                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs sm:text-sm outline-none focus:border-[#D4A72C]/70 transition"



                                        />







                                        <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />



                                    </div>



                                </div>







                                {/* Sponsor ID */}



                                <div>



                                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">



                                        Referral / Sponsor ID



                                    </label>







                                    <div className="relative">



                                        <input



                                            type="text"



                                            value={sponsorId}



                                            onChange={(e) => handleSponsorChange(e.target.value)}



                                            placeholder="Enter Sponsor ID"



                                            required



                                            className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs sm:text-sm outline-none focus:border-[#D4A72C]/70 transition font-mono"



                                        />







                                        <Users className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />







                                        {sponsorValid && (



                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />



                                        )}



                                    </div>







                                    <span className="text-[11px] text-white/40 mt-1 block">



                                        Sponsor ID must also be verified by the server.



                                    </span>



                                </div>







                                {/* Passwords */}



                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">



                                    <div>



                                        <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">



                                            Password



                                        </label>







                                        <div className="relative">



                                            <input



                                                type={showPassword ? 'text' : 'password'}



                                                value={password}



                                                onChange={(e) => setPassword(e.target.value)}



                                                placeholder="Min 6 characters"



                                                autoComplete="new-password"



                                                required



                                                className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs sm:text-sm outline-none focus:border-[#D4A72C]/70 transition"



                                            />







                                            <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />







                                            <button



                                                type="button"



                                                onClick={() => setShowPassword(!showPassword)}



                                                aria-label={showPassword ? 'Hide password' : 'Show password'}



                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"



                                            >



                                                {showPassword ? (



                                                    <EyeOff className="w-3.5 h-3.5" />



                                                ) : (



                                                    <Eye className="w-3.5 h-3.5" />



                                                )}



                                            </button>



                                        </div>



                                    </div>







                                    <div>



                                        <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">



                                            Confirm Password



                                        </label>







                                        <div className="relative">



                                            <input



                                                type={showConfirmPassword ? 'text' : 'password'}



                                                value={passwordConfirm}



                                                onChange={(e) => setPasswordConfirm(e.target.value)}



                                                placeholder="Repeat password"



                                                autoComplete="new-password"



                                                required



                                                className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs sm:text-sm outline-none focus:border-[#D4A72C]/70 transition"



                                            />







                                            <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />







                                            <button



                                                type="button"



                                                onClick={() =>



                                                    setShowConfirmPassword(!showConfirmPassword)



                                                }



                                                aria-label={



                                                    showConfirmPassword



                                                        ? 'Hide confirm password'



                                                        : 'Show confirm password'



                                                }



                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"



                                            >



                                                {showConfirmPassword ? (



                                                    <EyeOff className="w-3.5 h-3.5" />



                                                ) : (



                                                    <Eye className="w-3.5 h-3.5" />



                                                )}



                                            </button>



                                        </div>



                                    </div>



                                </div>







                                {/* Terms Checkbox */}



                                <div className="pt-1">



                                    <label className="flex items-start gap-2.5 text-xs text-white/60 cursor-pointer">



                                        <input



                                            type="checkbox"



                                            checked={terms}



                                            onChange={(e) => setTerms(e.target.checked)}



                                            required



                                            className="rounded accent-[#D4A72C] w-4 h-4 mt-0.5 shrink-0"



                                        />







                                        <span>



                                            I agree to the OpenAid{' '}



                                            <span className="text-[#D4A72C] underline">



                                                Terms &amp; Conditions



                                            </span>{' '}



                                            and{' '}



                                            <span className="text-[#D4A72C] underline">



                                                Privacy Policy



                                            </span>.



                                        </span>



                                    </label>



                                </div>







                                {/* Open terms before registering */}



                                <button



                                    type="submit"



                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(212,167,44,0.22)] hover:shadow-[0_0_40px_rgba(212,167,44,0.35)] transition-all flex items-center justify-center gap-2"



                                >



                                    <span>Create Member Account</span>



                                    <ArrowRight className="w-4 h-4" />



                                </button>



                            </form>







                            <div className="mt-6 text-center text-xs text-white/45">



                                Already have an account?{' '}



                                <Link



                                    to="/login"



                                    className="text-[#D4A72C] font-bold hover:text-[#F2C14E] ml-1"



                                >



                                    Login here →



                                </Link>



                            </div>



                        </div>



                    </div>



                )}

                {showTermsModal && (



                    <section className="w-full flex justify-center min-h-0">



                        <div

                            className="relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[26px] border border-[#D4A72C]/25 bg-[#03150D] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"

                            style={{

                                width: 'min(840px, calc(100vw - 24px))',

                                height: 'min(660px, calc(100dvh - 100px))',

                                maxWidth: '840px',

                                maxHeight: 'calc(100dvh - 100px)',

                                flexShrink: 0,

                            }}

                        >







                            {/* Modal Left Panel */}



                            <div className="relative hidden lg:flex flex-col justify-between min-h-0 h-full p-8 lg:p-10 bg-gradient-to-br from-[#0B3B27] via-[#082A1B] to-[#03150D] overflow-hidden border-r border-[#D4A72C]/15">



                                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D4A72C]/15 blur-3xl pointer-events-none" />







                                <div className="relative z-10">



                                    <div className="w-12 h-12 rounded-xl bg-black border border-[#D4A72C]/40 flex items-center justify-center text-[#D4A72C] font-black">



                                        OAI



                                    </div>







                                    <h2 className="mt-7 text-4xl font-black leading-tight text-white">



                                        Build The Future



                                        <br />



                                        <span className="text-[#D4A72C]">Together.</span>



                                    </h2>







                                    <p className="mt-5 max-w-md text-white/60 text-sm leading-relaxed">



                                        Welcome to OpenAid International. Create your secure



                                        account and join the decentralized P2P ecosystem.



                                    </p>



                                </div>







                                <div className="relative z-10 space-y-4 pt-6 border-t border-white/10">



                                    {[



                                        'Decentralized ecosystem',



                                        'Smart contract powered',



                                        'Transparent transactions',



                                    ].map((item) => (



                                        <div key={item} className="flex items-center gap-3.5">



                                            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/25 flex items-center justify-center text-[#D4A72C]">



                                                <Check className="w-4 h-4" />



                                            </div>



                                            <span className="text-white/80 text-xs font-semibold">



                                                {item}



                                            </span>



                                        </div>



                                    ))}



                                </div>



                            </div>







                            {/* Modal Right Panel */}



                            <div className="min-w-0 min-h-0 overflow-hidden flex flex-col gap-0 p-5 sm:p-6 lg:p-7 bg-[#03150D]">



                                <div className="flex items-start justify-between gap-3">



                                    <h2



                                        id="review-terms-title"



                                        className="text-2xl sm:text-[28px] font-black text-white leading-tight"



                                    >



                                        Review Terms &amp;



                                        <br />



                                        Conditions



                                    </h2>







                                    <button



                                        type="button"



                                        onClick={closeTermsModal}



                                        aria-label="Close document review"



                                        className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"



                                    >



                                        <X className="w-5 h-5" />



                                    </button>



                                </div>







                                <p className="mt-1.5 shrink-0 text-xs leading-relaxed text-white/50">



                                    Please read and accept our Terms and Conditions to continue



                                    with registration.



                                </p>







                                {/* Progress */}



                                <div
                                    className="mt-4 h-1.5 w-full shrink-0 overflow-hidden rounded-full"
                                    style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                                    role="progressbar"
                                    aria-label="Terms acceptance progress"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={documentStep === 1 ? 50 : 100}
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-in-out"
                                        style={{
                                            width: documentStep === 1 ? "50%" : "100%",
                                            backgroundColor: "#F2C14E",
                                        }}
                                    />
                                </div>







                                {/* Step Indicators */}



                                <div className="flex gap-2 mt-3 shrink-0">



                                    {[1, 2].map((step) => (



                                        <div



                                            key={step}



                                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${acceptedDocuments.includes(step)



                                                ? 'bg-emerald-600 text-white'



                                                : documentStep === step



                                                    ? 'bg-[#D4A72C] text-black'



                                                    : 'bg-white/5 border border-white/10 text-white/50'



                                                }`}



                                        >



                                            {acceptedDocuments.includes(step) ? (



                                                <Check className="w-4 h-4" />



                                            ) : (



                                                step



                                            )}



                                        </div>



                                    ))}



                                </div>







                                <p className="mt-3 shrink-0 text-xs font-bold leading-snug text-white/75">



                                    Document {documentStep} of 2:{' '}



                                    {documentStep === 1



                                        ? 'OpenAid International Member & Distributor Agreement'



                                        : 'OpenAid International Privacy Policy'}



                                </p>







                                {/* Scrollable Document */}



                                <div
                                    className="mt-3 shrink-0 overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#0B1F16] p-3 text-xs leading-[18px] text-white/70 [scrollbar-width:thin] [scrollbar-color:#D4A72C_#0B1F16]"
                                    style={{ height: "250px", minHeight: "250px", maxHeight: "250px" }}
                                >





                                    {documentStep === 1 ? (



                                        <>



                                            <div className="flex items-center gap-2 text-white font-bold">



                                                <FileText className="w-4 h-4 shrink-0 text-[#D4A72C]" />



                                                OpenAid International Member &amp; Distributor Agreement



                                            </div>







                                            <h3 className="mt-3 font-bold text-white">



                                                1. Agreement Purpose



                                            </h3>



                                            <p>



                                                This Agreement governs participation in the OpenAid



                                                International peer-to-peer donation and member referral



                                                ecosystem. Review the applicable rules and obligations



                                                before participating.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                2. Nature of the Platform



                                            </h3>



                                            <p>



                                                The platform facilitates peer-to-peer donation matching.



                                                Participation, matching and payments depend on applicable



                                                platform rules and actual member activity.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                3. Member Responsibilities



                                            </h3>



                                            <p>



                                                Members must provide accurate information, protect their



                                                account credentials, follow applicable procedures and



                                                comply with laws that apply to them.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                4. Financial Risk



                                            </h3>



                                            <p>



                                                Participation can involve financial risk. Matching,



                                                payments and returns are not guaranteed. Review the



                                                official agreement and understand the risks before



                                                participating.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                5. Applicable Rules



                                            </h3>



                                            <p>



                                                Refer to the complete official agreement for the



                                                platform's actual rules, obligations and conditions.



                                            </p>



                                        </>



                                    ) : (



                                        <>



                                            <div className="flex items-center gap-2 text-white font-bold">



                                                <FileText className="w-4 h-4 shrink-0 text-[#D4A72C]" />



                                                OpenAid International Privacy Policy



                                            </div>







                                            <h3 className="mt-3 font-bold text-white">



                                                1. Information Collected



                                            </h3>



                                            <p>



                                                Registration information may include name, phone number,



                                                email address and sponsor ID. The official privacy policy



                                                should specify the information actually collected.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                2. Use of Information



                                            </h3>



                                            <p>



                                                Information may be used to manage member accounts,



                                                provide platform services, communicate with members and



                                                meet applicable legal obligations.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                3. Data Security



                                            </h3>



                                            <p>



                                                Appropriate technical and organizational safeguards



                                                should be used to protect personal information.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                4. Data Retention and Rights



                                            </h3>



                                            <p>



                                                The official policy should explain data retention,



                                                applicable privacy rights, contact details and the



                                                procedure for submitting privacy-related requests.



                                            </p>







                                            <h3 className="mt-3 font-bold text-white">



                                                5. Policy Updates



                                            </h3>



                                            <p>



                                                Please consult the complete official privacy policy for



                                                the applicable terms and updates.



                                            </p>



                                        </>



                                    )}



                                </div>







                                {/* Modal Buttons */}



                                <div className="flex gap-2 mt-5 shrink-0">



                                    <button



                                        type="button"



                                        onClick={closeTermsModal}



                                        disabled={isLoading}



                                        className="px-4 py-2.5 rounded-xl border border-white/15 text-white/70 text-xs font-bold hover:bg-white/5 disabled:opacity-50"



                                    >



                                        Close



                                    </button>







                                    {documentStep === 1 ? (



                                        <button



                                            type="button"



                                            onClick={handleAcceptContinue}



                                            className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black text-xs sm:text-sm font-black hover:brightness-110"



                                        >



                                            Accept &amp; Continue →



                                        </button>



                                    ) : (



                                        <button



                                            type="button"



                                            disabled={isLoading}



                                            onClick={() => {



                                                const finalAcceptedDocuments = [1, 2];







                                                setAcceptedDocuments(finalAcceptedDocuments);







                                                void handleCreateAccount(finalAcceptedDocuments);



                                            }}



                                            className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black text-xs sm:text-sm font-black hover:brightness-110 disabled:opacity-50"



                                        >



                                            {isLoading



                                                ? 'Creating Account...'



                                                : 'Accept & Create Account →'}



                                        </button>



                                    )}



                                </div>







                                {errorMessage && (



                                    <div className="mt-3 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex gap-2">



                                        <AlertCircle className="w-4 h-4 shrink-0" />



                                        <span>{errorMessage}</span>



                                    </div>



                                )}







                                <p className="mt-4 shrink-0 text-center text-[10px] leading-tight text-white/40">



                                    Please review the official documents carefully before



                                    accepting.



                                </p>







                                <div className="mt-4 shrink-0 text-center text-xs text-white/50">



                                    Already have an account?{' '}



                                    <Link



                                        to="/login"



                                        className="text-[#D4A72C] font-bold hover:text-[#F2C14E]"



                                    >



                                        Login



                                    </Link>



                                </div>



                            </div>



                        </div>



                    </section>



                )}



            </main>







            {/* Footer */}



            <footer



                className="relative z-10 py-4 text-center text-xs text-white/35 border-t border-white/5"



            >



                © {new Date().getFullYear()} OpenAid International. All rights reserved.



            </footer>







        </div>



    );



};







export default RegisterPage;
