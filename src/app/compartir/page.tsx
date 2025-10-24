"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type Service = {
  name: string;
  isNew?: boolean;
};

// Based on the provided image
const allServices: Service[] = [
    { name: "AmazonMusic", isNew: true }, { name: "Apple" }, { name: "AtresPlayer" }, { name: "Avast" },
    { name: "Calm", isNew: true }, { name: "CanvaPro" }, { name: "CapCut", isNew: true }, { name: "ChatGPT", isNew: true },
    { name: "Crunchyroll" }, { name: "Curiosity4K", isNew: true }, { name: "Dazn", isNew: true }, { name: "Deezer" },
    { name: "DirecTVGO" }, { name: "Disney+" }, { name: "Dropbox" }, { name: "Duolingo" },
    { name: "F1 TV", isNew: true }, { name: "Gaia" }, { name: "Gemini AI", isNew: true }, { name: "Google", isNew: true },
    { name: "HBO Max" }, { name: "Inteligencia Artificial" }, { name: "L1 MAX", isNew: true }, { name: "MLS", isNew: true },
    { name: "Movistar TV App", isNew: true }, { name: "MUBI" }, { name: "NBA League Pass" }, { name: "Netflix+" },
    { name: "Nintendo" }, { name: "Office365" }, { name: "Paramount+" }, { name: "Platzi" },
    { name: "PrimeVideo" }, { name: "Spotify" }, { name: "Tidal" }, { name: "TrueCaller", isNew: true },
    { name: "Universal+", isNew: true }, { name: "VIKIPass Plus" }, { name: "Vix" }, { name: "VPNs" },
    { name: "WOW Presents Plus", isNew: true }, { name: "YouTube" }
];

const INITIAL_VISIBLE_COUNT = 12;

export default function CompartirPage() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const showMore = () => {
    setVisibleCount(allServices.length);
  };

  const visibleServices = allServices.slice(0, visibleCount);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Comparte tu Suscripción
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Selecciona el servicio que quieres compartir para empezar a ganar dinero.
        </p>
      </div>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleServices.map((service) => (
          <Link href={`/publicar?service=${encodeURIComponent(service.name.toLowerCase())}`} key={service.name}>
            <Card className="text-center flex flex-col items-center justify-center p-4 h-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer min-h-[100px]">
              <CardHeader className="p-0 relative w-full">
                <CardTitle className="font-sans text-base font-medium">
                  {service.name}
                </CardTitle>
                {service.isNew && (
                   <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-500">NUEVO</span>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {visibleCount < allServices.length && (
        <div className="text-center mt-10">
          <Button onClick={showMore} variant="outline" size="lg">
            <ChevronDown className="mr-2 h-5 w-5" />
            Ver más
          </Button>
        </div>
      )}
    </div>
  );
}
