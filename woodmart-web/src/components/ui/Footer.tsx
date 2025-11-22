import Link from 'next/link';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="mt-12">
      {/* gradient strip */}
      <div className="bg-gradient-to-r from-secondary to-primary text-white">
        <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">Need help?</h4>
            <p className="opacity-90">Our team is here 7 days a week.</p>
          </div>
          <div className="flex items-center gap-4">
            <PhoneIcon className="h-6 w-6" />
            <div>
              <div className="font-semibold">+1 (555) 123-4567</div>
              <div className="opacity-90 text-sm">9:00–18:00 (Mon–Sun)</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <EnvelopeIcon className="h-6 w-6" />
            <div>
              <div className="font-semibold">support@woodmart.dev</div>
              <div className="opacity-90 text-sm">We reply within 24h</div>
            </div>
          </div>
        </div>
      </div>

      {/* links */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-gray-900 font-semibold mb-3">Shop</h5>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-primary" href="/shop">All products</Link></li>
              <li><Link className="hover:text-primary" href="/category/furniture">Furniture</Link></li>
              <li><Link className="hover:text-primary" href="/category/cooking">Cooking</Link></li>
              <li><Link className="hover:text-primary" href="/category/fashion">Fashion</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-gray-900 font-semibold mb-3">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-primary" href="/about">About</Link></li>
              <li><Link className="hover:text-primary" href="/contact">Contact</Link></li>
              <li><Link className="hover:text-primary" href="/policies/shipping">Shipping</Link></li>
              <li><Link className="hover:text-primary" href="/policies/returns">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-gray-900 font-semibold mb-3">Visit</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <span>221B Baker Street<br/>London, UK</span>
              </li>
              <li><Link className="hover:text-primary" href="/stores">Store locator</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-gray-900 font-semibold mb-3">Newsletter</h5>
            <p className="text-sm text-gray-600 mb-3">Get product news & exclusive offers.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}
              className="flex"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                className="rounded-r-md bg-primary hover:bg-emerald-600 text-white px-4"
                type="submit"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-4 text-sm text-gray-600 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} WoodMart. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs">Secure</span>
            <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs">Fast delivery</span>
            <span className="rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs">24/7 support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}