"use client";

import { motion } from "framer-motion";
import { Building2, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/DatePicker";
import { AvailableGedungParams } from "@/features/admin/gedung/api/ApiGedung";
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const BannerPage = () => {
  const navigate = useNavigate();
  const url =
    "https://plus.unsplash.com/premium_photo-1680777484547-de735ff024a4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2VkdW5nfGVufDB8fDB8fHww";

  const [searchParams, setSearchParams] = useState<AvailableGedungParams>({});

  const handleFindVenues = () => {
    const queryParams = new URLSearchParams();

    if (searchParams.date) {
      queryParams.append("date", searchParams.date as string);
    }
    if (searchParams.alamat) {
      queryParams.append("alamat", searchParams.alamat);
    }
    navigate(`/venues?${queryParams.toString()}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block">
            <Badge variant="secondary">Venue Booking Platform</Badge>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            Discover Your <br />
            <span className="text-primary">Perfect Event Space</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Seamlessly find and book incredible venues for your events,
            meetings, and special occasions with just a few clicks.
          </p>

          {/* Modern Search Box */}
          <Card className="shadow-2xl">
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center mb-2">
                    <Building2 className="mr-2 text-primary" size={20} />
                    Location
                  </Label>
                  <Input
                    placeholder="Where's your event?"
                    className="w-full"
                    onChange={(e) =>
                      setSearchParams((prev: any) => ({
                        ...prev,
                        alamat: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="flex items-center mb-2">
                    <Calendar className="mr-2 text-primary" size={20} />
                    Date
                  </Label>
                  <DatePicker
                    onDateChange={(selectedDate) =>
                      setSearchParams((prev: any) => ({
                        ...prev,
                        date: selectedDate
                          ? format(selectedDate, "yyyy-MM-dd")
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleFindVenues}>
                <Search className="mr-2" size={20} />
                Find Venues
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Side - Image Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative hidden lg:block">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-24 -top-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10">
            <img
              src={url}
              alt="Event Venue"
              className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-8 right-8">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Total Venues
                    </h3>
                    <p className="text-primary text-2xl font-bold">1,250+</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Cities</h3>
                    <p className="text-primary text-2xl font-bold">45+</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BannerPage;
