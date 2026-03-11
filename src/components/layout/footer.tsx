import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/components/layout/brand-lockup";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.35fr,1fr,1fr,1fr] md:px-6">
        <div className="space-y-4">
          <BrandLockup />
          <p className="max-w-sm text-sm leading-7 text-slate-600">
            Premium education discovery and admissions guidance platform for universities, programs, and career-first pathways across India and global learners.
          </p>

          <div className="space-y-2 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2">
              <MapPin className="icon-brand h-4 w-4" /> Faridabad, Haryana
            </p>
            <p className="inline-flex items-center gap-2">
              <Phone className="icon-brand h-4 w-4" /> +91 92666 02967
            </p>
            <p className="inline-flex items-center gap-2">
              <Mail className="icon-brand h-4 w-4" /> onlineuniversity2025@gmail.com
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            Trusted by students and counsellors nationwide
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li><Link href="/courses" className="inline-flex items-center gap-1 hover:text-blue-700">Courses <ArrowUpRight className="h-3 w-3" /></Link></li>
            <li><Link href="/universities" className="hover:text-blue-700">Universities</Link></li>
            <li><Link href="/about-us" className="hover:text-blue-700">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-blue-700">Contact Us</Link></li>
            <li><Link href="/blog" className="hover:text-blue-700">Blog</Link></li>
            <li><Link href="/compare" className="hover:text-blue-700">Compare Courses</Link></li>
            <li><Link href="/career-pathways" className="hover:text-blue-700">Career Pathways</Link></li>
            <li><Link href="/international-students" className="hover:text-blue-700">International Students</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Programs</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li><Link href="/courses?mode=regular" className="hover:text-blue-700">Regular Programs</Link></li>
            <li><Link href="/courses?mode=online" className="hover:text-blue-700">Online Programs</Link></li>
            <li><Link href="/courses?mode=distance" className="hover:text-blue-700">Distance Programs</Link></li>
            <li><Link href="/courses?mode=vocational" className="hover:text-blue-700">Vocational Programs</Link></li>
            <li><Link href="/courses?mode=skill-certification" className="hover:text-blue-700">Skill Certifications</Link></li>
            <li><Link href="/scholarship-emi" className="hover:text-blue-700">Scholarship + EMI</Link></li>
            <li><Link href="/application-tracking" className="hover:text-blue-700">Application Tracking</Link></li>
            <li><Link href="/online-mba-in-india" className="hover:text-blue-700">Online MBA in India</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li><Link href="/consultation" className="hover:text-blue-700">Free Consultation</Link></li>
            <li><Link href="/ratings" className="hover:text-blue-700">Ratings & Reviews</Link></li>
            <li><Link href="/authorizations" className="hover:text-blue-700">Authorizations</Link></li>
            <li><Link href="/privacy-security" className="hover:text-blue-700">Privacy & Security Policy</Link></li>
            <li><Link href="/admin" className="hover:text-blue-700">Admin Dashboard</Link></li>
            <li><Link href="/associate/dashboard" className="hover:text-blue-700">Associate Dashboard</Link></li>
            <li><Link href="/student/dashboard" className="hover:text-blue-700">Student Dashboard</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-slate-500 lg:px-8">
          <p>Copyright {new Date().getFullYear()} PAVM Power Education Services Pvt. Ltd. All rights reserved.</p>
          <p>Crafted for global-ready university discovery and admissions guidance.</p>
        </div>
      </div>
    </footer>
  );
}
