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
        var muscleGroupsWithExercises, _i, muscleGroupsWithExercises_1, group, muscleGroup, _a, _b, exerciseName, existingExercise, newExercise;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    muscleGroupsWithExercises = [
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
                    _i = 0, muscleGroupsWithExercises_1 = muscleGroupsWithExercises;
                    _c.label = 1;
                case 1:
                    if (!(_i < muscleGroupsWithExercises_1.length)) return [3 /*break*/, 9];
                    group = muscleGroupsWithExercises_1[_i];
                    return [4 /*yield*/, prisma.muscleGroup.upsert({
                            where: { name: group.name },
                            update: {}, // Do nothing if the muscle group exists
                            create: {
                                name: group.name,
                            },
                        })];
                case 2:
                    muscleGroup = _c.sent();
                    console.log("Upserted muscle group: ".concat(muscleGroup.name));
                    _a = 0, _b = group.exercises;
                    _c.label = 3;
                case 3:
                    if (!(_a < _b.length)) return [3 /*break*/, 8];
                    exerciseName = _b[_a];
                    return [4 /*yield*/, prisma.excercise.findFirst({
                            where: {
                                name: exerciseName,
                                muscleGroupId: muscleGroup.id,
                            },
                        })];
                case 4:
                    existingExercise = _c.sent();
                    if (!!existingExercise) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma.excercise.create({
                            data: {
                                name: exerciseName,
                                muscleGroupId: muscleGroup.id, // Link it to the correct muscle group
                            },
                        })];
                case 5:
                    newExercise = _c.sent();
                    console.log("Created exercise: ".concat(newExercise.name, " for muscle group: ").concat(muscleGroup.name));
                    return [3 /*break*/, 7];
                case 6:
                    console.log("Exercise: ".concat(exerciseName, " already exists for muscle group: ").concat(muscleGroup.name));
                    _c.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 3];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9:
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
