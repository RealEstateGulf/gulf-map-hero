import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as Prisma.PrismaClientOptions);

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gulfinvest.com' },
    update: {},
    create: {
      email: 'admin@gulfinvest.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      active: true,
    },
  });
  console.log('✅ Super Admin oluşturuldu:', admin.email);
  console.log('   Email: admin@gulfinvest.com');
  console.log('   Şifre: admin123');
  console.log('   ⚠️  İlk girişten sonra şifreyi değiştir!');

  const pages = ['home', 'about', 'services', 'turkey', 'citizenship', 'vip', 'contact', 'properties', 'insights'];
  for (const pageKey of pages) {
    await prisma.seoSettings.upsert({
      where: { pageKey },
      update: {},
      create: { pageKey, titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '' },
    });
  }
  console.log('✅ SEO kayıtları oluşturuldu');

  const cities = [
    { nameAr: 'إسطنبول', nameEn: 'Istanbul', lat: 41.0082, lng: 28.9784, sortOrder: 0 },
    { nameAr: 'بورصة', nameEn: 'Bursa', lat: 40.1885, lng: 29.061, sortOrder: 1 },
    { nameAr: 'أنطاليا', nameEn: 'Antalya', lat: 36.8969, lng: 30.7133, sortOrder: 2 },
    { nameAr: 'إزمير', nameEn: 'Izmir', lat: 38.4237, lng: 27.1428, sortOrder: 3 },
    { nameAr: 'تشيشمه', nameEn: 'Çeşme', lat: 38.3243, lng: 26.323, sortOrder: 4 },
    { nameAr: 'يالوفا', nameEn: 'Yalova', lat: 40.6551, lng: 29.2769, sortOrder: 5 },
    { nameAr: 'طرابزون', nameEn: 'Trabzon', lat: 41.0027, lng: 39.7168, sortOrder: 6 },
    { nameAr: 'كابادوكيا', nameEn: 'Cappadocia', lat: 38.6431, lng: 34.8543, sortOrder: 7 },
  ];
  for (const city of cities) {
    const existing = await prisma.city.findFirst({ where: { nameEn: city.nameEn } });
    if (!existing) await prisma.city.create({ data: { ...city, active: true } });
  }
  console.log('✅ Şehirler oluşturuldu');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
