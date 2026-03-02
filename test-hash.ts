import bcrypt from 'bcryptjs';

async function testHash() {
  const password = '12345678';
  const storedHash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8JZ9n5Kk0k7X3L5QJpG6Zx6ZP0F5k2';
  
  console.log('Testing password:', password);
  console.log('Against hash:', storedHash);
  console.log('Hash length:', storedHash.length);
  
  const match = await bcrypt.compare(password, storedHash);
  console.log('Match result:', match);
  
  // Generate new hash untuk comparison
  const newHash = await bcrypt.hash(password, 10);
  console.log('\nNew hash generated:', newHash);
  const newMatch = await bcrypt.compare(password, newHash);
  console.log('New hash match:', newMatch);
}

testHash();