// "Add Smile to your Face" as on the clinic's logo: "Smile" in red, with the trademark mark.
export default function Tagline({ className = "" }: { className?: string }) {
  return (
    <span className={`tagline ${className}`}>
      Add <em>Smile</em> to your Face<sup>&reg;</sup>
    </span>
  );
}
