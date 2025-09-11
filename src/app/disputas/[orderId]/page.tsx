import { DisputeForm } from "./dispute-form";

export default function DisputePage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="container mx-auto py-12 px-4">
      <DisputeForm orderId={params.orderId} />
    </div>
  );
}
