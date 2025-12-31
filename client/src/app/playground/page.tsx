'use client';

import { Header } from '@/components/layout/Header';
import { CodePlayground } from '@/components/CodePlayground';

const defaultCode = `// Welcome to the CodeLearn Playground! 
// Write any JavaScript code and click "Run Code" to execute it.

// Example: Calculate the factorial of a number
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log("Factorial of 5:", factorial(5));

// Try modifying the code above or write your own!
`;

export default function Playground() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Playground</h1>
                        <p className="text-muted-foreground">
                            A free space to experiment with JavaScript.  Write code, run it, and see results instantly.
                        </p>
                    </div>

                    <CodePlayground
                        initialCode={defaultCode}
                        showAIFeedback={false}
                    />

                    <div className="mt-8 p-6 border border-border rounded-lg">
                        <h2 className="font-semibold mb-3">Tips</h2>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Use <code className="px-1. 5 py-0.5 bg-secondary rounded text-foreground">console.log()</code> to output values</li>
                            <li>• Press <code className="px-1.5 py-0.5 bg-secondary rounded text-foreground">Ctrl + Enter</code> to run your code quickly</li>
                            <li>• Try different JavaScript features:  arrays, objects, functions, loops</li>
                            <li>• Errors will be displayed in the output panel</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}