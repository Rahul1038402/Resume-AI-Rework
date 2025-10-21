import Layout from "@/components/Layout";
import NumberedFeatureCards from "../components/index/CardComponents";
import PainPointsSection from "../components/index/PainPointsSection";
import HeroSection from "@/components/index/HeroSection";
import StatsSection from "@/components/index/StatsSection";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pb-36 overflow-hidden">
        <HeroSection/>

      </section>

      <PainPointsSection/>

      <NumberedFeatureCards />

      <StatsSection />

    </Layout >
  );
};

export default Index;
