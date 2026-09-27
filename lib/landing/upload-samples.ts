export type UploadSample = Readonly<{
  id: string;
  src: string;
  alt: string;
  side: "left" | "right";
  x: number;
  y: number;
  widthVw: number;
  parallaxY: number;
  objectPosition?: string;
  isSection03Source?: boolean;
  isSection05Source?: boolean;
}>;

export const uploadSamples: readonly UploadSample[] = [
  {
    id: "left-shadow-sedan",
    src: "/media/hero/sedan-emerging-from-dark-void-poster.jpg",
    alt: "Dark sedan emerging into light",
    side: "left",
    x: 3.5,
    y: 8,
    widthVw: 9.6,
    parallaxY: 78,
    objectPosition: "48% 50%",
  },
  {
    id: "left-studio-detail",
    src: "/media/hero/sedan-emerging-from-dark-void-poster.jpg",
    alt: "Dark sedan photographed in dynamic studio lighting",
    side: "left",
    x: 17.5,
    y: 29,
    widthVw: 8.8,
    parallaxY: 28,
    objectPosition: "42% 54%",
  },
  {
    id: "left-road-sedan",
    src: "/media/temporary/hero-poster.jpg",
    alt: "Vehicle scene prepared as an analysis sample",
    side: "left",
    x: 2.5,
    y: 57,
    widthVw: 10.4,
    parallaxY: 92,
    objectPosition: "50% 50%",
  },
  {
    id: "left-studio-rear",
    src: "/media/temporary/section03-sedan-source.png",
    alt: "Black sedan sample prepared for human plate verification",
    side: "left",
    x: 19.5,
    y: 77,
    widthVw: 8.3,
    parallaxY: 34,
    objectPosition: "50% 50%",
    isSection05Source: true,
  },
  {
    id: "right-road-sedan",
    src: "/media/temporary/hero-poster.jpg",
    alt: "Automotive road scene available for analysis",
    side: "right",
    x: 73.5,
    y: 11,
    widthVw: 9.2,
    parallaxY: 30,
    objectPosition: "50% 50%",
  },
  {
    id: "right-shadow-sedan",
    src: "/media/hero/sedan-emerging-from-dark-void-poster.jpg",
    alt: "Dark sedan sample in a low-light scene",
    side: "right",
    x: 87.5,
    y: 31,
    widthVw: 9.5,
    parallaxY: 86,
    objectPosition: "53% 50%",
  },
  {
    id: "section03-source",
    src: "/media/temporary/section03-sedan-source.png",
    alt: "Black sedan carried forward from the vehicle analysis demonstration",
    side: "right",
    x: 75.5,
    y: 59,
    widthVw: 10.8,
    parallaxY: 24,
    objectPosition: "50% 50%",
    isSection03Source: true,
  },
  {
    id: "right-studio-detail",
    src: "/media/hero/sedan-emerging-from-dark-void-poster.jpg",
    alt: "Sedan sample with a wide cinematic crop",
    side: "right",
    x: 88.5,
    y: 79,
    widthVw: 8.6,
    parallaxY: 96,
    objectPosition: "44% 50%",
  },
] as const;
