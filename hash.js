import bcrypt from 'bcrypt';

const createHashes = async () => {

    // Plain text passwords
    const userPassword = 'User123!';
    const adminPassword = 'cse340!';

    // Generate hashes
    const userHash = await bcrypt.hash(userPassword, 10);
    const adminHash = await bcrypt.hash(adminPassword, 10);

    // Display hashes
    console.log('\nUser Hash:');
    console.log(userHash);

    console.log('\nAdmin Hash:');
    console.log(adminHash);
};

createHashes();