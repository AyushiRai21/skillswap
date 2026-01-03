export default function Footer({ onOpenGuidelines, onOpenFAQ }) {
  return (
    <footer id="contact" className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-3">SkillSwap</h3>
            <p className="text-sm text-slate-300">Connecting learners and teachers worldwide through the power of skill exchange. No money, just knowledge.</p>

            <div className="mt-6 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition cursor-pointer">f</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition cursor-pointer">t</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition cursor-pointer">ig</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition cursor-pointer">in</div>
            </div>

            <div className="mt-8 text-sm text-slate-400">
              <div className="font-semibold text-white mb-2">Contact Us</div>
              <p>Email: <a href="mailto:hello@skillswap.com" className="hover:text-emerald-400">hello@skillswap.com</a></p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer"><a href="#how">How It Works</a></li>
              <li className="hover:text-white cursor-pointer"><a href="/browse">Browse Skills</a></li>
              <li className="hover:text-white cursor-pointer"><a href="#stories">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer" onClick={(e) => { e.preventDefault(); if (onOpenGuidelines) onOpenGuidelines(); }}>Guidelines</li>
              <li className="hover:text-white cursor-pointer" onClick={(e) => { e.preventDefault(); if (onOpenFAQ) onOpenFAQ(); }}>FAQs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">Cookie Policy</li>
              <li className="hover:text-white cursor-pointer">Community Rules</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500 text-center">© 2026 SkillSwap. All rights reserved.</div>
      </div>
    </footer>
  );
}
