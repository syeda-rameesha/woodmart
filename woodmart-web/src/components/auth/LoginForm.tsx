export default function LoginForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="text-sm font-medium">
          Username or email address *
        </label>
        <input
          type="text"
          className="mt-1 w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Password *</label>
        <input
          type="password"
          className="mt-1 w-full border px-3 py-2 rounded"
        />
      </div>

      <button className="w-full bg-green-600 text-white py-3 rounded font-medium">
        LOG IN
      </button>

      <div className="flex justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Remember me
        </label>

        <a href="#" className="text-green-600">
          Lost your password?
        </a>
      </div>
    </form>
  );
}