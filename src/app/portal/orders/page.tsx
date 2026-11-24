import { SectionPlaceholder } from "@/components/admin/SectionPlaceholder";

/** Page in src/app/portal/orders. Placeholder for live orders until that step is built. */
export default function OrdersPage() {
  return (
    <SectionPlaceholder
      sectionName="Orders"
      summary="Incoming dine-in, pickup, and delivery orders will show here."
    />
  );
}
