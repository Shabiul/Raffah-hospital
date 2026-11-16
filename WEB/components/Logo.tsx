// Dentizz tooth logo, shown on a white disc with a blue ring so it reads on any section colour.
export default function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/tooth.png" alt="" width={630} height={887} />
    </span>
  );
}
