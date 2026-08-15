import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");
  console.log("");

  // ======================================================
  // ADMIN
  // ======================================================

const adminEmail = "admin@safarkhosh.com";
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
  console.log("");
// ======================================================
// BUS TICKETS
// ======================================================

const buses = [
  {
    slug: "moscow-kazan-bus",

    name: "بلیط اتوبوس مسکو به کازان",

    price: "5500",
    currency: "تومان",

    discountedPrice: "4900",
    discountPercentage: 11,

    shortDescription:
      "سفر راحت با اتوبوس از مسکو به کازان با امکانات مناسب.",

    description:
      "بلیط اتوبوس مسکو به کازان با صندلی راحت، تهویه مطبوع و امکانات مناسب برای سفر بین‌شهری.",

    image:
      "/images/buses/moscow-kazan.jpg",

    thumbImage:
      "/images/buses/moscow-kazan-thumb.jpg",

    origin: "مسکو",

    destination: "کازان",

    originCity: "مسکو",

    destinationCity: "کازان",

    originTerminal:
      "Moscow Central Bus Station",

    destinationTerminal:
      "Kazan Bus Station",

    originCode: "MOW",

    destinationCode: "KZN",

    busCompany: "Ecolines",

    busName: "Ecolines Comfort",

    busNumber: "EC-204",

    busType: "اتوبوس VIP",

    departureDate: new Date(
      "2026-12-15T08:00:00"
    ),

    arrivalDate: new Date(
      "2026-12-15T19:30:00"
    ),

    departureTime: "08:00",

    arrivalTime: "19:30",

    duration: "11 ساعت و 30 دقیقه",

    seatType: "صندلی VIP",

    capacity: 45,

    remainingCapacity: 18,

    baggage: "تا 20 کیلوگرم",

    refundPolicy:
      "استرداد طبق قوانین شرکت اتوبوسرانی",

    cancellationPolicy:
      "لغو تا 24 ساعت قبل از حرکت با کسر جریمه",

    facilities: [
      "Wi-Fi",
      "پریز برق",
      "تهویه مطبوع",
      "صندلی قابل تنظیم",
      "سرویس بهداشتی",
    ],

    requirements: [
      "پاسپورت معتبر",
      "حضور حداقل 30 دقیقه قبل از حرکت",
    ],

    gallery: [
      "/images/buses/moscow-kazan-1.jpg",
      "/images/buses/moscow-kazan-2.jpg",
    ],

    isSpecial: true,

    isPublished: true,
  },

  {
    slug: "moscow-saint-petersburg-bus",

    name: "بلیط اتوبوس مسکو به سن‌پترزبورگ",

    price: "4800",

    currency: "تومان",

    discountedPrice: "4200",

    discountPercentage: 13,

    shortDescription:
      "بلیط اتوبوس مسکو به سن‌پترزبورگ با سفر شبانه و صندلی راحت.",

    description:
      "سفر اقتصادی و راحت با اتوبوس از مسکو به سن‌پترزبورگ با امکانات مناسب.",

    image:
      "/images/buses/moscow-spb.jpg",

    thumbImage:
      "/images/buses/moscow-spb-thumb.jpg",

    origin: "مسکو",

    destination: "سن‌پترزبورگ",

    originCity: "مسکو",

    destinationCity: "سن‌پترزبورگ",

    originTerminal:
      "Moscow Central Bus Station",

    destinationTerminal:
      "Saint Petersburg Bus Station",

    originCode: "MOW",

    destinationCode: "LED",

    busCompany: "Lux Express",

    busName: "Lux Express",

    busNumber: "LE-105",

    busType: "اتوبوس VIP",

    departureDate: new Date(
      "2026-11-20T22:00:00"
    ),

    arrivalDate: new Date(
      "2026-11-21T07:30:00"
    ),

    departureTime: "22:00",

    arrivalTime: "07:30",

    duration: "9 ساعت و 30 دقیقه",

    seatType: "صندلی راحت",

    capacity: 50,

    remainingCapacity: 23,

    baggage: "تا 20 کیلوگرم",

    refundPolicy:
      "طبق قوانین شرکت اتوبوسرانی",

    cancellationPolicy:
      "لغو با کسر جریمه",

    facilities: [
      "Wi-Fi",
      "پریز برق",
      "تهویه مطبوع",
      "صندلی قابل تنظیم",
    ],

    requirements: [
      "پاسپورت معتبر",
      "حضور حداقل 30 دقیقه قبل از حرکت",
    ],

    gallery: [
      "/images/buses/moscow-spb-1.jpg",
      "/images/buses/moscow-spb-2.jpg",
    ],

    isSpecial: false,

    isPublished: true,
  },
];

// ======================================================
// CREATE / UPDATE BUS TICKETS
// ======================================================

for (const bus of buses) {
  const result =
    await prisma.busTicket.upsert({
      where: {
        slug: bus.slug,
      },

      update: bus,

      create: bus,
    });

  console.log(
    `🚌 Bus: ${result.name}`
  );
}

console.log("");
  // ======================================================
  // TOURS
  // ======================================================

  const tours = [
    {
      slug: "moscow-winter-tour",

      name: "تور زمستانی مسکو",

      price: "45000",
      currency: "تومان",

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

      departureDate: new Date(
        "2026-12-20T10:00:00"
      ),

      returnDate: new Date(
        "2026-12-24T18:00:00"
      ),

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

    {
      slug: "saint-petersburg-cultural-tour",

      name: "تور فرهنگی سن‌پترزبورگ",

      price: "52000",
      currency: "تومان",

      discountedPrice: "47000",
      discountPercentage: 10,

      shortDescription:
        "تور فرهنگی سن‌پترزبورگ با تمرکز بر موزه‌ها، معماری تاریخی و جاذبه‌های فرهنگی.",

      description:
        "سفری متفاوت به سن‌پترزبورگ، یکی از زیباترین شهرهای روسیه، همراه با بازدید از موزه‌ها و بناهای تاریخی مشهور.",

      image:
        "/images/tours/saint-petersburg.jpg",

      thumbImage:
        "/images/tours/saint-petersburg-thumb.jpg",

      destination: "سن‌پترزبورگ",
      country: "روسیه",
      city: "سن‌پترزبورگ",

      duration: "6 روز و 5 شب",

      departureDate: new Date(
        "2027-01-10T09:00:00"
      ),

      returnDate: new Date(
        "2027-01-15T20:00:00"
      ),

      capacity: 18,
      remainingCapacity: 8,

      accommodation:
        "هتل 4 ستاره نزدیک مرکز شهر",

      transportation:
        "پرواز + ترانسفر شهری",

      meals: "صبحانه",

      guide: "راهنمای فارسی زبان",

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

    {
      slug: "sochi-summer-tour",

      name: "تور تابستانی سوچی",

      price: "38000",
      currency: "تومان",

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

      departureDate: new Date(
        "2027-07-15T08:00:00"
      ),

      returnDate: new Date(
        "2027-07-19T21:00:00"
      ),

      capacity: 25,
      remainingCapacity: 17,

      accommodation:
        "هتل 4 ستاره نزدیک ساحل",

      transportation:
        "پرواز + اتوبوس گردشگری",

      meals: "صبحانه",

      guide: "راهنمای تور",

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

  // ======================================================
  // CREATE / UPDATE TOURS
  // ======================================================

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

  // ======================================================
  // TRAIN TICKETS
  // ======================================================

  const trainTickets = [
    {
      slug: "moscow-saint-petersburg-train",

      name: "بلیط قطار مسکو به سن‌پترزبورگ",

      price: "8500",
      currency: "تومان",

      discountedPrice: "7500",
      discountPercentage: 12,

      shortDescription:
        "سفر ریلی از مسکو به سن‌پترزبورگ با قطار سریع‌السیر و صندلی راحت.",

      description:
        "بلیط قطار سریع‌السیر از مسکو به سن‌پترزبورگ با امکان انتخاب کلاس و نوع صندلی.",

      image: "/images/trains/moscow-spb.jpg",
      thumbImage:
        "/images/trains/moscow-spb-thumb.jpg",

      origin: "مسکو",
      destination: "سن‌پترزبورگ",

      originCity: "مسکو",
      destinationCity: "سن‌پترزبورگ",

      originStation:
        "Moscow Leningradsky Station",

      destinationStation:
        "Saint Petersburg Moskovsky Station",

      originCode: "MOW",
      destinationCode: "LED",

      trainCompany: "RZD",
      trainName: "Sapsan",
      trainNumber: "752A",

      trainType: "قطار سریع‌السیر",

      departureDate: new Date(
        "2026-11-15T07:30:00"
      ),

      arrivalDate: new Date(
        "2026-11-15T11:25:00"
      ),

      departureTime: "07:30",
      arrivalTime: "11:25",

      duration: "3 ساعت و 55 دقیقه",

      carriageType: "واگن صندلی",
      seatType: "Economy",

      capacity: 400,
      remainingCapacity: 145,

      baggage: "تا 36 کیلوگرم",

      refundPolicy:
        "امکان استرداد طبق قوانین شرکت راه‌آهن",

      cancellationPolicy:
        "لغو تا 24 ساعت قبل از حرکت با کسر جریمه",

      facilities: [
        "Wi-Fi",
        "پریز برق",
        "تهویه مطبوع",
        "سرویس بهداشتی",
      ],

      requirements: [
        "پاسپورت معتبر",
        "حضور حداقل 30 دقیقه قبل از حرکت",
      ],

      isSpecial: true,
      isPublished: true,

      gallery: [
        "/images/trains/train-1.jpg",
        "/images/trains/train-2.jpg",
      ],
    },

    {
      slug: "moscow-kazan-train",

      name: "بلیط قطار مسکو به کازان",

      price: "6200",
      currency: "تومان",

      discountedPrice: "5600",
      discountPercentage: 10,

      shortDescription:
        "سفر شبانه با قطار از مسکو به کازان با امکانات مناسب.",

      description:
        "بلیط قطار مسکو به کازان برای سفر راحت و اقتصادی.",

      image: "/images/trains/kazan.jpg",
      thumbImage:
        "/images/trains/kazan-thumb.jpg",

      origin: "مسکو",
      destination: "کازان",

      originCity: "مسکو",
      destinationCity: "کازان",

      originStation:
        "Kazan Railway Station",

      destinationStation:
        "Kazan Passenger Station",

      originCode: "MOW",
      destinationCode: "KZN",

      trainCompany: "RZD",
      trainName: "Kazan Express",
      trainNumber: "024M",

      trainType: "قطار بین‌شهری",

      departureDate: new Date(
        "2026-12-05T21:00:00"
      ),

      arrivalDate: new Date(
        "2026-12-06T10:30:00"
      ),

      departureTime: "21:00",
      arrivalTime: "10:30",

      duration: "13 ساعت و 30 دقیقه",

      carriageType: "کوپه",
      seatType: "4 نفره",

      capacity: 300,
      remainingCapacity: 96,

      baggage: "تا 36 کیلوگرم",

      refundPolicy:
        "طبق قوانین شرکت راه‌آهن",

      cancellationPolicy:
        "استرداد با کسر جریمه",

      facilities: [
        "تخت",
        "تهویه مطبوع",
        "سرویس بهداشتی",
      ],

      requirements: [
        "پاسپورت معتبر",
      ],

      isSpecial: false,
      isPublished: true,

      gallery: [
        "/images/trains/kazan-1.jpg",
        "/images/trains/kazan-2.jpg",
      ],
    },
  ];

  // ======================================================
  // CREATE / UPDATE TRAIN TICKETS
  // ======================================================

  for (const ticket of trainTickets) {
    const result =
      await prisma.trainTicket.upsert({
        where: {
          slug: ticket.slug,
        },

        update: ticket,

        create: ticket,
      });

    console.log(
      `🚆 Train: ${result.name}`
    );
  }

  console.log("");

  // ======================================================
  // FLIGHT TICKETS
  // ======================================================

  const flightTickets = [
    {
      slug: "moscow-istanbul-flight",

      name: "پرواز مسکو به استانبول",

      price: "28500",
      currency: "تومان",

      discountedPrice: "24900",
      discountPercentage: 13,

      shortDescription:
        "پرواز مستقیم مسکو به استانبول با ایرلاین معتبر.",

      description:
        "پرواز مستقیم از مسکو به استانبول با امکان حمل بار و انتخاب کلاس پروازی.",

      image: "/images/flights/moscow-istanbul.jpg",

      thumbImage:
        "/images/flights/moscow-istanbul-thumb.jpg",

      origin: "مسکو",
      destination: "استانبول",

      originCity: "مسکو",
      destinationCity: "استانبول",

      originAirport:
        "Sheremetyevo International Airport",

      destinationAirport:
        "Istanbul Airport",

      originAirportCode: "SVO",
      destinationAirportCode: "IST",

      airline: "Aeroflot",
      airlineCode: "SU",

      flightNumber: "SU213",

      departureDate: new Date(
        "2026-12-10T09:15:00"
      ),

      arrivalDate: new Date(
        "2026-12-10T13:20:00"
      ),

      departureTime: "09:15",
      arrivalTime: "13:20",

      duration: "4 ساعت و 5 دقیقه",

      cabinClass: "Economy",

      baggage: "23 کیلوگرم",

      handBaggage: "7 کیلوگرم",

      stops: 0,

      refundable: true,

      refundPolicy:
        "استرداد طبق قوانین ایرلاین",

      cancellationPolicy:
        "لغو با کسر جریمه",

      facilities: [
        "پذیرایی",
        "سیستم سرگرمی",
        "صندلی استاندارد",
      ],

      requirements: [
        "پاسپورت معتبر",
        "حضور حداقل 2 ساعت قبل از پرواز",
      ],

      capacity: 180,
      remainingCapacity: 42,

      isSpecial: true,
      isPublished: true,

      gallery: [
        "/images/flights/flight-1.jpg",
        "/images/flights/flight-2.jpg",
      ],
    },

    {
      slug: "moscow-dubai-flight",

      name: "پرواز مسکو به دبی",

      price: "33000",
      currency: "تومان",

      discountedPrice: "29900",
      discountPercentage: 9,

      shortDescription:
        "پرواز مسکو به دبی با امکان انتخاب کلاس اقتصادی و تجاری.",

      description:
        "پرواز بین‌المللی مسکو به دبی برای سفرهای تفریحی و تجاری.",

      image: "/images/flights/moscow-dubai.jpg",

      thumbImage:
        "/images/flights/moscow-dubai-thumb.jpg",

      origin: "مسکو",
      destination: "دبی",

      originCity: "مسکو",
      destinationCity: "دبی",

      originAirport:
        "Domodedovo International Airport",

      destinationAirport:
        "Dubai International Airport",

      originAirportCode: "DME",
      destinationAirportCode: "DXB",

      airline: "Emirates",
      airlineCode: "EK",

      flightNumber: "EK132",

      departureDate: new Date(
        "2027-01-20T14:30:00"
      ),

      arrivalDate: new Date(
        "2027-01-20T21:50:00"
      ),

      departureTime: "14:30",
      arrivalTime: "21:50",

      duration: "5 ساعت و 20 دقیقه",

      cabinClass: "Economy",

      baggage: "30 کیلوگرم",

      handBaggage: "7 کیلوگرم",

      stops: 0,

      refundable: true,

      refundPolicy:
        "طبق قوانین ایرلاین",

      cancellationPolicy:
        "لغو با کسر جریمه",

      facilities: [
        "پذیرایی",
        "Wi-Fi",
        "سیستم سرگرمی",
      ],

      requirements: [
        "پاسپورت معتبر",
      ],

      capacity: 260,
      remainingCapacity: 73,

      isSpecial: false,
      isPublished: true,

      gallery: [
        "/images/flights/dubai-1.jpg",
        "/images/flights/dubai-2.jpg",
      ],
    },
  ];

  // ======================================================
  // CREATE / UPDATE FLIGHTS
  // ======================================================

  for (const flight of flightTickets) {
    const result =
      await prisma.flightTicket.upsert({
        where: {
          slug: flight.slug,
        },

        update: flight,

        create: flight,
      });

    console.log(
      `✈️ Flight: ${result.name}`
    );
  }

  console.log("");

  // ======================================================
  // ACCOMMODATIONS
  // ======================================================

  const accommodations = [
    {
      slug: "moscow-central-hotel",

      name: "هتل مرکزی مسکو",

      price: "12000",
      currency: "تومان",

      discountedPrice: "9900",
      discountPercentage: 18,

      shortDescription:
        "هتل 4 ستاره در مرکز مسکو نزدیک به جاذبه‌های اصلی شهر.",

      description:
        "هتل مدرن و مجهز در مرکز مسکو با دسترسی مناسب به مترو، مراکز خرید و جاذبه‌های گردشگری.",

      country: "روسیه",
      city: "مسکو",

      address:
        "Tverskaya Street, Moscow",

      latitude: 55.757,
      longitude: 37.615,

      mapUrl:
        "https://maps.google.com/",

      image:
        "/images/accommodations/moscow-hotel.jpg",

      thumbImage:
        "/images/accommodations/moscow-hotel-thumb.jpg",

      gallery: [
        "/images/accommodations/moscow-1.jpg",
        "/images/accommodations/moscow-2.jpg",
        "/images/accommodations/moscow-3.jpg",
      ],

      accommodationType: "هتل",

      starRating: 4,

      roomType:
        "اتاق دبل استاندارد",

      capacity: 2,

      remainingCapacity: 8,

      rooms: 50,

      checkInTime: "14:00",
      checkOutTime: "12:00",

      minimumNights: 1,

      mealPlan: "صبحانه",

      amenities: [
        "Wi-Fi رایگان",
        "تهویه مطبوع",
        "تلویزیون",
        "مینی‌بار",
        "حمام اختصاصی",
      ],

      services: [
        "پذیرش 24 ساعته",
        "خانه‌داری",
        "ترانسفر فرودگاهی",
      ],

      cancellationPolicy:
        "لغو رایگان تا 48 ساعت قبل از ورود",

      houseRules:
        "ورود حیوانات خانگی مجاز نیست.",

      requirements: [
        "پاسپورت معتبر",
        "مدرک شناسایی",
      ],

      isSpecial: true,
      isPublished: true,
    },

    {
      slug: "saint-petersburg-hotel",

      name: "هتل سن‌پترزبورگ سنتر",

      price: "9500",
      currency: "تومان",

      discountedPrice: "8200",
      discountPercentage: 14,

      shortDescription:
        "اقامتگاه مناسب در مرکز سن‌پترزبورگ با دسترسی آسان به جاذبه‌های تاریخی.",

      description:
        "هتلی آرام و مجهز در مرکز سن‌پترزبورگ مناسب برای سفرهای خانوادگی و گردشگری.",

      country: "روسیه",
      city: "سن‌پترزبورگ",

      address:
        "Nevsky Prospect, Saint Petersburg",

      latitude: 59.934,
      longitude: 30.335,

      mapUrl:
        "https://maps.google.com/",

      image:
        "/images/accommodations/spb-hotel.jpg",

      thumbImage:
        "/images/accommodations/spb-hotel-thumb.jpg",

      gallery: [
        "/images/accommodations/spb-1.jpg",
        "/images/accommodations/spb-2.jpg",
      ],

      accommodationType: "هتل",

      starRating: 4,

      roomType:
        "اتاق دو نفره",

      capacity: 2,

      remainingCapacity: 12,

      rooms: 70,

      checkInTime: "14:00",
      checkOutTime: "12:00",

      minimumNights: 1,

      mealPlan: "صبحانه",

      amenities: [
        "Wi-Fi",
        "تهویه مطبوع",
        "تلویزیون",
        "حمام اختصاصی",
      ],

      services: [
        "پذیرش 24 ساعته",
        "خانه‌داری",
      ],

      cancellationPolicy:
        "لغو رایگان تا 24 ساعت قبل از ورود",

      houseRules:
        "رعایت سکوت بعد از ساعت 23",

      requirements: [
        "پاسپورت معتبر",
      ],

      isSpecial: false,
      isPublished: true,
    },
  ];

  // ======================================================
  // CREATE / UPDATE ACCOMMODATIONS
  // ======================================================

  for (const accommodation of accommodations) {
    const result =
      await prisma.accommodation.upsert({
        where: {
          slug: accommodation.slug,
        },

        update: accommodation,

        create: accommodation,
      });

    console.log(
      `🏨 Accommodation: ${result.name}`
    );
  }

  console.log("");

  // ======================================================
  // TOURIST VISAS
  // ======================================================

  const touristVisas = [
    {
      slug: "russia-tourist-visa",

      name: "ویزای توریستی روسیه",

      price: "18000",
      currency: "تومان",

      discountedPrice: "15500",
      discountPercentage: 14,

      shortDescription:
        "خدمات اخذ ویزای توریستی روسیه با پشتیبانی در آماده‌سازی مدارک.",

      description:
        "خدمات درخواست ویزای توریستی روسیه شامل بررسی مدارک، آماده‌سازی پرونده و پیگیری مراحل درخواست.",

      image:
        "/images/visas/russia.jpg",

      thumbImage:
        "/images/visas/russia-thumb.jpg",

      gallery: [
        "/images/visas/russia-1.jpg",
        "/images/visas/russia-2.jpg",
      ],

      country: "روسیه",

      countryCode: "RU",

      destination: "مسکو و سن‌پترزبورگ",

      visaType: "توریستی",

      entryType: "یک بار ورود",

      validityPeriod:
        "تا 30 روز",

      stayDuration:
        "حداکثر 30 روز",

      processingTime:
        "7 تا 15 روز کاری",

      urgentProcessing: true,

      urgentProcessingTime:
        "3 تا 5 روز کاری",

      requirements: [
        "پاسپورت معتبر",
        "فرم درخواست ویزا",
        "عکس پرسنلی",
        "رزرو هتل",
        "رزرو بلیط رفت و برگشت",
        "بیمه مسافرتی",
      ],

      requiredDocuments: [
        "اصل پاسپورت",
        "عکس پرسنلی",
        "فرم درخواست",
        "بیمه مسافرتی",
      ],

      additionalDocuments: [
        "رزرو هتل",
        "رزرو پرواز",
        "مدارک مالی در صورت نیاز",
      ],

      included: [
        "بررسی مدارک",
        "تکمیل فرم درخواست",
        "مشاوره ویزا",
        "پیگیری پرونده",
      ],

      excluded: [
        "هزینه سفارت",
        "هزینه ترجمه رسمی",
        "هزینه بیمه",
      ],

      interviewRequired: false,

      biometricsRequired: false,

      cancellationPolicy:
        "پس از ارسال پرونده، هزینه خدمات قابل استرداد نیست.",

      notes:
        "مدت بررسی پرونده ممکن است بر اساس شرایط سفارت تغییر کند.",

      isSpecial: true,
      isPublished: true,
    },

    {
      slug: "turkey-tourist-visa",

      name: "خدمات ویزای توریستی ترکیه",

      price: "12500",
      currency: "تومان",

      discountedPrice: "11000",
      discountPercentage: 12,

      shortDescription:
        "خدمات مشاوره و آماده‌سازی مدارک سفر توریستی به ترکیه.",

      description:
        "خدمات مربوط به آماده‌سازی مدارک و مشاوره برای سفر توریستی به ترکیه.",

      image:
        "/images/visas/turkey.jpg",

      thumbImage:
        "/images/visas/turkey-thumb.jpg",

      gallery: [
        "/images/visas/turkey-1.jpg",
        "/images/visas/turkey-2.jpg",
      ],

      country: "ترکیه",

      countryCode: "TR",

      destination:
        "استانبول و شهرهای توریستی ترکیه",

      visaType: "توریستی",

      entryType: "یک بار ورود",

      validityPeriod:
        "بسته به پرونده",

      stayDuration:
        "طبق مجوز صادرشده",

      processingTime:
        "5 تا 12 روز کاری",

      urgentProcessing: true,

      urgentProcessingTime:
        "2 تا 5 روز کاری",

      requirements: [
        "پاسپورت معتبر",
        "عکس پرسنلی",
        "فرم درخواست",
        "بیمه مسافرتی",
      ],

      requiredDocuments: [
        "پاسپورت",
        "عکس",
        "فرم درخواست",
      ],

      additionalDocuments: [
        "رزرو هتل",
        "رزرو پرواز",
        "مدارک مالی",
      ],

      included: [
        "مشاوره",
        "بررسی مدارک",
        "آماده‌سازی پرونده",
      ],

      excluded: [
        "هزینه‌های دولتی",
        "ترجمه مدارک",
        "بیمه",
      ],

      interviewRequired: false,

      biometricsRequired: false,

      cancellationPolicy:
        "پس از شروع فرآیند، هزینه خدمات قابل استرداد نیست.",

      notes:
        "شرایط ویزا بر اساس تابعیت متقاضی متفاوت است.",

      isSpecial: false,
      isPublished: true,
    },
  ];

  // ======================================================
  // CREATE / UPDATE VISAS
  // ======================================================

  for (const visa of touristVisas) {
    const result =
      await prisma.touristVisa.upsert({
        where: {
          slug: visa.slug,
        },

        update: visa,

        create: visa,
      });

    console.log(
      `🛂 Visa: ${result.name}`
    );
  }

  console.log("");

  // ======================================================
  // FINISHED
  // ======================================================

  console.log(
    "=========================================="
  );

  console.log(
    "🎉 Seed completed successfully!"
  );

  console.log(
    "=========================================="
  );

  console.log("");

  console.log("📊 Seed summary:");
  console.log("   👤 Admin: 1");
  console.log(`   🧳 Tours: ${tours.length}`);
console.log(
  `   🚆 Train tickets: ${trainTickets.length}`
);

console.log(
  `   ✈️ Flight tickets: ${flightTickets.length}`
);

console.log(
  `   🚌 Bus tickets: ${buses.length}`
);

console.log(
  `   🏨 Accommodations: ${accommodations.length}`
);

  console.log("");

  console.log("🔐 Admin login:");
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });