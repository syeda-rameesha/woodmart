// src/app/contact/page.tsx
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact — WoodMart",
  description: "Get in touch with WoodMart",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <p className="text-gray-600 mb-6">
        Have a question? Send us a message and we'll get back to you.
      </p>

      <div className="max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}