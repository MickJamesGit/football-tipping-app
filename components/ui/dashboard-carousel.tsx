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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

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
    <div className="max-w-xl mx-auto">
      <Carousel setApi={setApi} className="sm:max-w-lg">
        <CarouselContent>
          {sportsResults.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="shadow-md border rounded-lg">
                  <CardContent>{item}</CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Button naviation on large screens*/}
        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>

      {/* Dots Navigation */}
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
    </div>
  );
}
