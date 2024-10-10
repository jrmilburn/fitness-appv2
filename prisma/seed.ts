import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const muscleGroupsWithExercises = [
    {
      name: 'Chest',
      exercises: ['Bench Press', 'Incline Dumbbell Press', 'Chest Fly'],
    },
    {
      name: 'Back',
      exercises: ['Pull-Up', 'Barbell Row', 'Deadlift'],
    },
    {
      name: 'Biceps',
      exercises: ['Barbell Curl', 'Hammer Curl', 'Concentration Curl'],
    },
    {
      name: 'Triceps',
      exercises: ['Tricep Pushdown', 'Overhead Tricep Extension', 'Dips'],
    },
    {
      name: 'Shoulders',
      exercises: ['Overhead Press', 'Lateral Raise', 'Front Raise'],
    },
    {
      name: 'Quads',
      exercises: ['Squat', 'Leg Press', 'Lunges'],
    },
    {
      name: 'Hamstrings',
      exercises: ['Deadlift', 'Leg Curl', 'Romanian Deadlift'],
    },
    {
      name: 'Glutes',
      exercises: ['Hip Thrust', 'Glute Bridge', 'Bulgarian Split Squat'],
    },
    {
      name: 'Calves',
      exercises: ['Calf Raise', 'Seated Calf Raise', 'Donkey Calf Raise'],
    },
    {
      name: 'Abs',
      exercises: ['Crunch', 'Plank', 'Leg Raise'],
    },
  ];

  // Loop through the muscle groups and upsert the muscle groups and exercises
  for (const group of muscleGroupsWithExercises) {
    // Upsert the muscle group
    const muscleGroup = await prisma.muscleGroup.upsert({
      where: { name: group.name },
      update: {}, // Do nothing if the muscle group exists
      create: {
        name: group.name,
      },
    });

    console.log(`Upserted muscle group: ${muscleGroup.name}`);

    // Loop through the exercises for each muscle group and ensure they are added
    for (const exerciseName of group.exercises) {
      // Check if the exercise already exists for the muscle group
      const existingExercise = await prisma.excercise.findFirst({
        where: {
          name: exerciseName,
          muscleGroupId: muscleGroup.id,
        },
      });

      // If the exercise doesn't exist, create it
      if (!existingExercise) {
        const newExercise = await prisma.excercise.create({
          data: {
            name: exerciseName,
            muscleGroupId: muscleGroup.id, // Link it to the correct muscle group
          },
        });
        console.log(`Created exercise: ${newExercise.name} for muscle group: ${muscleGroup.name}`);
      } else {
        console.log(`Exercise: ${exerciseName} already exists for muscle group: ${muscleGroup.name}`);
      }
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });