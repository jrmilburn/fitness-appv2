import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const muscleGroupsWithExercises = [
    {
      name: 'Chest',
      exercises: [
        { name: 'Bench Press', notes: 'Lie flat on a bench with feet firmly on the ground. Grip the bar slightly wider than shoulder-width. Lower the bar to your mid-chest, keeping elbows at a 45-degree angle. Press the bar back up to full arm extension, engaging your chest throughout.' },
        { name: 'Incline Dumbbell Press', notes: 'Set the bench at a 30-degree incline. Hold dumbbells over your chest, palms facing forward. Lower the weights to chest level, keeping elbows at a 45-degree angle. Press up until arms are fully extended.' },
        { name: 'Chest Fly', notes: 'Lie flat on a bench with dumbbells over your chest. With a slight bend in your elbows, lower the weights to the side until you feel a stretch in your chest. Squeeze your chest to bring the weights back together at the top.' },
        { name: 'Machine Chest Press', notes: 'Sit with your back against the pad. Grip the handles at chest height, with elbows slightly below shoulder level. Push the handles forward until arms are fully extended, then slowly return to the starting position.' },
        { name: 'Push-Ups', notes: 'Start in a high plank with hands shoulder-width apart. Lower yourself until your chest almost touches the ground, keeping elbows at a 45-degree angle. Push back up, keeping your body in a straight line.' }
      ],
    },
    {
      name: 'Back',
      exercises: [
        { name: 'Pull-Up', notes: 'Hang from a bar with palms facing away, hands shoulder-width apart. Engage your lats and pull yourself up until your chin clears the bar. Lower slowly, keeping tension in your back.' },
        { name: 'Barbell Row', notes: 'Stand with feet shoulder-width apart, bend your knees slightly and hinge forward at the hips. Grip the bar and pull it towards your lower chest, keeping elbows close to your body. Lower slowly, maintaining a flat back.' },
        { name: 'Deadlift', notes: 'Stand with feet hip-width apart. Bend at your hips and knees to grip the bar just outside your knees. Keep your back straight as you stand, pushing through your heels, and extend your hips to lock out at the top.' },
        { name: 'Lat Pulldown', notes: 'Sit down with your thighs under the support pads. Grip the bar wider than shoulder-width, palms facing away. Pull the bar down to your chest, squeezing your lats, then slowly release back to the top.' },
        { name: 'Seated Cable Row', notes: 'Sit on the bench, grip the handle, and keep your torso upright. Pull the handle towards your abdomen, squeezing your shoulder blades together, then slowly release to starting position.' }
      ],
    },
    {
      name: 'Biceps',
      exercises: [
        { name: 'Barbell Curl', notes: 'Stand with feet hip-width apart. Grip the bar with palms facing up, shoulder-width apart. Curl the bar up towards your chest, keeping elbows close to your body. Lower slowly to starting position.' },
        { name: 'Hammer Curl', notes: 'Hold dumbbells by your sides with palms facing in. Keep elbows stationary as you curl the weights up towards your shoulders. Lower back down with control.' },
        { name: 'Concentration Curl', notes: 'Sit on a bench with one elbow resting on the inside of your thigh. Curl the weight towards your shoulder, focusing on a squeeze at the top. Lower back down with control.' },
        { name: 'Cable Curl', notes: 'Stand facing the cable machine with the handle attached low. Grip the handle and curl towards your shoulders, keeping elbows at your sides. Lower slowly with control.' },
        { name: 'Preacher Curl', notes: 'Sit at the preacher bench, resting arms on the pad. Grip the bar or dumbbell and curl towards your shoulders. Lower with control, keeping tension on your biceps.' }
      ],
    },
    {
      name: 'Triceps',
      exercises: [
        { name: 'Tricep Pushdown', notes: 'Stand facing the cable machine, grip the handle with palms down. Keep elbows at your sides and extend your arms, pushing down until fully straight. Return slowly to starting position.' },
        { name: 'Overhead Tricep Extension', notes: 'Hold a dumbbell overhead with both hands. Lower it behind your head, keeping elbows close to your head. Extend your arms back up to the starting position.' },
        { name: 'Dips', notes: 'Place hands on parallel bars and lift yourself up. Lower until elbows reach a 90-degree angle, then press back up, focusing on your triceps.' },
        { name: 'Skull Crushers', notes: 'Lie on a bench with a barbell over your chest. Bend your elbows to lower the bar to your forehead, then extend your arms to press the bar back up.' },
        { name: 'Close Grip Bench Press', notes: 'Lie on a bench, gripping the bar with hands close together. Lower the bar to your chest, keeping elbows tucked, then press up to full extension.' }
      ],
    },
    {
      name: 'Shoulders',
      exercises: [
        { name: 'Overhead Press', notes: 'Stand with feet hip-width apart, grip the bar at shoulder height. Press the bar overhead until arms are fully extended, then slowly lower back down.' },
        { name: 'Lateral Raise', notes: 'Hold dumbbells by your sides, palms facing in. Raise your arms to shoulder height, keeping a slight bend in your elbows. Lower back down with control.' },
        { name: 'Front Raise', notes: 'Hold dumbbells in front of your thighs. Raise one or both weights to shoulder height, then lower back down with control.' },
        { name: 'Reverse Pec Deck', notes: 'Sit facing the pec deck machine. Grip the handles with elbows slightly bent and pull them back until your arms are extended. Return slowly to starting position.' },
        { name: 'Arnold Press', notes: 'Hold dumbbells in front of your shoulders, palms facing you. Rotate palms outward as you press up, then return to starting position with palms facing in.' }
      ],
    },
    {
      name: 'Quads',
      exercises: [
        { name: 'Squat', notes: 'Stand with feet shoulder-width apart. Lower down by bending hips and knees until thighs are parallel to the ground, then press back up.' },
        { name: 'Leg Press', notes: 'Sit on the leg press machine, placing feet shoulder-width apart on the platform. Push the platform away until legs are almost straight, then lower back down.' },
        { name: 'Lunges', notes: 'Step one leg forward, lowering until both knees are at 90-degree angles. Push through the front foot to return to standing.' },
        { name: 'Leg Extension', notes: 'Sit on the machine, place feet under the pad, and extend legs until straight. Lower back down with control.' },
        { name: 'Hack Squat', notes: 'Stand on the hack squat machine platform. Lower down until knees are at 90 degrees, then press back up.' }
      ],
    },
    {
      name: 'Hamstrings',
      exercises: [
        { name: 'Deadlift', notes: 'With a hip-width stance, hinge at your hips and lower to grip the bar. Drive through your heels to stand, keeping back straight.' },
        { name: 'Leg Curl', notes: 'Lie face down on the leg curl machine. Curl your legs up towards your glutes, then slowly release back down.' },
        { name: 'Romanian Deadlift', notes: 'Hold barbell or dumbbells, hinge at hips while keeping legs almost straight. Lower until hamstrings are stretched, then return upright.' },
        { name: 'Glute-Ham Raise', notes: 'Secure feet in the GHD machine, lower torso until nearly parallel with the ground, then contract hamstrings to return.' },
        { name: 'Seated Leg Curl', notes: 'Sit on the machine with legs under the pad. Curl your legs down, then return slowly to starting position.' }
      ],
    },
    {
      name: 'Glutes',
      exercises: [
        { name: 'Hip Thrust', notes: 'Sit on the ground with your shoulders against a bench. Roll a barbell over your hips, then drive through heels to lift your hips.' },
        { name: 'Glute Bridge', notes: 'Lie on your back with knees bent and feet on the ground. Drive hips up to form a straight line from knees to shoulders.' },
        { name: 'Bulgarian Split Squat', notes: 'Place one foot behind you on a bench. Lower down on the front leg until thigh is parallel, then push back up.' },
        { name: 'Cable Kickback', notes: 'Attach an ankle strap to a low pulley. Kick one leg back, squeezing glutes, then return with control.' },
        { name: 'Smith Machine Squat', notes: 'Stand under the bar with feet shoulder-width apart. Lower down and press back up, focusing on glute activation.' }
      ],
    },
    {
      name: 'Calves',
      exercises: [
        { name: 'Calf Raise', notes: 'Stand with feet shoulder-width apart. Raise onto toes, squeezing calves, then lower slowly.' },
        { name: 'Seated Calf Raise', notes: 'Sit at the machine with pad over your thighs. Raise your heels, squeezing calves, then lower slowly.' },
        { name: 'Donkey Calf Raise', notes: 'Bend forward with weight on your lower back. Raise heels as high as possible, then lower with control.' },
        { name: 'Smith Machine Calf Raise', notes: 'Stand under the bar with feet on a raised platform. Lift onto toes, then lower back down.' },
        { name: 'Standing Calf Raise', notes: 'Position feet on calf raise machine. Raise onto toes, hold, then return with control.' }
      ],
    },
    {
      name: 'Abs',
      exercises: [
        { name: 'Crunch', notes: 'Lie on your back, hands behind your head. Lift shoulders towards knees, keeping lower back on the ground.' },
        { name: 'Plank', notes: 'Position body on elbows and toes, forming a straight line. Hold position, bracing core.' },
        { name: 'Leg Raise', notes: 'Lie on your back, lift legs towards the ceiling, and slowly lower them without touching the ground.' },
        { name: 'Cable Crunch', notes: 'Kneel facing the cable machine, gripping the rope. Crunch down, contracting abs, then release with control.' },
        { name: 'Russian Twist', notes: 'Sit on the floor, lean back slightly and twist torso side-to-side with or without weight.' }
      ],
    },
  ];


  const sets = await prisma.set.deleteMany();
  const excercises = await prisma.excercise.deleteMany();
  const workouts = await prisma.workout.deleteMany();
  const weeks = await prisma.week.deleteMany();
  const programs = await prisma.program.deleteMany();

  for (const group of muscleGroupsWithExercises) {
    const muscleGroup = await prisma.muscleGroup.upsert({
      where: { name: group.name },
      update: {},
      create: { name: group.name },
    });

    console.log(`Upserted muscle group: ${muscleGroup.name}`);

    for (const { name, notes } of group.exercises) {
      const existingExercise = await prisma.excercise.findFirst({
        where: { name, muscleGroupId: muscleGroup.id },
      });

      if (!existingExercise) {
        const newExercise = await prisma.excercise.create({
          data: {
            name,
            muscleGroupId: muscleGroup.id,
            notes,
          },
        });
        console.log(`Created exercise: ${newExercise.name} for muscle group: ${muscleGroup.name}`);
      } else {
        console.log(`Exercise: ${name} already exists for muscle group: ${muscleGroup.name}`);
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
