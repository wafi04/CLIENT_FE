import { MapPin, Users, StarIcon, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GetAvailableGedung } from "../api/ApiGedung";
import { Link, useSearchParams } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import { format } from "date-fns";

export function GedungAvailable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const alamat = searchParams.get("alamat") ?? "";
  const date = searchParams.get("date") ?? "";
  const [localAlamat, setLocalAlamat] = useState(
    searchParams.get("alamat") ?? ""
  );

  const [localDate, setLocalDate] = useState(searchParams.get("date") ?? "");

  const { data, isLoading, error } = GetAvailableGedung({
    alamat,
    date,
  });
  const gedung = data?.data.availableGedung ?? [];
  const handleSubmit = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (localAlamat) {
      newSearchParams.set("alamat", localAlamat);
    } else {
      newSearchParams.delete("alamat");
    }

    if (localDate) {
      newSearchParams.set("date", localDate);
    } else {
      newSearchParams.delete("date");
    }

    setSearchParams(newSearchParams);
  };

  // Reset filters
  const handleReset = () => {
    setLocalAlamat("");
    setLocalDate("");
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Refinement Section */}
      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <Input
          placeholder="Filter by Location"
          value={localAlamat}
          onChange={(e) => setLocalAlamat(e.target.value)}
          className="w-full"
          icon={<MapPin className="text-muted-foreground" />}
        />
        <DatePicker
          onDateChange={(selectedDate) =>
            setLocalDate(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "")
          }
        />
        <div className="flex space-x-2">
          <Button onClick={handleSubmit} className="flex-grow">
            <Search className="mr-2" size={16} />
            Search
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading venues...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Error loading venues. Please try again.
          </p>
        </div>
      )}

      {/* Venues Grid */}
      {!isLoading && !error && (
        <div className="grid md:grid-cols-3 gap-6">
          {gedung.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No venues found</p>
            </div>
          ) : (
            gedung.map((venue) => (
              <Link to={`/gedung/${venue.id}`}>
                <Card
                  key={venue.id}
                  className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={
                        venue.images.length > 0
                          ? venue.images[0].url
                          : "https://images.unsplash.com/photo-1706264473113-3036fd904c35?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z2VkdW5nfGVufDB8fDB8fHww"
                      }
                      alt={venue.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2">
                      {venue.ketersediaan}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">{venue.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <StarIcon size={16} fill="currentColor" />
                        <span className="ml-1">{"4.8"}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin size={16} className="mr-2" />
                      <p className="truncate">{venue.alamat}</p>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users size={16} className="mr-2" />
                      <p>Capacity: {venue.kapasitas} orang</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-primary font-bold">
                        {formatCurrency(venue.harga)}
                        /hour
                      </p>
                      <Link to={`/gedung/${venue.id}`}>
                        <Button size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
