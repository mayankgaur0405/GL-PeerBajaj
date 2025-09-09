import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from '../lib/db.js';
import { User } from '../models/User.js';

async function run() {
  await connectDB();
  await User.deleteMany({});
  const demo = [
    {
      name: 'Aarav Sharma',
      email: 'aarav@gla.com',
      password: 'password123',
      username: 'aarav',
      year: '3',
      department: 'CSE',
      specialization: 'AI',
      bio: 'Love DSA and mentorship',
      sections: [
        {
          title: 'DSA',
          description: 'My favorite DSA resources',
          resources: [
            { img: '', link: 'https://neetcode.io/', description: 'NeetCode roadmap' },
            { img: '', link: 'https://cp-algorithms.com/', description: 'CP Algorithms' }
          ]
        },
        {
          title: 'Web Dev',
          description: 'Frontend + Backend',
          resources: [
            { img: '', link: 'https://react.dev/', description: 'React Docs' },
            { img: '', link: 'https://expressjs.com/', description: 'Express Docs' }
          ]
        }
      ]
    },
    {
      name: 'Priya Gupta',
      email: 'priya@gla.com',
      password: 'password123',
      username: 'priya',
      year: '2',
      department: 'CSE',
      specialization: 'Data Science',
      bio: 'Sharing semester notes',
      sections: [
        {
          title: 'Semester Exams',
          description: 'Notes and PYQs',
          resources: [
            { img: '', link: 'https://drive.google.com/', description: 'Drive Folder' }
          ]
        }
      ]
    },
    {
      name: 'Rahul Verma',
      email: 'rahul@gla.com',
      password: 'password123',
      username: 'rahul',
      year: '4',
      department: 'IT',
      specialization: 'Cybersecurity',
      bio: 'Security enthusiast',
      sections: []
    }
  ];

  const created = await User.insertMany(demo);

  // simple follow graph
  const [u1, u2, u3] = created;
  u1.following.push(u2._id);
  u2.followers.push(u1._id);
  await u1.save();
  await u2.save();

  console.log('Seeded users:', created.map((u) => u.username));
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


