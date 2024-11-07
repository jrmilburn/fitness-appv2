"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var muscleGroupsWithExercises, sets, excercises, workouts, weeks, programs, _i, muscleGroupsWithExercises_1, group, muscleGroup, _a, _b, _c, name_1, details, existingExercise, newExercise;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    muscleGroupsWithExercises = [
                        {
                            name: 'Chest',
                            exercises: [
                                { name: 'Bench Press', details: 'Lie flat on a bench with feet firmly on the ground. Grip the bar slightly wider than shoulder-width. Lower the bar to your mid-chest, keeping elbows at a 45-degree angle. Press the bar back up to full arm extension, engaging your chest throughout.' },
                                { name: 'Incline Dumbbell Press', details: 'Set the bench at a 30-degree incline. Hold dumbbells over your chest, palms facing forward. Lower the weights to chest level, keeping elbows at a 45-degree angle. Press up until arms are fully extended.' },
                                { name: 'Chest Fly', details: 'Lie flat on a bench with dumbbells over your chest. With a slight bend in your elbows, lower the weights to the side until you feel a stretch in your chest. Squeeze your chest to bring the weights back together at the top.' },
                                { name: 'Machine Chest Press', details: 'Sit with your back against the pad. Grip the handles at chest height, with elbows slightly below shoulder level. Push the handles forward until arms are fully extended, then slowly return to the starting position.' },
                                { name: 'Push-Ups', details: 'Start in a high plank with hands shoulder-width apart. Lower yourself until your chest almost touches the ground, keeping elbows at a 45-degree angle. Push back up, keeping your body in a straight line.' }
                            ],
                        },
                        {
                            name: 'Back',
                            exercises: [
                                { name: 'Pull-Up', details: 'Hang from a bar with palms facing away, hands shoulder-width apart. Engage your lats and pull yourself up until your chin clears the bar. Lower slowly, keeping tension in your back.' },
                                { name: 'Barbell Row', details: 'Stand with feet shoulder-width apart, bend your knees slightly and hinge forward at the hips. Grip the bar and pull it towards your lower chest, keeping elbows close to your body. Lower slowly, maintaining a flat back.' },
                                { name: 'Deadlift', details: 'Stand with feet hip-width apart. Bend at your hips and knees to grip the bar just outside your knees. Keep your back straight as you stand, pushing through your heels, and extend your hips to lock out at the top.' },
                                { name: 'Lat Pulldown', details: 'Sit down with your thighs under the support pads. Grip the bar wider than shoulder-width, palms facing away. Pull the bar down to your chest, squeezing your lats, then slowly release back to the top.' },
                                { name: 'Seated Cable Row', details: 'Sit on the bench, grip the handle, and keep your torso upright. Pull the handle towards your abdomen, squeezing your shoulder blades together, then slowly release to starting position.' }
                            ],
                        },
                        {
                            name: 'Biceps',
                            exercises: [
                                { name: 'Barbell Curl', details: 'Stand with feet hip-width apart. Grip the bar with palms facing up, shoulder-width apart. Curl the bar up towards your chest, keeping elbows close to your body. Lower slowly to starting position.' },
                                { name: 'Hammer Curl', details: 'Hold dumbbells by your sides with palms facing in. Keep elbows stationary as you curl the weights up towards your shoulders. Lower back down with control.' },
                                { name: 'Concentration Curl', details: 'Sit on a bench with one elbow resting on the inside of your thigh. Curl the weight towards your shoulder, focusing on a squeeze at the top. Lower back down with control.' },
                                { name: 'Cable Curl', details: 'Stand facing the cable machine with the handle attached low. Grip the handle and curl towards your shoulders, keeping elbows at your sides. Lower slowly with control.' },
                                { name: 'Preacher Curl', details: 'Sit at the preacher bench, resting arms on the pad. Grip the bar or dumbbell and curl towards your shoulders. Lower with control, keeping tension on your biceps.' }
                            ],
                        },
                        {
                            name: 'Triceps',
                            exercises: [
                                { name: 'Tricep Pushdown', details: 'Stand facing the cable machine, grip the handle with palms down. Keep elbows at your sides and extend your arms, pushing down until fully straight. Return slowly to starting position.' },
                                { name: 'Overhead Tricep Extension', details: 'Hold a dumbbell overhead with both hands. Lower it behind your head, keeping elbows close to your head. Extend your arms back up to the starting position.' },
                                { name: 'Dips', details: 'Place hands on parallel bars and lift yourself up. Lower until elbows reach a 90-degree angle, then press back up, focusing on your triceps.' },
                                { name: 'Skull Crushers', details: 'Lie on a bench with a barbell over your chest. Bend your elbows to lower the bar to your forehead, then extend your arms to press the bar back up.' },
                                { name: 'Close Grip Bench Press', details: 'Lie on a bench, gripping the bar with hands close together. Lower the bar to your chest, keeping elbows tucked, then press up to full extension.' }
                            ],
                        },
                        {
                            name: 'Shoulders',
                            exercises: [
                                { name: 'Overhead Press', details: 'Stand with feet hip-width apart, grip the bar at shoulder height. Press the bar overhead until arms are fully extended, then slowly lower back down.' },
                                { name: 'Lateral Raise', details: 'Hold dumbbells by your sides, palms facing in. Raise your arms to shoulder height, keeping a slight bend in your elbows. Lower back down with control.' },
                                { name: 'Front Raise', details: 'Hold dumbbells in front of your thighs. Raise one or both weights to shoulder height, then lower back down with control.' },
                                { name: 'Reverse Pec Deck', details: 'Sit facing the pec deck machine. Grip the handles with elbows slightly bent and pull them back until your arms are extended. Return slowly to starting position.' },
                                { name: 'Arnold Press', details: 'Hold dumbbells in front of your shoulders, palms facing you. Rotate palms outward as you press up, then return to starting position with palms facing in.' }
                            ],
                        },
                        {
                            name: 'Quads',
                            exercises: [
                                { name: 'Squat', details: 'Stand with feet shoulder-width apart. Lower down by bending hips and knees until thighs are parallel to the ground, then press back up.' },
                                { name: 'Leg Press', details: 'Sit on the leg press machine, placing feet shoulder-width apart on the platform. Push the platform away until legs are almost straight, then lower back down.' },
                                { name: 'Lunges', details: 'Step one leg forward, lowering until both knees are at 90-degree angles. Push through the front foot to return to standing.' },
                                { name: 'Leg Extension', details: 'Sit on the machine, place feet under the pad, and extend legs until straight. Lower back down with control.' },
                                { name: 'Hack Squat', details: 'Stand on the hack squat machine platform. Lower down until knees are at 90 degrees, then press back up.' }
                            ],
                        },
                        {
                            name: 'Hamstrings',
                            exercises: [
                                { name: 'Deadlift', details: 'With a hip-width stance, hinge at your hips and lower to grip the bar. Drive through your heels to stand, keeping back straight.' },
                                { name: 'Leg Curl', details: 'Lie face down on the leg curl machine. Curl your legs up towards your glutes, then slowly release back down.' },
                                { name: 'Romanian Deadlift', details: 'Hold barbell or dumbbells, hinge at hips while keeping legs almost straight. Lower until hamstrings are stretched, then return upright.' },
                                { name: 'Glute-Ham Raise', details: 'Secure feet in the GHD machine, lower torso until nearly parallel with the ground, then contract hamstrings to return.' },
                                { name: 'Seated Leg Curl', details: 'Sit on the machine with legs under the pad. Curl your legs down, then return slowly to starting position.' }
                            ],
                        },
                        {
                            name: 'Glutes',
                            exercises: [
                                { name: 'Hip Thrust', details: 'Sit on the ground with your shoulders against a bench. Roll a barbell over your hips, then drive through heels to lift your hips.' },
                                { name: 'Glute Bridge', details: 'Lie on your back with knees bent and feet on the ground. Drive hips up to form a straight line from knees to shoulders.' },
                                { name: 'Bulgarian Split Squat', details: 'Place one foot behind you on a bench. Lower down on the front leg until thigh is parallel, then push back up.' },
                                { name: 'Cable Kickback', details: 'Attach an ankle strap to a low pulley. Kick one leg back, squeezing glutes, then return with control.' },
                                { name: 'Smith Machine Squat', details: 'Stand under the bar with feet shoulder-width apart. Lower down and press back up, focusing on glute activation.' }
                            ],
                        },
                        {
                            name: 'Calves',
                            exercises: [
                                { name: 'Calf Raise', details: 'Stand with feet shoulder-width apart. Raise onto toes, squeezing calves, then lower slowly.' },
                                { name: 'Seated Calf Raise', details: 'Sit at the machine with pad over your thighs. Raise your heels, squeezing calves, then lower slowly.' },
                                { name: 'Donkey Calf Raise', details: 'Bend forward with weight on your lower back. Raise heels as high as possible, then lower with control.' },
                                { name: 'Smith Machine Calf Raise', details: 'Stand under the bar with feet on a raised platform. Lift onto toes, then lower back down.' },
                                { name: 'Standing Calf Raise', details: 'Position feet on calf raise machine. Raise onto toes, hold, then return with control.' }
                            ],
                        },
                        {
                            name: 'Abs',
                            exercises: [
                                { name: 'Crunch', details: 'Lie on your back, hands behind your head. Lift shoulders towards knees, keeping lower back on the ground.' },
                                { name: 'Plank', details: 'Position body on elbows and toes, forming a straight line. Hold position, bracing core.' },
                                { name: 'Leg Raise', details: 'Lie on your back, lift legs towards the ceiling, and slowly lower them without touching the ground.' },
                                { name: 'Cable Crunch', details: 'Kneel facing the cable machine, gripping the rope. Crunch down, contracting abs, then release with control.' },
                                { name: 'Russian Twist', details: 'Sit on the floor, lean back slightly and twist torso side-to-side with or without weight.' }
                            ],
                        },
                    ];
                    return [4 /*yield*/, prisma.set.deleteMany()];
                case 1:
                    sets = _d.sent();
                    return [4 /*yield*/, prisma.excercise.deleteMany()];
                case 2:
                    excercises = _d.sent();
                    return [4 /*yield*/, prisma.workout.deleteMany()];
                case 3:
                    workouts = _d.sent();
                    return [4 /*yield*/, prisma.week.deleteMany()];
                case 4:
                    weeks = _d.sent();
                    return [4 /*yield*/, prisma.program.deleteMany()];
                case 5:
                    programs = _d.sent();
                    _i = 0, muscleGroupsWithExercises_1 = muscleGroupsWithExercises;
                    _d.label = 6;
                case 6:
                    if (!(_i < muscleGroupsWithExercises_1.length)) return [3 /*break*/, 14];
                    group = muscleGroupsWithExercises_1[_i];
                    return [4 /*yield*/, prisma.muscleGroup.upsert({
                            where: { name: group.name },
                            update: {},
                            create: { name: group.name },
                        })];
                case 7:
                    muscleGroup = _d.sent();
                    console.log("Upserted muscle group: ".concat(muscleGroup.name));
                    _a = 0, _b = group.exercises;
                    _d.label = 8;
                case 8:
                    if (!(_a < _b.length)) return [3 /*break*/, 13];
                    _c = _b[_a], name_1 = _c.name, details = _c.details;
                    return [4 /*yield*/, prisma.excercise.findFirst({
                            where: { name: name_1, muscleGroupId: muscleGroup.id },
                        })];
                case 9:
                    existingExercise = _d.sent();
                    if (!!existingExercise) return [3 /*break*/, 11];
                    return [4 /*yield*/, prisma.excercise.create({
                            data: {
                                name: name_1,
                                muscleGroupId: muscleGroup.id,
                                details: details,
                            },
                        })];
                case 10:
                    newExercise = _d.sent();
                    console.log("Created exercise: ".concat(newExercise.name, " for muscle group: ").concat(muscleGroup.name));
                    return [3 /*break*/, 12];
                case 11:
                    console.log("Exercise: ".concat(name_1, " already exists for muscle group: ").concat(muscleGroup.name));
                    _d.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 8];
                case 13:
                    _i++;
                    return [3 /*break*/, 6];
                case 14:
                    console.log('Seeding completed!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
