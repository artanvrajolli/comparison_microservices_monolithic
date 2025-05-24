const { spawn } = require('child_process');
const path = require('path');

console.log('Starting database seeding process...');

// Function to run a command as a spawned process
const runCommand = (command, serviceName) => {
  return new Promise((resolve, reject) => {
    console.log(`\n===== ${serviceName} =====`);
    console.log(`Running command: ${command}`);

    const [cmd, ...args] = command.split(' ');
    const process = spawn(cmd, args, {
      shell: true,
      stdio: 'inherit' // Show output directly in the console
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`\n${serviceName} completed successfully`);
        resolve();
      } else {
        console.error(`\n${serviceName} failed with code ${code}`);
        reject(new Error(`${serviceName} seeding failed with exit code ${code}`));
      }
    });

    process.on('error', (err) => {
      console.error(`\n${serviceName} process error:`, err);
      reject(err);
    });
  });
};

// Main seeding function
const seedAll = async () => {
  try {
    console.log('\nStarting seeding process in sequence...');

    // Step 1: Seed users
    await runCommand('docker-compose exec user-service npm run seed', 'USER SERVICE');

    // Step 2: Seed blogs
    await runCommand('docker-compose exec blog-service npm run seed', 'BLOG SERVICE');

    // Step 3: Seed comments
    await runCommand('docker-compose exec comment-service npm run seed', 'COMMENT SERVICE');

    console.log('\n===== ALL SEEDING COMPLETED SUCCESSFULLY =====');
  } catch (error) {
    console.error('\n===== SEEDING FAILED =====');
    console.error(error.message);
    process.exit(1);
  }
};

// Run the seeding process
seedAll(); 