/**
 * Visas direkt när man klickar sig vidare i admin, medan sidan hämtas.
 * Gör också att Next kan förladda ramen runt dynamiska sidor, så navigeringen
 * känns omedelbar i stället för att sidan står kvar tills servern svarar.
 */
export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Laddar">
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-lg bg-line/70" />
        <div className="h-4 w-80 max-w-full rounded bg-line/50" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-line bg-white" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl border border-line bg-white" />
        ))}
      </div>
      <span className="sr-only">Laddar …</span>
    </div>
  );
}
