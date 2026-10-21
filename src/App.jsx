import React, { useState } from 'react';

// --- Reusable SVG Icons ---
const CheckIcon = ({ className = "w-5 h-5 text-emerald-500" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon = ({ className = "w-5 h-5 text-rose-500" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WhatsAppIcon = ({ className = "w-6 h-6 text-white" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);

const GlobeIcon = ({ className = "w-5 h-5 text-slate-400" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    // Form State with Country Code separation
    const [countryCode, setCountryCode] = useState('+91');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        level: 'intermediate',
        goal: 'workplace',
        preferredTime: 'evening',
    });

    // --- CONFIGURATION ---
    // Replace with your actual WhatsApp contact number (Country Code + Phone, digits only, no + or spaces)
    const COACH_WHATSAPP_NUMBER = "+919250331913";
    // Get your free access key from https://web3forms.com
    const WEB3FORMS_ACCESS_KEY = "YOUR-ACCESS-KEY-HERE";

    // Common Country Dial Codes
    const countryList = [
        { code: '+91', country: 'India (IN)' },
        { code: '+1', country: 'USA / Canada (+1)' },
        { code: '+44', country: 'UK (+44)' },
        { code: '+971', country: 'UAE (+971)' },
        { code: '+61', country: 'Australia (+61)' },
        { code: '+65', country: 'Singapore (+65)' },
        { code: '+966', country: 'Saudi Arabia (+966)' },
        { code: '+49', country: 'Germany (+49)' },
        { code: '+33', country: 'France (+33)' },
        { code: '+60', country: 'Malaysia (+60)' },
        { code: '+64', country: 'New Zealand (+64)' },
        { code: '+27', country: 'South Africa (+27)' },
        { code: '+81', country: 'Japan (+81)' },
        { code: 'other', country: 'Other (type with +)' },
    ];

    // International phone validator (E.164: 7 to 15 digits)
    const validateInternationalPhone = (rawPhone, selectedCode) => {
        const cleanDigits = rawPhone.replace(/\D/g, '');

        if (selectedCode === 'other') {
            // Must include leading '+' and 8 to 15 total digits
            return /^\+[1-9]\d{7,14}$/.test(rawPhone.trim());
        }

        // Number length without country code should typically be 6 to 12 digits
        return cleanDigits.length >= 6 && cleanDigits.length <= 13;
    };

    const handlePhoneInputChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, phone: val });
        if (phoneError && validateInternationalPhone(val, countryCode)) {
            setPhoneError('');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // 1. Validate International Phone
        if (!validateInternationalPhone(formData.phone, countryCode)) {
            if (countryCode === 'other') {
                setPhoneError('Please include your country code with a leading + (e.g. +491512345678)');
            } else {
                setPhoneError(`Please enter a valid phone number for ${countryCode} (6-13 digits)`);
            }
            return;
        }
        setPhoneError('');
        setIsSubmitting(true);

        // Format full phone with country code
        const fullPhoneNumber = countryCode === 'other'
            ? formData.phone.trim()
            : `${countryCode} ${formData.phone.trim()}`;

        try {
            // 2. Deliver Lead to Your Email via Web3Forms API
            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `OratorOak Booking: ${formData.name} (${fullPhoneNumber})`,
                    from_name: "OratorOak Admissions",
                    name: formData.name,
                    phone: fullPhoneNumber,
                    level: formData.level,
                    goal: formData.goal,
                    preferred_time: formData.preferredTime,
                }),
            });

            // 3. Construct WhatsApp Message for Coach
            const waMessage =
                `*New Diagnostic Call Booking - OratorOak*%0A%0A` +
                `*Student Name:* ${encodeURIComponent(formData.name)}%0A` +
                `*Contact:* ${encodeURIComponent(fullPhoneNumber)}%0A` +
                `*Current Level:* ${encodeURIComponent(formData.level)}%0A` +
                `*Target Goal:* ${encodeURIComponent(formData.goal)}%0A` +
                `*Preferred Slot:* ${encodeURIComponent(formData.preferredTime)}`;

            window.open(`https://wa.me/${COACH_WHATSAPP_NUMBER}?text=${waMessage}`, '_blank');

            setFormSubmitted(true);
        } catch (err) {
            console.error("Booking error:", err);
            // Fallback: still show confirmation screen
            setFormSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const programs = [
        {
            title: "Foundational Fluency",
            subtitle: "For individuals who know words but freeze while forming sentences.",
            badge: "Beginner Friendly",
            duration: "3 Months",
            features: [
                "Eliminate the 'Translating in your mind' reflex",
                "Master everyday basic conversation templates",
                "Pronunciation corrections & tongue training",
                "100% judgment-free environment"
            ],
            idealFor: "Learners with severe speaking anxiety or hesitation."
        },
        {
            title: "Workplace & Career Speaking",
            subtitle: "For professionals who struggle during meetings, standups, and interviews.",
            badge: "Most Popular",
            duration: "1 Month",
            features: [
                "Confidently voice opinions in Zoom / in-person meetings",
                "Mock interview drills, and salary negotiations",
                "Professional email & small talk etiquette",
                "Reducing Mother Tongue Influence (MTI)"
            ],
            idealFor: "Software engineers, managers, and corporate professionals."
        },
        {
            title: "Advanced English",
            subtitle: "For mastering higher education and natural flow.",
            badge: "Advanced",
            duration: "2 Months",
            features: [
                "Entire Advanced English concepts as per the curriculum",
                "Storytelling structures for presentations & speeches",
                "Handling impromptu / spontaneous questions under pressure"
            ],
            idealFor: "Students aiming for higher education and competitive preparations."
        }
    ];

    const faqs = [
        {
            q: "Can I attend if I live outside India or in a different timezone?",
            a: "Yes. All classes are conducted live 1-on-1 over Zoom or Google Meet. We accommodate students from North America, Europe, the Middle East, and Asia with flexible morning, evening, and weekend slots."
        },
        {
            q: "My English is very weak. Will I feel embarrassed or judged?",
            a: "Never. OratorOak was created specifically for individuals who feel nervous or shy. Our coaches treat every class as a safe laboratory where making mistakes is actively encouraged as the only path to fluency."
        },
        {
            q: "Will we spend hours on grammar rules and writing?",
            a: "No. You spent years in school studying grammar, yet speaking remains challenging. At OratorOak, 80% of session time is spent in active conversation and spoken drills. Grammar is corrected contextually as you speak."
        },
        {
            q: "What happens during the Free 15-Minute Diagnostic Call?",
            a: "You'll have a quick, pressure-free chat with an instructor. We will listen to your natural speaking pattern, identify your specific hesitation triggers (e.g., vocabulary gap, translation habit, or speed anxiety), and suggest a custom roadmap."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white font-sans">

            {/* --- Sticky Navigation Bar --- */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
                            <span className="font-extrabold text-xl tracking-tight">O</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-brand-950">
              Orator<span className="text-brand-600">Oak</span>
            </span>
                    </a>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#why-us" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition">Why OratorOak</a>
                        <a href="#curriculum" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition">Programs</a>
                        <a href="#comparison" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition">The Method</a>
                        <a href="#faqs" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition">FAQ</a>
                        <a
                            href="#book-trial"
                            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition active:scale-95"
                        >
                            Book Free Trial
                        </a>
                    </nav>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        aria-label="Toggle Menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3">
                        <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Why OratorOak</a>
                        <a href="#curriculum" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Programs</a>
                        <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">The Method</a>
                        <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">FAQ</a>
                        <a href="#book-trial" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center bg-brand-600 text-white font-semibold py-3 rounded-lg">
                            Book Free Trial
                        </a>
                    </div>
                )}
            </header>

            {/* --- Hero Section --- */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-brand-800 text-xs sm:text-sm font-semibold mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
                        Private Online Spoken English Mentorship
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
                        Stop Translating in Your Head. <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              Speak English with Natural Confidence.
            </span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Eliminate hesitation, overcome fear of judgment, and master spontaneous workplace and daily English in a comfortable, 100% judgment-free environment.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#book-trial"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-600/30 hover:shadow-xl transition-all active:scale-95"
                        >
                            Book Free 15-Min Diagnostic Call
                        </a>
                        <a
                            href={`https://wa.me/${COACH_WHATSAPP_NUMBER}?text=Hi%20OratorOak,%20I%20am%20interested%20in%20your%20online%20spoken%20English%20classes`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
                        >
                            <WhatsAppIcon className="w-5 h-5 text-emerald-600" />
                            Chat on WhatsApp
                        </a>
                    </div>

                    {/* Trust Highlights */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                            <span className="text-amber-500 font-bold text-base">★★★★★</span>
                            <span>4.9/5 from 300+ Global Students</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GlobeIcon className="w-4 h-4 text-brand-600" />
                            <span>Live on Zoom / Meet (All Timezones)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckIcon className="w-4 h-4 text-brand-600" />
                            <span>Personalized 1-on-1 Attention</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- Pain Points Section --- */}
            <section id="why-us" className="py-20 bg-white border-y border-slate-200/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">The Hidden Barrier</h2>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Why Traditional Grammar Classes Never Made You Fluent</p>
                        <p className="mt-3 text-slate-600">You already know words and rules. Your struggle isn’t lack of intelligence—it’s lack of low-pressure verbal muscle memory.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "The Mind-Blank Reflex",
                                desc: "You form the sentence perfectly in your native language, but freeze when trying to say it out loud in English."
                            },
                            {
                                title: "Workplace Imposter Syndrome",
                                desc: "You stay quiet during team meetings even when you have brilliant ideas, fearing someone might judge your accent."
                            },
                            {
                                title: "Speed & Filler Anxiety",
                                desc: "Using 'uhm', 'like', and long pauses because you feel pressured to reply instantly."
                            },
                            {
                                title: "Rote Grammar Overload",
                                desc: "Memorizing tenses and formulas won't help you speak spontaneously in a high-stakes interview."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-200 transition">
                                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 font-bold text-lg">
                                    !
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Interactive Curriculum Tabs --- */}
            <section id="curriculum" className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">Customized Pathways</h2>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Choose Your Learning Track</p>
                        <p className="mt-2 text-slate-600">Every learner has unique blockers. Select the path that fits your current goals.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {programs.map((prog, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                                    activeTab === index
                                        ? 'bg-brand-900 text-white shadow-md'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {prog.title}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>
                <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold rounded-full mb-2">
                  {programs[activeTab].badge}
                </span>
                                <h3 className="text-2xl font-bold text-slate-900">{programs[activeTab].title}</h3>
                            </div>
                            <div className="text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
                                Estimated: {programs[activeTab].duration}
                            </div>
                        </div>

                        <p className="text-slate-600 mb-6 text-base">{programs[activeTab].subtitle}</p>

                        <div className="border-t border-slate-100 pt-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">What you will master:</h4>
                            <ul className="space-y-3.5 mb-8">
                                {programs[activeTab].features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base">
                                        <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-xs sm:text-sm text-brand-900 flex items-center justify-between">
                                <span><strong>Recommended for:</strong> {programs[activeTab].idealFor}</span>
                                <a href="#book-trial" className="font-bold text-brand-600 hover:text-brand-800 ml-2 whitespace-nowrap">
                                    Enroll Now →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Before vs After Comparison Matrix --- */}
            <section id="comparison" className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">The OratorOak Difference</h2>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">How Your Communication Transforms</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-7">
                            <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-xs">✕</span>
                                Self-Doubt & Hesitation (Before)
                            </h3>
                            <ul className="space-y-3 text-sm text-rose-950/80">
                                <li className="flex items-start gap-2.5">
                                    <CrossIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    Pausing for 5-10 seconds searching for the "perfect word"
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CrossIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    Saying "Sorry for my bad English" before starting to talk
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CrossIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    Heart racing when the manager asks for your spontaneous opinion
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CrossIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    Avoiding interviews with global/multinational companies
                                </li>
                            </ul>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-7">
                            <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs">✓</span>
                                Calm Fluency & Presence (With OratorOak)
                            </h3>
                            <ul className="space-y-3 text-sm text-emerald-950/80">
                                <li className="flex items-start gap-2.5">
                                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    Thinking and speaking directly in English without internal translation
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    Owning the conversation comfortably with calm pacing and clear tone
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    Handling unexpected questions using structured communication frameworks
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    Cracking interviews with leadership presence and crisp articulation
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- International Diagnostic Booking Section --- */}
            <section id="book-trial" className="py-20 bg-slate-900 text-white relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">1-on-1 Online Diagnostic</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Book Your 15-Min Diagnostic Call</h2>
                        <p className="mt-3 text-slate-400 text-sm sm:text-base">
                            Speak 1-on-1 with a senior communication coach. We’ll analyze your hesitation patterns and map a custom learning roadmap. 100% free.
                        </p>
                    </div>

                    <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl">
                        {formSubmitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckIcon className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Application Received!</h3>
                                <p className="mt-2 text-slate-600 max-w-md mx-auto">
                                    Thank you, <strong>{formData.name}</strong>. Our mentors will review your profile and confirm your slot via WhatsApp/Email shortly.
                                </p>
                                <button
                                    onClick={() => setFormSubmitted(false)}
                                    className="mt-6 text-sm font-semibold text-brand-600 hover:underline"
                                >
                                    Submit another application
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Name Input */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Alex Morgan"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm transition"
                                        />
                                    </div>

                                    {/* International Phone Input */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                            WhatsApp / Phone (with Country) *
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={countryCode}
                                                onChange={(e) => {
                                                    setCountryCode(e.target.value);
                                                    setPhoneError('');
                                                }}
                                                className="w-1/3 px-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition"
                                            >
                                                {countryList.map((c, i) => (
                                                    <option key={i} value={c.code}>{c.country}</option>
                                                ))}
                                            </select>

                                            <input
                                                type="tel"
                                                required
                                                placeholder={countryCode === 'other' ? "+1 415 555 2671" : "e.g. 98765 43210"}
                                                value={formData.phone}
                                                onChange={handlePhoneInputChange}
                                                className={`w-2/3 px-4 py-3 rounded-xl border outline-none text-sm transition ${
                                                    phoneError
                                                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-100'
                                                        : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-100'
                                                }`}
                                            />
                                        </div>
                                        {phoneError && (
                                            <p className="mt-1 text-xs text-rose-500 font-medium">{phoneError}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    {/* Current Level */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                            Current English Level
                                        </label>
                                        <select
                                            value={formData.level}
                                            onChange={(e) => setFormData({...formData, level: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm bg-white"
                                        >
                                            <option value="beginner">Beginner (Struggle with sentence making)</option>
                                            <option value="intermediate">Intermediate (Understand well, hesitate to speak)</option>
                                            <option value="advanced">Advanced (Need executive polish & tone)</option>
                                        </select>
                                    </div>

                                    {/* Primary Goal */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                            Primary Goal
                                        </label>
                                        <select
                                            value={formData.goal}
                                            onChange={(e) => setFormData({...formData, goal: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm bg-white"
                                        >
                                            <option value="workplace">Office meetings & team calls</option>
                                            <option value="interviews">Job Interviews & Career Moves</option>
                                            <option value="daily">Daily casual conversation & confidence</option>
                                            <option value="public_speaking">Presentations & Public Speaking</option>
                                        </select>
                                    </div>

                                    {/* Preferred Timezone / Time */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                            Preferred Time Slot
                                        </label>
                                        <select
                                            value={formData.preferredTime}
                                            onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm bg-white"
                                        >
                                            <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                                            <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                                            <option value="evening">Evening (5:00 PM - 9:30 PM)</option>
                                            <option value="weekend">Weekends Only</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-4 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-bold text-base rounded-xl shadow-lg shadow-brand-600/30 transition duration-200 active:scale-[0.99]"
                                >
                                    {isSubmitting ? 'Confirming Your Slot...' : 'Confirm Free 15-Minute Diagnostic Call'}
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-2">
                                    🔒 We respect your privacy. No spam or unsolicited calls.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section id="faqs" className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">Got Questions?</h2>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-slate-200 rounded-2xl overflow-hidden transition"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:bg-slate-50 transition"
                                >
                                    <span className="text-base sm:text-lg">{faq.q}</span>
                                    <span className="text-xl text-brand-600 ml-4 font-normal">
                    {openFaq === index ? '−' : '+'}
                  </span>
                                </button>
                                {openFaq === index && (
                                    <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div>
                        <div className="text-xl font-bold text-white tracking-tight">
                            Orator<span className="text-brand-500">Oak</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Building authentic spoken English confidence, one learner at a time.
                        </p>
                    </div>
                    <div className="text-xs text-slate-500">
                        © {new Date().getFullYear()} OratorOak (www.oratoroak.com). All rights reserved.
                    </div>
                </div>
            </footer>

            {/* --- Floating WhatsApp Button --- */}
            <a
                href={`https://wa.me/${COACH_WHATSAPP_NUMBER}?text=Hello%20OratorOak!%20I%20would%20like%20to%20learn%20more%20about%20your%20English%20mentorship.`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105"
                aria-label="Direct WhatsApp Support"
            >
                <WhatsAppIcon className="w-6 h-6"/>
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-sm pr-1"/>

            </a>

        </div>
    );
}