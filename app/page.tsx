import { AnalysisPipeline } from "@/components/landing/AnalysisPipeline";
import { EditorialStatement } from "@/components/landing/EditorialStatement";
import { FloatingNav } from "@/components/landing/FloatingNav";
import { HumanControlScene } from "@/components/landing/HumanControlScene";
import { OpeningScene } from "@/components/landing/OpeningScene";
import { UploadExperience } from "@/components/landing/UploadExperience";
import { landingMedia } from "@/lib/landing/media-config";

export default function HomePage() {
  return (
    <main>
      <FloatingNav />
      <OpeningScene media={landingMedia.heroVideo} />
      <EditorialStatement />
      <AnalysisPipeline />
      <UploadExperience />
      <HumanControlScene />
    </main>
  );
}
