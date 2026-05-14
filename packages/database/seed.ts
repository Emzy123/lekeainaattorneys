import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pre-hashed password: 'password123' (bcrypt salt round 10)
const DEFAULT_PASSWORD_HASH = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa';

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lexplatform.com' },
    update: {},
    create: {
      email: 'admin@lexplatform.com',
      name: 'System Administrator',
      password: DEFAULT_PASSWORD_HASH,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user created/verified: ${admin.email}`);

  // 2. Create Practice Areas
  const practiceAreas = [
    { title: 'Corporate Law', slug: 'corporate-law', description: 'Comprehensive legal services for businesses.', published: true },
    { title: 'Intellectual Property', slug: 'intellectual-property', description: 'Protecting your innovations and brands.', published: true },
    { title: 'Litigation & Dispute Resolution', slug: 'litigation', description: 'Expert representation in civil and commercial disputes.', published: true },
  ];

  for (const pa of practiceAreas) {
    await prisma.practiceArea.upsert({
      where: { slug: pa.slug },
      update: {},
      create: pa,
    });
  }
  console.log(`✅ Seeded ${practiceAreas.length} practice areas`);

  // 3. Create Blog Posts
  const posts = [
    {
      title: 'The Future of AI in Legal Practices',
      slug: 'future-of-ai-legal-practices',
      excerpt: 'How artificial intelligence is reshaping the way law firms operate.',
      content: '<p>Artificial intelligence is no longer just a buzzword; it is a <strong>transformational force</strong> in the legal industry.</p><ul><li>Automated contract review</li><li>Predictive analytics for litigation</li><li>Enhanced legal research</li></ul><p>Firms adopting these technologies are seeing unprecedented efficiency.</p>',
      published: true,
      authorId: admin.id,
    },
    {
      title: 'Navigating New Data Privacy Regulations',
      slug: 'navigating-data-privacy-2026',
      excerpt: 'A comprehensive guide to compliance in a rapidly changing digital landscape.',
      content: '<p>With the introduction of new compliance requirements, businesses must stay vigilant.</p><h2>Key Steps for Compliance</h2><ol><li>Conduct a comprehensive data audit.</li><li>Update privacy policies.</li><li>Implement robust access controls.</li></ol>',
      published: true,
      authorId: admin.id,
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`✅ Seeded ${posts.length} blog posts`);

  // 4. Create Team Members
  const teamMembers = [
    { name: 'Dr. Sarah Leke', title: 'Managing Partner', bio: 'Expert in corporate restructuring and IP law with 15+ years of experience.', published: true, order: 1 },
    { name: 'James Barr', title: 'Senior Litigator', bio: 'Leading the civil litigation department with a track record of high-profile wins.', published: true, order: 2 },
  ];

  for (const member of teamMembers) {
    // Upsert isn't as clean without a unique identifier, so we check first
    const exists = await prisma.teamMember.findFirst({ where: { name: member.name } });
    if (!exists) {
      await prisma.teamMember.create({ data: member });
    }
  }
  console.log(`✅ Seeded ${teamMembers.length} team members`);

  // 5. Create Premium Resources
  const resources = [
    { 
      title: 'Startup Legal Playbook', 
      slug: 'startup-legal-playbook', 
      description: 'Comprehensive guide and templates for incorporating and protecting your startup.', 
      fileUrl: 'https://example.com/playbook.pdf',
      fileSize: 2048,
      fileType: 'application/pdf',
      price: 25000, 
      currency: 'NGN',
      published: true 
    },
    { 
      title: 'Standard NDA Template', 
      slug: 'standard-nda-template', 
      description: 'Ironclad Non-Disclosure Agreement for commercial discussions.', 
      fileUrl: 'https://example.com/nda.docx',
      fileSize: 512,
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      price: 5000, 
      currency: 'NGN',
      published: true 
    },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: {},
      create: resource,
    });
  }
  console.log(`✅ Seeded ${resources.length} premium resources`);

  console.log('Database seeding complete! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
