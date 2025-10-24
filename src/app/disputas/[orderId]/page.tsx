
import { DisputeForm } from "./dispute-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DisputePage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="container mx-auto py-12 px-4">
        <div className="relative w-full max-w-2xl mx-auto mb-4">
             <Button asChild variant="outline" className="absolute left-0 top-0">
                <Link href="/mis-ordenes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Regresar
                </Link>
            </Button>
        </div>
      <DisputeForm orderId={params.orderId} />
    </div>
  );
}
