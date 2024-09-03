"use client";

import React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import { Card, CardContent } from "../card";

type DashboardCarouselProps = {
  sportsResults: (React.JSX.Element | null)[];
};

export function DashboardCarousel({ sportsResults }: DashboardCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    handleSelect(); // Initialize the current slide index
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="w-full max-w-xl ">
      <Carousel setApi={setApi} className="">
        <CarouselContent>
          {sportsResults.map((item, index) => (
            <CarouselItem
              key={index}
              className={`p-2 ${sportsResults.length === 1 ? "w-full" : ""}`}
              style={{
                width: sportsResults.length === 1 ? "100vw" : "auto",
                transform: sportsResults.length === 1 ? "translateX(0)" : "",
              }}
            >
              <Card className="shadow-md border rounded-lg w-full">
                <CardContent>{item}</CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {sportsResults.length > 1 && (
          <>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </>
        )}
      </Carousel>

      {/* Dots Navigation */}
      {sportsResults.length > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              className={`w-3 h-3 mx-1 rounded-full ${
                index === current ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => api && api.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
