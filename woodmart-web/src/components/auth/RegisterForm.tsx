export default function RegisterForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="text-sm font-medium">Email address *</label>
        <input
          type="email"
          className="mt-1 w-full border px-3 py-2 rounded"
        />
      </div>

      <p className="text-xs text-gray-500">
        A link to set a new password will be sent to your email address.
      </p>

      <button className="w-full bg-green-600 text-white py-3 rounded font-medium">
        REGISTER
      </button>
    </form>
  );
}