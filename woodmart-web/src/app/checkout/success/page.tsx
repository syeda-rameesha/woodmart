// src/app/checkout/success/page.tsx
import Link from "next/link";

export default function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Thank you! 🎉</h1>
      <p className="mt-2 text-gray-600">
        Your order has been placed successfully.
      </p>

      {/* display order id if available */}
      {/* Note: searchParams is a Promise in Next 14 app dir */}
      {/* We unwrap it client-side with an async wrapper */}
      <AsyncOrderId sp={searchParams} />

      <div className="mt-6">
        <Link href="/" className="underline hover:text-black">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

async function AsyncOrderId({ sp }: { sp: Promise<Record<string, string | undefined>> }) {
  const s = await sp;
  const id = s.orderId;
  if (!id) return null;
  return <p className="mt-1 text-sm text-gray-500">Order ID: {id}</p>;
}