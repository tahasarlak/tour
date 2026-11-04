import EditableListSection from "@/components/admin/EditableListSection";
import EditablePriceSection from "@/components/admin/EditablePriceSection";
import EditableSingleBoolean from "@/components/admin/EditableSingleBoolean";
import SpecialButton from "@/components/admin/SpecialButton";
import PublishButton from "@/components/admin/PublishButton";
import type { ProductType } from "@/lib/product-types";

type DetailKind = "value" | "text" | "array" | "json" | "boolean";

type DetailDefinition = {
  field: string;
  title: string;
  kind?: DetailKind;
};

type Props = {
  id: number;
  name: string;
  price: number | null;
  discountedPrice: number | null;
  discountPercentage: number | null;
  currency: string | null;
  duration: string | null;
  shortDescription: string | null;
  description: string | null;
  type: ProductType;
  isAdmin: boolean;
  details?: Record<string, unknown>;
};

const DETAIL_FIELDS: Record<ProductType, DetailDefinition[]> = {
  tour: [
    { field: "destination", title: "مقصد" },
    { field: "country", title: "کشور" },
    { field: "city", title: "شهر" },
    { field: "departureDate", title: "تاریخ حرکت" },
    { field: "returnDate", title: "تاریخ بازگشت" },
    { field: "capacity", title: "ظرفیت" },
    { field: "remainingCapacity", title: "ظرفیت باقی‌مانده" },
    { field: "accommodation", title: "اقامت" },
    { field: "transportation", title: "حمل‌ونقل" },
    { field: "meals", title: "وعده‌های غذایی" },
    { field: "guide", title: "راهنما" },
    { field: "meetingPoint", title: "محل قرار" },
    { field: "mapUrl", title: "لینک نقشه" },
    { field: "highlights", title: "نکات برجسته", kind: "array" },
    { field: "included", title: "خدمات شامل‌شده", kind: "array" },
    { field: "excluded", title: "خدمات شامل‌نشده", kind: "array" },
    { field: "requirements", title: "شرایط و مدارک لازم", kind: "array" },
    { field: "itinerary", title: "برنامه سفر (JSON)", kind: "json" },
  ],
  train: [
    { field: "origin", title: "مبدأ" },
    { field: "destination", title: "مقصد" },
    { field: "originCity", title: "شهر مبدأ" },
    { field: "destinationCity", title: "شهر مقصد" },
    { field: "originStation", title: "ایستگاه مبدأ" },
    { field: "destinationStation", title: "ایستگاه مقصد" },
    { field: "originCode", title: "کد مبدأ" },
    { field: "destinationCode", title: "کد مقصد" },
    { field: "trainCompany", title: "شرکت ریلی" },
    { field: "trainName", title: "نام قطار" },
    { field: "trainNumber", title: "شماره قطار" },
    { field: "trainType", title: "نوع قطار" },
    { field: "departureDate", title: "تاریخ حرکت" },
    { field: "arrivalDate", title: "تاریخ رسیدن" },
    { field: "departureTime", title: "ساعت حرکت" },
    { field: "arrivalTime", title: "ساعت رسیدن" },
    { field: "carriageType", title: "نوع واگن" },
    { field: "seatType", title: "نوع صندلی" },
    { field: "capacity", title: "ظرفیت" },
    { field: "remainingCapacity", title: "ظرفیت باقی‌مانده" },
    { field: "baggage", title: "بار مجاز" },
    { field: "refundPolicy", title: "شرایط استرداد", kind: "text" },
    { field: "cancellationPolicy", title: "شرایط لغو", kind: "text" },
    { field: "facilities", title: "امکانات", kind: "array" },
    { field: "requirements", title: "توضیحات و شرایط", kind: "array" },
  ],
  flight: [
    { field: "origin", title: "مبدأ" },
    { field: "destination", title: "مقصد" },
    { field: "originCity", title: "شهر مبدأ" },
    { field: "destinationCity", title: "شهر مقصد" },
    { field: "originAirport", title: "فرودگاه مبدأ" },
    { field: "destinationAirport", title: "فرودگاه مقصد" },
    { field: "originAirportCode", title: "کد فرودگاه مبدأ" },
    { field: "destinationAirportCode", title: "کد فرودگاه مقصد" },
    { field: "airline", title: "شرکت هواپیمایی" },
    { field: "airlineCode", title: "کد شرکت هواپیمایی" },
    { field: "flightNumber", title: "شماره پرواز" },
    { field: "departureDate", title: "تاریخ حرکت" },
    { field: "arrivalDate", title: "تاریخ رسیدن" },
    { field: "departureTime", title: "ساعت حرکت" },
    { field: "arrivalTime", title: "ساعت رسیدن" },
    { field: "cabinClass", title: "کلاس پرواز" },
    { field: "baggage", title: "بار اصلی" },
    { field: "handBaggage", title: "بار دستی" },
    { field: "stops", title: "تعداد توقف" },
    { field: "refundable", title: "قابل استرداد", kind: "boolean" },
    { field: "refundPolicy", title: "شرایط استرداد", kind: "text" },
    { field: "cancellationPolicy", title: "شرایط لغو", kind: "text" },
    { field: "facilities", title: "امکانات", kind: "array" },
    { field: "requirements", title: "شرایط و توضیحات", kind: "array" },
    { field: "capacity", title: "ظرفیت" },
    { field: "remainingCapacity", title: "ظرفیت باقی‌مانده" },
  ],
  bus: [
    { field: "origin", title: "مبدأ" },
    { field: "destination", title: "مقصد" },
    { field: "originCity", title: "شهر مبدأ" },
    { field: "destinationCity", title: "شهر مقصد" },
    { field: "originTerminal", title: "پایانه مبدأ" },
    { field: "destinationTerminal", title: "پایانه مقصد" },
    { field: "originCode", title: "کد مبدأ" },
    { field: "destinationCode", title: "کد مقصد" },
    { field: "busCompany", title: "شرکت اتوبوسرانی" },
    { field: "busName", title: "نام اتوبوس" },
    { field: "busNumber", title: "شماره اتوبوس" },
    { field: "busType", title: "نوع اتوبوس" },
    { field: "departureDate", title: "تاریخ حرکت" },
    { field: "arrivalDate", title: "تاریخ رسیدن" },
    { field: "departureTime", title: "ساعت حرکت" },
    { field: "arrivalTime", title: "ساعت رسیدن" },
    { field: "seatType", title: "نوع صندلی" },
    { field: "seatClass", title: "کلاس صندلی" },
    { field: "capacity", title: "ظرفیت" },
    { field: "remainingCapacity", title: "ظرفیت باقی‌مانده" },
    { field: "baggage", title: "بار مجاز" },
    { field: "refundPolicy", title: "شرایط استرداد", kind: "text" },
    { field: "cancellationPolicy", title: "شرایط لغو", kind: "text" },
    { field: "facilities", title: "امکانات", kind: "array" },
    { field: "requirements", title: "شرایط و توضیحات", kind: "array" },
  ],
  accommodation: [
    { field: "country", title: "کشور" },
    { field: "city", title: "شهر" },
    { field: "address", title: "آدرس", kind: "text" },
    { field: "mapUrl", title: "لینک نقشه" },
    { field: "latitude", title: "عرض جغرافیایی" },
    { field: "longitude", title: "طول جغرافیایی" },
    { field: "accommodationType", title: "نوع اقامتگاه" },
    { field: "starRating", title: "تعداد ستاره" },
    { field: "roomType", title: "نوع اتاق" },
    { field: "capacity", title: "ظرفیت" },
    { field: "remainingCapacity", title: "ظرفیت باقی‌مانده" },
    { field: "rooms", title: "تعداد اتاق" },
    { field: "checkInTime", title: "ساعت ورود" },
    { field: "checkOutTime", title: "ساعت خروج" },
    { field: "minimumNights", title: "حداقل تعداد شب" },
    { field: "mealPlan", title: "وعده‌های غذایی" },
    { field: "amenities", title: "امکانات رفاهی", kind: "array" },
    { field: "services", title: "خدمات", kind: "array" },
    { field: "cancellationPolicy", title: "شرایط لغو", kind: "text" },
    { field: "houseRules", title: "قوانین اقامتگاه", kind: "text" },
    { field: "requirements", title: "شرایط و مدارک لازم", kind: "array" },
  ],
  visa: [
    { field: "country", title: "کشور" },
    { field: "countryCode", title: "کد کشور" },
    { field: "destination", title: "مقصد" },
    { field: "visaType", title: "نوع ویزا" },
    { field: "entryType", title: "نوع ورود" },
    { field: "validityPeriod", title: "مدت اعتبار" },
    { field: "stayDuration", title: "مدت اقامت" },
    { field: "processingTime", title: "زمان بررسی" },
    { field: "urgentProcessing", title: "صدور فوری", kind: "boolean" },
    { field: "urgentProcessingTime", title: "زمان صدور فوری" },
    { field: "requirements", title: "شرایط و مدارک لازم", kind: "array" },
    { field: "requiredDocuments", title: "مدارک موردنیاز", kind: "array" },
    { field: "additionalDocuments", title: "مدارک تکمیلی", kind: "array" },
    { field: "included", title: "خدمات شامل‌شده", kind: "array" },
    { field: "excluded", title: "خدمات شامل‌نشده", kind: "array" },
    { field: "interviewRequired", title: "نیاز به مصاحبه", kind: "boolean" },
    { field: "biometricsRequired", title: "نیاز به انگشت‌نگاری", kind: "boolean" },
    { field: "cancellationPolicy", title: "شرایط لغو", kind: "text" },
    { field: "notes", title: "توضیحات تکمیلی", kind: "text" },
  ],
};

function toEditableString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 16);
  if (Array.isArray(value)) return value.map((item) => String(item)).join("\n");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function hasContent(value: unknown, kind?: DetailKind): boolean {
  if (kind === "boolean") return value !== null && value !== undefined;
  if (Array.isArray(value)) return value.length > 0;
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

type FullProps = Props & { isSpecial?: boolean; isPublished?: boolean };

export default function ProductBasicInfo({
  id, name, price, discountedPrice, discountPercentage, currency, duration,
  shortDescription, description, type, isAdmin, details = {}, isSpecial = false, isPublished = false,
}: FullProps) {
  const detailDefinitions = DETAIL_FIELDS[type];
  const hasDetails = detailDefinitions.some(({ field, kind }) => hasContent(details[field], kind));
  const hasPublicContent =
    hasContent(name) || price !== null || discountedPrice !== null || hasContent(duration) || hasContent(shortDescription) ||
    hasContent(description) || hasDetails;

  if (!isAdmin && !hasPublicContent) return null;

  const galleryItems = Array.isArray(details.gallery) ? details.gallery.map(String) : [];

  return (
    <div className="space-y-4">
      {(isAdmin || hasContent(name)) && (
        <div className="rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-5">
          <EditableListSection id={id} field="name" title="نام محصول" editableValue={name || ""} type={type} variant="value" />
        </div>
      )}

      {(isAdmin || price !== null || discountedPrice !== null) && (
        <EditablePriceSection
          id={id}
          price={price}
          discountedPrice={discountedPrice}
          discountPercentage={discountPercentage}
          currency={currency}
          type={type}
          isAdmin={isAdmin}
        />
      )}

      {(isAdmin || hasContent(duration)) && (
        <div className="rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-5">
          <EditableListSection id={id} field="duration" title="مدت زمان" editableValue={duration || ""} type={type} variant="value" />
        </div>
      )}

      {(isAdmin || hasContent(shortDescription)) && (
        <div className="rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-5">
          <EditableListSection id={id} field="shortDescription" title="توضیحات کوتاه" editableValue={shortDescription || ""} type={type} variant="text" />
        </div>
      )}

      {(isAdmin || hasContent(description)) && (
        <div className="rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-5">
          <EditableListSection id={id} field="description" title="توضیحات کامل" editableValue={description || ""} type={type} variant="text" />
        </div>
      )}

      {(isAdmin || hasDetails) && (
        <section className="rounded-2xl border border-border bg-card p-4 text-card-foreground sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold sm:text-lg">جزئیات تکمیلی محصول</h2>
            {isAdmin && <p className="mt-1 text-xs leading-6 text-muted-foreground">فیلدهای خالی فقط در پنل مدیریت نمایش داده می‌شوند؛ برای تکمیل هر مورد روی ویرایش بزن.</p>}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {detailDefinitions.map(({ field, title, kind = "value" }) => {
              const rawValue = details[field];
              if (!isAdmin && !hasContent(rawValue, kind)) return null;

              if (kind === "boolean") {
                const booleanValue = rawValue === null || rawValue === undefined ? null : rawValue === true;
                return (
                  <div key={field} className="min-w-0 rounded-xl border border-border bg-background p-3 sm:p-4">
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{title}</h3>
                    <EditableSingleBoolean id={id} field={field} value={booleanValue} type={type}>
                      <span className="text-sm font-semibold text-foreground">{booleanValue === null ? "مشخص نشده" : booleanValue ? "بله" : "خیر"}</span>
                    </EditableSingleBoolean>
                  </div>
                );
              }

              const editableValue = toEditableString(rawValue);
              const items = Array.isArray(rawValue) ? rawValue.map(String) : [];
              return (
                <div key={field} className="min-w-0 rounded-xl border border-border bg-background p-3 sm:p-4">
                  <EditableListSection
                    id={id}
                    field={field}
                    title={title}
                    editableValue={editableValue}
                    items={items}
                    type={type}
                    variant={kind === "array" ? "tags" : kind === "text" || kind === "json" ? "text" : "value"}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {isAdmin && (
        <section className="rounded-2xl border border-amber-500/30 bg-card p-4 text-card-foreground sm:p-5">
          <h2 className="mb-3 text-base font-bold">تنظیمات مخصوص ادمین</h2>
          <div className="mb-4 flex flex-wrap gap-3">
            <SpecialButton id={id} type={type} isSpecial={isSpecial} />
            <PublishButton id={id} type={type} isPublished={isPublished} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-border bg-background p-3">
              <EditableListSection id={id} field="currency" title="واحد پول" editableValue={toEditableString(currency)} type={type} variant="value" />
            </div>
            <div className="min-w-0 rounded-xl border border-border bg-background p-3">
              <EditableListSection id={id} field="image" title="آدرس تصویر اصلی (فقط ادمین)" editableValue={toEditableString(details.image)} type={type} variant="text" />
            </div>
            <div className="min-w-0 rounded-xl border border-border bg-background p-3">
              <EditableListSection id={id} field="thumbImage" title="آدرس تصویر بندانگشتی (فقط ادمین)" editableValue={toEditableString(details.thumbImage)} type={type} variant="text" />
            </div>
            <div className="min-w-0 rounded-xl border border-border bg-background p-3">
              <EditableListSection id={id} field="gallery" title="آدرس تصاویر گالری (فقط ادمین)" editableValue={toEditableString(details.gallery)} items={galleryItems} type={type} variant="tags" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
