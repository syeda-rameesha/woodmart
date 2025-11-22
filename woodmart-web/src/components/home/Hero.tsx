export default function Hero() {
  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Modern Furniture & More
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl">
          A clean WoodMart-style storefront built with Next.js. Fast, flexible, and ready to scale.
        </p>
        <div className="mt-6">
          <a
            href="/shop"
            className="inline-block rounded-md bg-black text-white px-6 py-3 text-sm font-semibold"
          >
            Shop now
          </a>
        </div>
      </div>
    </section>
  );
}