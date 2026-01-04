import { TestCase, ContentType, Lesson, Section, Module, LearningPath } from '@/types';

export type { TestCase, ContentType, Lesson, Section, Module, LearningPath };

export const learningPaths: LearningPath[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Master the building blocks of JavaScript programming',
    icon: 'Code2',
    modules: [
      {
        id: 'variables',
        title: 'Variables & Data Types',
        description: 'Learn how to store and work with data',
        level: 'beginner',
        xpReward: 150,
        sections: [
          {
            id: 'preparation',
            title: 'Persiapan Belajar',
            lessons: [
              {
                id: 'intro-variables',
                title: 'Pengenalan Variables',
                type: 'material',
                isFree: true,
                xpReward: 10,
                content: `# Pengenalan Variables
Variables adalah wadah untuk menyimpan data. Dalam JavaScript, kita menggunakan \`let\`, \`const\`, dan \`var\` untuk mendeklarasikan variabel.

## Mengapa Variabel Penting?
Bayangkan Anda sedang memasak. Anda membutuhkan wadah untuk menyimpan bahan-bahan yang berbeda - garam di satu wadah, gula di wadah lain. Variabel bekerja dengan cara yang sama dalam pemrograman!

## Tipe-tipe Deklarasi
- **let**: Block-scoped, bisa di-reassign
- **const**: Block-scoped, tidak bisa di-reassign
- **var**: Function-scoped (gaya lama)

Dalam praktik modern, gunakan \`const\` sebagai default, dan \`let\` hanya jika Anda perlu mengubah nilainya.`
              },
              {
                id: 'video-variables',
                title: 'Video: Memahami Variables',
                type: 'video',
                isFree: true,
                xpReward: 15,
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                content: `Dalam video ini, Anda akan mempelajari:
                
- Cara mendeklarasikan variabel
- Perbedaan let, const, dan var
- Best practices dalam penamaan variabel`
              }
            ]
          },
          {
            id: 'understanding-variables',
            title: 'Berkenalan dengan Variables',
            lessons: [
              {
                id: 'data-types',
                title: 'Tipe Data dalam JavaScript',
                type: 'material',
                isFree: true,
                xpReward: 10,
                content: `# Tipe Data dalam JavaScript
JavaScript memiliki beberapa tipe data dasar yang perlu Anda ketahui:

## Tipe Data Primitif
### 1. String
Teks yang diapit oleh tanda kutip.
\`\`\`javascript
const name = "Alice";
const greeting = 'Hello World';
\`\`\`

### 2. Number
Angka, baik bulat maupun desimal.
\`\`\`javascript
const age = 25;
const price = 99.99;
\`\`\`

### 3. Boolean
Nilai true atau false.
\`\`\`javascript
const isStudent = true;
const isLoggedIn = false;
\`\`\`

### 4. Undefined & Null
- undefined: variabel yang belum diberi nilai
- null: nilai kosong yang disengaja

## Tipe Data Kompleks
### Array
Kumpulan data dalam urutan tertentu.
\`\`\`javascript
const fruits = ["apple", "banana", "orange"];
\`\`\`

### Object
Kumpulan pasangan key-value.
\`\`\`javascript
const person = { name: "Bob", age: 30 };
\`\`\``
              },
              {
                id: 'naming-convention',
                title: 'Konvensi Penamaan',
                type: 'material',
                xpReward: 10,
                content: `# Konvensi Penamaan Variabel
Penamaan yang baik membuat kode lebih mudah dibaca dan dipahami.

## Aturan Dasar
1. **Huruf, angka, underscore, dan dollar**
- Boleh: \`name\`, \`age2\`, \`_private\`, \`$element\`
- Tidak boleh: \`2fast\`, \`my-var\`

2. **Case Sensitive**
- \`name\` dan \`Name\` adalah variabel berbeda

3. **Tidak boleh kata kunci**
- Tidak boleh: \`let\`, \`const\`, \`function\`, dll.

## Konvensi Populer
### camelCase (Disarankan untuk JavaScript)
\`\`\`javascript
const firstName = "John";
const totalAmount = 100;
\`\`\`

### PascalCase (untuk Class/Component)
\`\`\`javascript
class UserProfile {}
\`\`\`

### SCREAMING_SNAKE_CASE (untuk konstanta)
\`\`\`javascript
const MAX_SIZE = 100;
const API_URL = "https://api.example.com";
\`\`\``
              },
              {
                id: 'quiz-variables-basics',
                title: 'Kuis: Dasar Variables',
                type: 'quiz',
                xpReward: 50,
                starterCode: `// Buat variabel bernama 'greeting' dengan nilai "Hello, World!"
// Kemudian tampilkan ke console

`,
                testCases: [
                  {
                    input: '',
                    expected: 'Hello, World!',
                    description: 'Harus menampilkan "Hello, World!"'
                  }
                ]
              }
            ]
          },
          {
            id: 'practice-variables',
            title: 'Praktik Variables',
            lessons: [
              {
                id: 'story-variables',
                title: '[Story] Membangun Aplikasi Sederhana',
                type: 'material',
                xpReward: 15,
                content: `# Story: Membangun Aplikasi Profil

Bayangkan Anda sedang membangun aplikasi profil pengguna. Anda perlu menyimpan berbagai informasi tentang pengguna.

## Skenario

Anda adalah developer di sebuah startup. Tim Anda mendapat tugas untuk membuat halaman profil yang menampilkan:
- Nama pengguna
- Umur
- Status keanggotaan
- Daftar hobi

## Implementasi

\`\`\`javascript
// Informasi dasar
const userName = "Sarah";
const userAge = 28;
const isPremiumMember = true;

// Daftar hobi
const hobbies = ["membaca", "coding", "traveling"];

// Objek profil lengkap
const userProfile = {
  name: userName,
  age: userAge,
  isPremium: isPremiumMember,
  hobbies: hobbies
};

console.log(userProfile);
\`\`\`

Dengan memahami variabel, Anda bisa menyimpan dan mengelola data pengguna dengan efektif!`
              },
              {
                id: 'summary-variables',
                title: 'Rangkuman Variables',
                type: 'material',
                xpReward: 10,
                content: `# Rangkuman: Variables & Data Types

## Poin Penting

### Deklarasi Variabel
- ✅ Gunakan \`const\` untuk nilai yang tidak berubah
- ✅ Gunakan \`let\` untuk nilai yang akan berubah
- ❌ Hindari \`var\` dalam kode modern

### Tipe Data
| Tipe | Contoh | Keterangan |
|------|--------|------------|
| String | "Hello" | Teks |
| Number | 42, 3.14 | Angka |
| Boolean | true, false | Nilai logika |
| Array | [1, 2, 3] | Daftar berurutan |
| Object | {key: value} | Pasangan key-value |

### Best Practices
1. Gunakan nama yang deskriptif
2. Ikuti konvensi camelCase
3. Inisialisasi variabel saat deklarasi
4. Gunakan const sebagai default

## Apa Selanjutnya?
Setelah menguasai variabel, Anda siap mempelajari:
- Functions
- Control Flow
- Array Methods`
              },
              {
                id: 'final-quiz-variables',
                title: 'Kuis Akhir: Variables',
                type: 'quiz',
                xpReward: 75,
                starterCode: `// Tugas:
// 1. Buat konstanta 'PI' dengan nilai 3.14159
// 2. Buat variabel 'radius' dengan nilai 5
// 3. Hitung luas lingkaran (PI * radius * radius)
// 4. Tampilkan hasilnya (dibulatkan 2 desimal)

`,
                testCases: [
                  {
                    input: '',
                    expected: '78.54',
                    description: 'Harus menampilkan 78.54 (luas lingkaran)'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'functions',
        title: 'Functions',
        description: 'Create reusable blocks of code',
        level: 'beginner',
        xpReward: 200,
        sections: [
          {
            id: 'intro-functions',
            title: 'Pengenalan Functions',
            lessons: [
              {
                id: 'what-is-function',
                title: 'Apa itu Function?',
                type: 'material',
                isFree: true,
                xpReward: 10,
                content: `# Apa itu Function?

Function adalah blok kode yang dapat digunakan kembali untuk melakukan tugas tertentu.

## Analogi Sederhana

Bayangkan function seperti resep masakan:
- Anda menulisnya sekali
- Bisa digunakan berkali-kali
- Bisa dengan bahan (parameter) yang berbeda

## Sintaks Dasar

\`\`\`javascript
function greet(name) {
  return "Hello, " + name;
}

// Memanggil function
const message = greet("Alice");
console.log(message); // "Hello, Alice"
\`\`\`

## Keuntungan Function

1. **Reusability** - Tulis sekali, gunakan berkali-kali
2. **Modularity** - Pecah program menjadi bagian kecil
3. **Maintainability** - Mudah diperbaiki dan diupdate`
              },
              {
                id: 'video-functions',
                title: 'Video: Functions Explained',
                type: 'video',
                isFree: true,
                xpReward: 15,
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                content: `Dalam video ini Anda akan belajar:
- Cara membuat function
- Parameter dan arguments
- Return values
- Arrow functions`
              },
              {
                id: 'quiz-basic-function',
                title: 'Kuis: Membuat Function Pertama',
                type: 'quiz',
                xpReward: 50,
                starterCode: `// Buat function 'double' yang menerima angka
// dan mengembalikan angka tersebut dikali 2
// Panggil dengan 5 dan log hasilnya

`,
                testCases: [
                  {
                    input: '',
                    expected: '10',
                    description: 'Harus menampilkan 10 (double dari 5)'
                  }
                ]
              }
            ]
          },
          {
            id: 'advanced-functions',
            title: 'Functions Lanjutan',
            lessons: [
              {
                id: 'arrow-functions',
                title: 'Arrow Functions',
                type: 'material',
                xpReward: 15,
                content: `# Arrow Functions

Arrow function adalah cara modern untuk menulis function di JavaScript (ES6+).

## Sintaks

\`\`\`javascript
// Function biasa
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

## Variasi Sintaks

\`\`\`javascript
// Satu parameter - kurung opsional
const double = x => x * 2;

// Tanpa parameter - kurung wajib
const sayHi = () => console.log("Hi!");

// Body multi-line - kurung kurawal wajib
const calculate = (a, b) => {
  const sum = a + b;
  return sum * 2;
};
\`\`\`

## Kapan Menggunakan?

- ✅ Callbacks dan array methods
- ✅ Function pendek satu baris
- ❌ Methods dalam object (gunakan function biasa)`
              },
              {
                id: 'quiz-arrow-functions',
                title: 'Kuis: Arrow Functions',
                type: 'quiz',
                xpReward: 60,
                starterCode: `// Buat arrow function 'multiply' yang menerima 2 angka
// dan mengembalikan hasil perkaliannya
// Panggil dengan 4 dan 7, log hasilnya

`,
                testCases: [
                  {
                    input: '',
                    expected: '28',
                    description: 'Harus menampilkan 28 (4 * 7)'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'arrays',
        title: 'Arrays & Array Methods',
        description: 'Work with collections of data',
        level: 'beginner',
        xpReward: 250,
        sections: [
          {
            id: 'intro-arrays',
            title: 'Pengenalan Arrays',
            lessons: [
              {
                id: 'what-is-array',
                title: 'Apa itu Array?',
                type: 'material',
                isFree: true,
                xpReward: 10,
                content: `# Apa itu Array?

Array adalah struktur data yang menyimpan kumpulan nilai dalam urutan tertentu.

## Membuat Array

\`\`\`javascript
const fruits = ["apple", "banana", "orange"];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "two", true, null];
\`\`\`

## Mengakses Elemen

Array menggunakan index berbasis 0:
\`\`\`javascript
console.log(fruits[0]); // "apple"
console.log(fruits[1]); // "banana"
console.log(fruits[2]); // "orange"
\`\`\`

## Properti Length

\`\`\`javascript
console.log(fruits.length); // 3
\`\`\``
              },
              {
                id: 'array-methods',
                title: 'Array Methods Populer',
                type: 'material',
                xpReward: 20,
                content: `# Array Methods Populer

JavaScript menyediakan banyak method untuk memanipulasi array.

## Transform: map()
Mengubah setiap elemen array.
\`\`\`javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6]
\`\`\`

## Filter: filter()
Menyaring elemen berdasarkan kondisi.
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]
\`\`\`

## Reduce: reduce()
Menggabungkan semua elemen menjadi satu nilai.
\`\`\`javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 10
\`\`\`

## Find: find()
Mencari elemen pertama yang cocok.
\`\`\`javascript
const users = [{name: "Alice"}, {name: "Bob"}];
const alice = users.find(u => u.name === "Alice");
\`\`\``
              },
              {
                id: 'quiz-array-filter',
                title: 'Kuis: Array Filter',
                type: 'quiz',
                xpReward: 50,
                starterCode: `// Diberikan array angka, gunakan filter untuk mendapatkan
// hanya angka yang lebih besar dari 3
const numbers = [1, 2, 3, 4, 5, 6];

// Kode Anda di sini - log array yang difilter

`,
                testCases: [
                  {
                    input: '',
                    expected: '4,5,6',
                    description: 'Harus menampilkan [4, 5, 6]'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    description: 'Practice algorithmic thinking with real challenges',
    icon: 'Lightbulb',
    modules: [
      {
        id: 'fizzbuzz',
        title: 'FizzBuzz Challenge',
        description: 'The classic programming challenge',
        level: 'beginner',
        xpReward: 200,
        sections: [
          {
            id: 'fizzbuzz-intro',
            title: 'Memahami FizzBuzz',
            lessons: [
              {
                id: 'fizzbuzz-explanation',
                title: 'Apa itu FizzBuzz?',
                type: 'material',
                isFree: true,
                xpReward: 10,
                content: `# FizzBuzz Challenge

FizzBuzz adalah tantangan pemrograman klasik yang sering digunakan dalam wawancara kerja.

## Aturan

Untuk angka 1 sampai n:
- Jika habis dibagi 3: print "Fizz"
- Jika habis dibagi 5: print "Buzz"
- Jika habis dibagi 3 DAN 5: print "FizzBuzz"
- Selain itu: print angkanya

## Contoh Output
\`\`\`
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
\`\`\`

## Mengapa Penting?

FizzBuzz menguji pemahaman Anda tentang:
- Loops
- Conditionals
- Operator modulo (%)`
              },
              {
                id: 'fizzbuzz-quiz',
                title: 'Kuis: Selesaikan FizzBuzz',
                type: 'quiz',
                xpReward: 100,
                starterCode: `// Selesaikan FizzBuzz untuk angka 1-5
// Output yang diharapkan: 1, 2, Fizz, 4, Buzz

`,
                testCases: [
                  {
                    input: '',
                    expected: '1\n2\nFizz\n4\nBuzz',
                    description: 'Harus menampilkan urutan FizzBuzz yang benar'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'palindrome',
        title: 'Palindrome Checker',
        description: 'Check if a string reads the same backwards',
        level: 'intermediate',
        xpReward: 250,
        sections: [
          {
            id: 'palindrome-intro',
            title: 'Memahami Palindrome',
            lessons: [
              {
                id: 'palindrome-explanation',
                title: 'Apa itu Palindrome?',
                type: 'material',
                isFree: true,
                xpReward: 10,
                content: `# Palindrome

Palindrome adalah kata atau kalimat yang dibaca sama dari depan maupun belakang.

## Contoh Palindrome
- "radar"
- "level"
- "katak"
- "malam"

## Pendekatan Solusi

1. Ambil string input
2. Balik string tersebut
3. Bandingkan dengan aslinya

\`\`\`javascript
const reversed = str.split('').reverse().join('');
return str === reversed;
\`\`\``
              },
              {
                id: 'palindrome-quiz',
                title: 'Kuis: Buat Palindrome Checker',
                type: 'quiz',
                xpReward: 125,
                starterCode: `// Buat function 'isPalindrome' yang mengecek apakah kata palindrome
// Test dengan "level" dan log hasilnya (harus true)

`,
                testCases: [
                  {
                    input: '',
                    expected: 'true',
                    description: 'Harus mengembalikan true untuk "level"'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'dom-manipulation',
    title: 'DOM Manipulation',
    description: 'Learn to interact with web pages dynamically',
    icon: 'Layout',
    modules: [
      {
        id: 'selecting-elements',
        title: 'Selecting Elements',
        description: 'Find and access HTML elements',
        level: 'beginner',
        xpReward: 150,
        sections: [
          {
            id: 'dom-basics',
            title: 'Dasar-dasar DOM',
            lessons: [
              {
                id: 'what-is-dom',
                title: 'Apa itu DOM?',
                type: 'material',
                isFree: true,
                xpReward: 10,
                content: `# Document Object Model (DOM)

DOM adalah representasi HTML sebagai tree of objects yang bisa dimanipulasi dengan JavaScript.

## Metode Seleksi Umum

\`\`\`javascript
// By ID
const header = document.getElementById("header");

// By CSS selector (satu elemen)
const firstBtn = document.querySelector(".btn");

// By CSS selector (semua elemen)
const allBtns = document.querySelectorAll(".btn");
\`\`\`

## Contoh Manipulasi

\`\`\`javascript
// Mengubah teks
header.textContent = "New Header";

// Mengubah style
header.style.color = "blue";

// Menambah class
header.classList.add("active");
\`\`\``
              },
              {
                id: 'dom-quiz',
                title: 'Kuis: DOM Basics',
                type: 'quiz',
                xpReward: 50,
                starterCode: `// Ini adalah latihan konseptual
// Log "DOM Ready" untuk memahami konsep

`,
                testCases: [
                  {
                    input: '',
                    expected: 'DOM Ready',
                    description: 'Harus menampilkan "DOM Ready"'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// Helper functions
export const getPathById = (pathId: string) => learningPaths.find(p => p.id === pathId);

export const getModuleById = (pathId: string, moduleId: string) => getPathById(pathId)?.modules.find(m => m.id === moduleId);

export const getLessonById = (pathId: string, moduleId: string, lessonId: string) =>
  getModuleById(pathId, moduleId)?.sections.flatMap(s => s.lessons).find(l => l.id === lessonId);

export const getModuleProgress = (moduleId: string, completedLessons: string[]) => {
  const module = learningPaths.flatMap(p => p.modules).find(m => m.id === moduleId);
  if (!module) return { completed: 0, total: 0, percentage: 0 };

  const lessons = module.sections.flatMap(s => s.lessons);
  const completed = lessons.filter(l => completedLessons.includes(`${moduleId}:${l.id}`)).length;
  return { completed, total: lessons.length, percentage: lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0 };
};

export const getNextLesson = (pathId: string, moduleId: string, currentLessonId: string) => {
  const allLessons = getModuleById(pathId, moduleId)?.sections.flatMap(s => s.lessons.map(l => ({ lesson: l, sectionId: s.id }))) || [];
  const idx = allLessons.findIndex(l => l.lesson.id === currentLessonId);
  return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
};

export const getPrevLesson = (pathId: string, moduleId: string, currentLessonId: string) => {
  const allLessons = getModuleById(pathId, moduleId)?.sections.flatMap(s => s.lessons.map(l => ({ lesson: l, sectionId: s.id }))) || [];
  const idx = allLessons.findIndex(l => l.lesson.id === currentLessonId);
  return idx > 0 ? allLessons[idx - 1] : null;
};

