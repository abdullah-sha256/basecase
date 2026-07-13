import { Box } from "@chakra-ui/react";
import { Features } from "../../components/public/landing-route/Features";
import { HeroSection } from "../../components/public/landing-route/HeroSection";

export const LandingRoute = () => {
  return (
    <>
      <Box as="section" bg="bg.surface">
        <HeroSection />
        <Features />
      </Box>
    </>
  );
};
