import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ==========================================
  // ADMIN
  // ==========================================

  const adminEmail = "admin@romdental.com";
  const adminPassword = "Admin123456!";

  const hashedPassword = await bcrypt.hash(
    adminPassword,
    12
  );

  const admin = await prisma.admin.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      password: hashedPassword,
    },

    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin created:");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);

  // ==========================================
  // TOURS
  // ==========================================

  const tours = [
    {
      slug: "moscow-winter-tour",

      name: "تور زمستانی مسکو",

      price: "45000",
      currency: "₽",

      discountedPrice: "39000",
      discountPercentage: 13,

      shortDescription:
        "سفر جذاب زمستانی به مسکو با اقامت در هتل مناسب و بازدید از جاذبه‌های اصلی شهر.",

      description:
        "یک تور کامل برای تجربه زیبایی‌های مسکو در فصل زمستان. در این سفر از میدان سرخ، کرملین، خیابان آربات و دیگر جاذبه‌های مهم شهر بازدید خواهید کرد.",

      image: "/images/tours/moscow.jpg",
      thumbImage: "/images/tours/moscow-thumb.jpg",

      destination: "مسکو",
      country: "روسیه",
      city: "مسکو",

      duration: "5 روز و 4 شب",

      departureDate: new Date("2026-12-20T10:00:00"),
      returnDate: new Date("2026-12-24T18:00:00"),

      capacity: 20,
      remainingCapacity: 12,

      accommodation:
        "هتل 4 ستاره در مرکز شهر",

      transportation:
        "پرواز رفت و برگشت + ترانسفر فرودگاهی",

      meals:
        "صبحانه روزانه",

      guide:
        "راهنمای فارسی زبان",

      meetingPoint:
        "فرودگاه بین‌المللی",

      mapUrl:
        "https://maps.google.com/",

      highlights: [
        "بازدید از میدان سرخ",
        "بازدید از کرملین",
        "خیابان آربات",
        "تور شهری مسکو",
        "وقت آزاد برای خرید",
      ],

      included: [
        "اقامت در هتل",
        "صبحانه",
        "ترانسفر فرودگاهی",
        "راهنمای تور",
        "بیمه مسافرتی",
      ],

      excluded: [
        "هزینه بلیت جاذبه‌های اختیاری",
        "خرید شخصی",
        "ناهار و شام",
      ],

      requirements: [
        "پاسپورت معتبر",
        "بیمه مسافرتی",
        "رعایت قوانین تور",
      ],

      itinerary: [
        {
          day: 1,
          title: "ورود به مسکو",
          description:
            "ورود، استقبال در فرودگاه و انتقال به هتل.",
        },
        {
          day: 2,
          title: "تور شهری",
          description:
            "بازدید از میدان سرخ، کرملین و مرکز تاریخی شهر.",
        },
        {
          day: 3,
          title: "خیابان آربات",
          description:
            "گشت در خیابان آربات و زمان آزاد برای خرید.",
        },
        {
          day: 4,
          title: "بازدید آزاد",
          description:
            "روز آزاد برای خرید و بازدید از جاذبه‌های دلخواه.",
        },
        {
          day: 5,
          title: "بازگشت",
          description:
            "تحویل اتاق و انتقال به فرودگاه.",
        },
      ],

      gallery: [
        "/images/tours/moscow-1.jpg",
        "/images/tours/moscow-2.jpg",
        "/images/tours/moscow-3.jpg",
      ],

      isSpecial: true,
      isPublished: true,
    },

    // ==========================================
    // TOUR 2
    // ==========================================

    {
      slug: "saint-petersburg-cultural-tour",

      name: "تور فرهنگی سن‌پترزبورگ",

      price: "52000",
      currency: "₽",

      discountedPrice: "47000",
      discountPercentage: 10,

      shortDescription:
        "تور فرهنگی سن‌پترزبورگ با تمرکز بر موزه‌ها، معماری تاریخی و جاذبه‌های فرهنگی.",

      description:
        "سفری متفاوت به سن‌پترزبورگ، یکی از زیباترین شهرهای روسیه، همراه با بازدید از موزه‌ها و بناهای تاریخی مشهور.",

      image: "/images/tours/saint-petersburg.jpg",
      thumbImage:
        "/images/tours/saint-petersburg-thumb.jpg",

      destination: "سن‌پترزبورگ",
      country: "روسیه",
      city: "سن‌پترزبورگ",

      duration: "6 روز و 5 شب",

      departureDate: new Date("2027-01-10T09:00:00"),
      returnDate: new Date("2027-01-15T20:00:00"),

      capacity: 18,
      remainingCapacity: 8,

      accommodation:
        "هتل 4 ستاره نزدیک مرکز شهر",

      transportation:
        "پرواز + ترانسفر شهری",

      meals:
        "صبحانه",

      guide:
        "راهنمای فارسی زبان",

      meetingPoint:
        "فرودگاه سن‌پترزبورگ",

      mapUrl:
        "https://maps.google.com/",

      highlights: [
        "موزه هرمیتاژ",
        "کاخ زمستانی",
        "کلیسای ناجی در خون",
        "خیابان نوسکی",
        "کانال‌های تاریخی شهر",
      ],

      included: [
        "5 شب اقامت",
        "صبحانه",
        "ترانسفر",
        "راهنمای فارسی زبان",
        "بیمه",
      ],

      excluded: [
        "بلیط جاذبه‌های اختیاری",
        "هزینه‌های شخصی",
        "ناهار و شام",
      ],

      requirements: [
        "پاسپورت معتبر",
        "بیمه مسافرتی",
      ],

      itinerary: [
        {
          day: 1,
          title: "ورود",
          description:
            "ورود به سن‌پترزبورگ و انتقال به هتل.",
        },
        {
          day: 2,
          title: "هرمیتاژ",
          description:
            "بازدید از موزه مشهور هرمیتاژ و کاخ زمستانی.",
        },
        {
          day: 3,
          title: "مرکز تاریخی",
          description:
            "بازدید از کلیسای ناجی در خون و خیابان نوسکی.",
        },
        {
          day: 4,
          title: "تور کانال‌ها",
          description:
            "گشت شهری و بازدید از کانال‌های تاریخی.",
        },
        {
          day: 5,
          title: "روز آزاد",
          description:
            "زمان آزاد برای خرید و گردش شخصی.",
        },
        {
          day: 6,
          title: "بازگشت",
          description:
            "تحویل اتاق و انتقال به فرودگاه.",
        },
      ],

      gallery: [
        "/images/tours/saint-1.jpg",
        "/images/tours/saint-2.jpg",
        "/images/tours/saint-3.jpg",
      ],

      isSpecial: true,
      isPublished: true,
    },

    // ==========================================
    // TOUR 3
    // ==========================================

    {
      slug: "sochi-summer-tour",

      name: "تور تابستانی سوچی",

      price: "38000",
      currency: "₽",

      discountedPrice: "34000",
      discountPercentage: 11,

      shortDescription:
        "تور تفریحی سوچی با ترکیبی از طبیعت، ساحل، تفریحات شهری و اقامت راحت.",

      description:
        "یک سفر تابستانی جذاب به سوچی برای استراحت، تفریح و تجربه طبیعت زیبای دریای سیاه.",

      image: "/images/tours/sochi.jpg",
      thumbImage:
        "/images/tours/sochi-thumb.jpg",

      destination: "سوچی",
      country: "روسیه",
      city: "سوچی",

      duration: "5 روز و 4 شب",

      departureDate: new Date("2027-07-15T08:00:00"),
      returnDate: new Date("2027-07-19T21:00:00"),

      capacity: 25,
      remainingCapacity: 17,

      accommodation:
        "هتل 4 ستاره نزدیک ساحل",

      transportation:
        "پرواز + اتوبوس گردشگری",

      meals:
        "صبحانه",

      guide:
        "راهنمای تور",

      meetingPoint:
        "فرودگاه سوچی",

      mapUrl:
        "https://maps.google.com/",

      highlights: [
        "ساحل دریای سیاه",
        "پارک المپیک",
        "طبیعت سوچی",
        "تفریحات ساحلی",
        "بازارهای محلی",
      ],

      included: [
        "4 شب اقامت",
        "صبحانه",
        "ترانسفر فرودگاهی",
        "تور شهری",
        "راهنمای تور",
      ],

      excluded: [
        "تفریحات اختیاری",
        "خرید شخصی",
        "ناهار و شام",
      ],

      requirements: [
        "پاسپورت معتبر",
        "لباس مناسب فصل",
        "بیمه مسافرتی",
      ],

      itinerary: [
        {
          day: 1,
          title: "ورود به سوچی",
          description:
            "ورود و انتقال به هتل.",
        },
        {
          day: 2,
          title: "ساحل و تفریح",
          description:
            "یک روز کامل برای استراحت و تفریحات ساحلی.",
        },
        {
          day: 3,
          title: "پارک المپیک",
          description:
            "بازدید از پارک المپیک و مناطق اطراف.",
        },
        {
          day: 4,
          title: "طبیعت سوچی",
          description:
            "گشت در مناطق طبیعی و زیبای اطراف شهر.",
        },
        {
          day: 5,
          title: "بازگشت",
          description:
            "تحویل اتاق و انتقال به فرودگاه.",
        },
      ],

      gallery: [
        "/images/tours/sochi-1.jpg",
        "/images/tours/sochi-2.jpg",
        "/images/tours/sochi-3.jpg",
      ],

      isSpecial: false,
      isPublished: true,
    },
  ];

  // ==========================================
  // CREATE / UPDATE TOURS
  // ==========================================

  for (const tour of tours) {
    const result = await prisma.tour.upsert({
      where: {
        slug: tour.slug,
      },

      update: tour,

      create: tour,
    });

    console.log(`✅ Tour: ${result.name}`);
  }

  console.log("");
  console.log("🎉 Seed completed successfully!");
  console.log("");
  console.log("🔐 Admin login:");
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });