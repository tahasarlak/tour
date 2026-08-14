import EditableListSection from "@/components/admin/EditableListSection";
import EditablePriceSection from "@/components/admin/EditablePriceSection";

type Props = {
  id: number;
  name: string;

  price: number;
  discountedPrice: number | null;
  discountPercentage: number | null;

  currency: string | null;
  duration: string | null;

  shortDescription: string | null;
  description: string | null;

  type: string;

  isAdmin: boolean;
};

export default function ProductBasicInfo({
  id,
  name,
  price,
  discountedPrice,
  discountPercentage,
  currency,
  duration,
  shortDescription,
  description,
  type,
  isAdmin,
}: Props) {
  return (
    <div className="space-y-4">
      <div
        className="
          rounded-xl
          border
          border-border
          bg-card
          text-card-foreground
          p-4
          sm:p-5
        "
      >
        <EditableListSection
          id={id}
          field="name"
          title="نام"
          editableValue={name}
          type={type}
          variant="value"
        />
      </div>

      <div
        className="
          rounded-xl
          border
          border-border
          bg-card
          text-card-foreground
          p-4
          sm:p-5
        "
      >
        <EditablePriceSection
          id={id}
          price={price}
          discountedPrice={discountedPrice}
          discountPercentage={discountPercentage}
          currency={currency}
          type={type}
        />
      </div>

      {(isAdmin || duration?.trim()) && (
        <div
          className="
            rounded-xl
            border
            border-border
            bg-card
            text-card-foreground
            p-4
            sm:p-5
          "
        >
          <EditableListSection
            id={id}
            field="duration"
            title="مدت زمان"
            editableValue={duration || ""}
            type={type}
            variant="value"
          />
        </div>
      )}

      {isAdmin && (
        <div
          className="
            rounded-xl
            border
            border-border
            bg-card
            text-card-foreground
            p-4
            sm:p-5
          "
        >
          <EditableListSection
            id={id}
            field="shortDescription"
            title="توضیحات کوتاه"
            editableValue={shortDescription || ""}
            type={type}
            variant="text"
          />
        </div>
      )}

      {(isAdmin || description?.trim()) && (
        <div
          className="
            rounded-xl
            border
            border-border
            bg-card
            text-card-foreground
            p-4
            sm:p-5
          "
        >
          <EditableListSection
            id={id}
            field="description"
            title="توضیحات کامل"
            editableValue={description || ""}
            type={type}
            variant="text"
          />
        </div>
      )}
    </div>
  );
}