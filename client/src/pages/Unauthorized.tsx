export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600">
        Access Denied — You do not have permission to view this page.
      </h1>
    </div>
  );
}
