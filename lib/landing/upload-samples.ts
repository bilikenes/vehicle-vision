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
}>;

export const uploadSamples: readonly UploadSample[] = [
  {
    id: "left-van",
    src: "/media/samples/sample-van.png",
    alt: "Black passenger van in a pink-lit studio",
    side: "left",
    x: 3.5,
    y: 8,
    widthVw: 9.2,
    parallaxY: 78,
    objectPosition: "48% 50%",
  },
  {
    id: "left-motorcycle",
    src: "/media/samples/sample-motorcycle.png",
    alt: "Black motorcycle with pink studio lighting",
    side: "left",
    x: 17.5,
    y: 29,
    widthVw: 9.2,
    parallaxY: 28,
    objectPosition: "42% 54%",
  },
  {
    id: "left-bus",
    src: "/media/samples/sample-bus.png",
    alt: "White coach bus in a pink-lit studio",
    side: "left",
    x: 2.5,
    y: 57,
    widthVw: 9.2,
    parallaxY: 92,
    objectPosition: "50% 50%",
  },
  {
    id: "left-pickup",
    src: "/media/samples/sample-pickup.png",
    alt: "White pickup truck in a pink-lit studio",
    side: "left",
    x: 19.5,
    y: 77,
    widthVw: 9.2,
    parallaxY: 34,
    objectPosition: "50% 50%",
  },
  {
    id: "right-suv",
    src: "/media/samples/sample-suv.png",
    alt: "Black SUV in a pink-lit studio",
    side: "right",
    x: 73.5,
    y: 11,
    widthVw: 9.2,
    parallaxY: 30,
    objectPosition: "50% 50%",
  },
  {
    id: "right-minivan",
    src: "/media/samples/sample-minivan.png",
    alt: "White minivan in a pink-lit studio",
    side: "right",
    x: 87.5,
    y: 31,
    widthVw: 9.2,
    parallaxY: 86,
    objectPosition: "53% 50%",
  },
  {
    id: "section03-source",
    src: "/media/samples/sample-sedan.png",
    alt: "Dark gray sedan carried forward from the vehicle analysis demonstration",
    side: "right",
    x: 75.5,
    y: 59,
    widthVw: 9.2,
    parallaxY: 24,
    objectPosition: "50% 50%",
    isSection03Source: true,
  },
  {
    id: "right-truck",
    src: "/media/samples/sample-truck.png",
    alt: "White cargo truck in a pink-lit studio",
    side: "right",
    x: 88.5,
    y: 79,
    widthVw: 9.2,
    parallaxY: 96,
    objectPosition: "44% 50%",
  },
] as const;
