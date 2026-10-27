import CreateTripWizard from "./CreateTripWizard";

export default async function CreateTripPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination } = await searchParams;
  return <CreateTripWizard initialDestination={destination?.slice(0, 120) ?? ""} />;
}
