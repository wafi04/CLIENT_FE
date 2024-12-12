"use client";

import { motion } from "framer-motion";
import { MapPin, Building2, Users, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllGedungWithImages } from "@/features/admin/gedung/api/ApiGedung";
import { GedungDataWithImages } from "@/types/gedung";
import { Link } from "react-router-dom";

export function SectionGedung() {
  const {
    data: gedungsWithImages,
    isLoading,
    error,
  } = getAllGedungWithImages();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !gedungsWithImages) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading venues
      </div>
    );
  }

  return (
    <section className="bg-gray-50  container pb-[30vh]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Venues
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our top-rated venues perfect for your next event
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid md:grid-cols-3 gap-8">
          {gedungsWithImages.slice(0, 3).map((gedung: GedungDataWithImages) => (
            <motion.div
              key={gedung.id}
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                  },
                },
              }}
              whileHover={{ scale: 1.05 }}
              className="group">
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      gedung.images.length > 0
                        ? gedung.images[0].url
                        : "https://images.unsplash.com/photo-1706264473113-3036fd904c35?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z2VkdW5nfGVufDB8fDB8fHww"
                    }
                    alt={gedung.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge variant="secondary" className="absolute top-4 left-4">
                    {gedung.ketersediaan}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {gedung.name}
                    </h3>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-5 h-5 mr-1" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      <span>Kapasitas: {gedung.kapasitas} orang</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <span>{gedung.alamat}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-5 h-5 mr-2 text-primary" />
                      <span>
                        Harga: Rp {Number(gedung.harga).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link to={`/gedung/${gedung.id}`}>
                    <Button variant="outline" className="w-full mt-6 group">
                      View Details
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Link to={"/venues"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12">
            <Button size="lg">
              Explore More Venues
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
