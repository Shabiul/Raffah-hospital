// The clinic photos in public/gallery: gNN.jpg is the full size, mNN.jpg the lighter grid version.
export type Photo = { n: number; w: number; h: number; alt: string };

const portrait = new Set([0, 2, 3, 6, 9, 10, 12, 14, 16, 17, 21, 24, 25, 26]);

const alts = [
  "The Dentizz entrance with the glass front and door",
  "The waiting lounge with a long sofa and wall posters",
  "The Dentizz signboard above Serpentine Street",
  "The waiting area and reception seen from the door",
  "The Dentizz shopfront and signboard",
  "The reception desk and blue waiting chairs",
  "The consultation desk and doctor's chair",
  "The kids' height and teeth chart beside the reception",
  "The waiting lounge",
  "The consultation room",
  "The doctor's consultation desk",
  "The clinic frontage on Serpentine Street",
  "A treatment room with a dental chair",
  "The glass entrance door of the clinic",
  "The consultation room desk",
  "A dental chair with its instrument tray",
  "The clinic building and signboard",
  "A dental chair and equipment",
  "The waiting area with framed dental posters",
  "A dental chair and overhead light",
  "The wash basin and sterilisation corner",
  "The wash basin under the smile poster",
  "The clinic workstation and instrument counter",
  "The entrance door seen from outside",
  "The reception counter and television",
  "The Dentizz reception counter",
  "Two dental chairs in the treatment room",
  "The treatment room with two dental chairs",
];

export const photos: Photo[] = alts.map((alt, n) => ({
  n,
  alt,
  w: portrait.has(n) ? 675 : 900,
  h: portrait.has(n) ? 900 : 677,
}));

export const pad = (n: number) => String(n).padStart(2, "0");
export const full = (n: number) => `/gallery/g${pad(n)}.jpg`;
export const medium = (n: number) => `/gallery/m${pad(n)}.jpg`;
export const small = (n: number) => `/gallery/s${pad(n)}.jpg`;

/** Photos used elsewhere on the page, so the grid does not repeat them. */
export const HERO = 27;
export const ABOUT = 26;
export const COLLAGE = [8, 2, 0, 5, 17];
/** Used by the photo tour, the circle reveal and the service rows. */
export const TOUR_PHOTOS = [11, 1, 25, 6, 12, 18, 21, 22];
export const REVEAL = 4;
export const SERVICE_PHOTOS = [15];
const USED = [HERO, ABOUT, ...COLLAGE, ...TOUR_PHOTOS, REVEAL, ...SERVICE_PHOTOS];
export const GRID = photos.filter((p) => !USED.includes(p.n));
