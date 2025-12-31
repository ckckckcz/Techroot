"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, CheckCircle, XCircle, AlertCircle, Copy, Terminal, FileCode, Split, Maximize2 } from 'lucide-react';
import { TestCase } from '@/data/learningPaths';
import { AIFeedback } from './AIFeedback';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CodePlaygroundProps {
  initialCode?: string;
  testCases?: TestCase[];
  onSuccess?: () => void;
  showAIFeedback?: boolean;
  language?: 'javascript' | 'typescript' | 'python' | 'default';
  fileName?: string;
}

interface ExecutionResult {
  output: string;
  error: string | null;
  success: boolean;
}

// Custom Language Icons
const JSIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48">
    <path fill="#ffd600" d="M6,42V6h36v36H6z"></path><path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path>
  </svg>
);

const TSIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48">
    <rect width="36" height="36" x="6" y="6" fill="#1976d2"></rect><polygon fill="#fff" points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"></polygon><path fill="#fff" d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986 c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92 c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"></path>
  </svg>
);

const getLanguageConfig = (lang: string = 'javascript', fileName?: string) => {
  switch (lang) {
    case 'javascript':
      return {
        icon: <JSIcon className="h-4 w-4" />,
        name: fileName || 'main.js',
        label: 'JavaScript'
      };
    case 'typescript':
      return {
        icon: <TSIcon className="h-4 w-4" />,
        name: fileName || 'main.ts',
        label: 'TypeScript'
      };
    case 'python':
      return {
        icon: <FileCode className="h-4 w-4 text-blue-500" />,
        name: fileName || 'main.py',
        label: 'Python'
      };
    default:
      return {
        icon: <FileCode className="h-4 w-4 text-blue-500" />,
        name: fileName || 'script.txt',
        label: 'Plain Text'
      };
  }
};

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode = '',
  testCases = [],
  onSuccess,
  showAIFeedback = true,
  language = 'javascript',
  fileName,
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [activeTab, setActiveTab] = useState('output');
  const { toast } = useToast();

  const langConfig = getLanguageConfig(language, fileName);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      duration: 2000
    });
  };

  const executeCode = useCallback((codeToRun: string): ExecutionResult => {
    let output = '';
    const originalLog = console.log;

    // Capture console.log outputs
    const logs: string[] = [];
    console.log = (...args) => {
      logs.push(args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    try {
      // Create a function from the code and execute it
      const fn = new Function(codeToRun);
      fn();
      output = logs.join('\n');

      return { output, error: null, success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return { output: logs.join('\n'), error, success: false };
    } finally {
      console.log = originalLog;
    }
  }, []);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setTestResults([]);
    setActiveTab('output');

    // Small delay for UI feedback
    setTimeout(() => {
      const executionResult = executeCode(code);
      setResult(executionResult);

      // Run test cases if provided
      if (testCases.length > 0 && executionResult.success) {
        const results = testCases.map(testCase => {
          const output = executionResult.output.trim();
          const expected = testCase.expected.trim();
          // Simple equality check; for complex cases, might need looser check
          const passed = output === expected;

          return {
            passed,
            message: passed
              ? `✓ ${testCase.description}`
              : `✗ ${testCase.description}\n  Expected: ${expected}\n  Got: ${output}`,
          };
        });

        setTestResults(results);

        // Switch to tests tab if there are tests
        setActiveTab('tests');

        if (results.every(r => r.passed) && onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      }

      setIsRunning(false);
    }, 300);
  }, [code, executeCode, testCases, onSuccess]);

  const resetCode = useCallback(() => {
    setCode(initialCode);
    setResult(null);
    setTestResults([]);
    setActiveTab('output');
  }, [initialCode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      setCode(code.substring(0, start) + '  ' + code.substring(end));

      // Set cursor position after tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  }, [code, runCode]);

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.passed);
  const hasError = result?.error !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg ring-1 ring-border/50">
        {/* IDE Toolbar */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border rounded-md text-xs font-medium text-foreground">
              {langConfig.icon}
              {langConfig.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleCopyCode}
              title="Copy Code"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCode}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className={cn(
                "h-8 text-xs font-semibold transition-all",
                isRunning ? "opacity-80" : "hover:scale-105"
              )}
            >
              <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="grid lg:grid-cols-2 min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Code Editor */}
          <div className="relative group bg-[#1e1e1e]">
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end py-4 pr-3 text-xs text-[#6e7681] font-mono select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full pl-16 pr-4 py-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-0 scrollbar-hide selection:bg-[#264f78]"
              spellCheck={false}
              placeholder={`// Write your ${langConfig.label} code here...`}
              style={{ minHeight: '500px' }}
            />
          </div>

          {/* Output / Terminal */}
          <div className="flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <div className="flex items-center px-4 border-b border-[#333] bg-[#252526]">
                <Tabs.List className="flex gap-4">
                  <Tabs.Trigger
                    value="output"
                    className={cn(
                      "flex items-center gap-2 py-2.5 text-xs font-medium border-b-2 transition-colors",
                      "data-[state=active]:border-blue-500 data-[state=active]:text-blue-400",
                      "data-[state=inactive]:border-transparent data-[state=inactive]:text-[#969696] hover:text-[#d4d4d4]"
                    )}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    CONSOLE
                  </Tabs.Trigger>
                  {testCases.length > 0 && (
                    <Tabs.Trigger
                      value="tests"
                      className={cn(
                        "flex items-center gap-2 py-2.5 text-xs font-medium border-b-2 transition-colors",
                        "data-[state=active]:border-blue-500 data-[state=active]:text-blue-400",
                        "data-[state=inactive]:border-transparent data-[state=inactive]:text-[#969696] hover:text-[#d4d4d4]"
                      )}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      TEST RESULTS
                      {testResults.length > 0 && (
                        <span className={cn(
                          "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-white/10",
                          allTestsPassed ? "text-green-400" : "text-red-400"
                        )}>
                          {testResults.filter(r => r.passed).length}/{testCases.length}
                        </span>
                      )}
                    </Tabs.Trigger>
                  )}
                </Tabs.List>
              </div>

              <div className="flex-1 overflow-auto bg-[#1e1e1e]">
                <Tabs.Content value="output" className="h-full p-4 font-mono text-sm">
                  {result ? (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {result.output && (
                        <div>
                          <div className="text-[#a1a1aa] mb-1.5 text-xs uppercase tracking-wider">Output</div>
                          <pre className="whitespace-pre-wrap text-[#d4d4d4]">{result.output}</pre>
                        </div>
                      )}
                      {result.error && (
                        <div className="pt-2 border-t border-red-900/30 mt-2">
                          <div className="text-red-400 mb-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <XCircle className="h-3.5 w-3.5" />
                            Error
                          </div>
                          <pre className="whitespace-pre-wrap text-red-300 bg-red-950/20 p-3 rounded-md border border-red-900/30">
                            {result.error}
                          </pre>
                        </div>
                      )}
                      {!result.output && !result.error && (
                        <div className="h-full flex flex-col items-center justify-center text-[#52525b] gap-2">
                          <Terminal className="h-8 w-8 opacity-20" />
                          <p className="text-xs">No output to display</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#52525b] gap-3">
                      <div className="p-3 rounded-full bg-white/5">
                        <Play className="h-6 w-6 opacity-40 ml-1" />
                      </div>
                      <p className="text-sm font-medium">Run your code to see output</p>
                      <p className="text-xs max-w-[200px] text-center opacity-70">
                        Use console.log() to print values to this terminal
                      </p>
                    </div>
                  )}
                </Tabs.Content>

                <Tabs.Content value="tests" className="h-full p-4">
                  {testResults.length > 0 ? (
                    <div className="space-y-3">
                      {testResults.map((test, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-mono transition-all",
                            test.passed
                              ? "bg-green-950/10 border-green-900/30 text-green-400"
                              : "bg-red-950/10 border-red-900/30 text-red-400"
                          )}
                        >
                          <pre className="whitespace-pre-wrap flex gap-3">
                            {test.passed ? (
                              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            )}
                            <div>{test.message}</div>
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#52525b] text-sm">
                      No tests available
                    </div>
                  )}
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </div>
        </div>

        {/* Footer / Status Bar */}
        <div className="bg-[#007acc] px-3 py-1 text-[11px] text-white flex items-center justify-between font-medium">
          <div className="flex items-center gap-3">
            <span>{langConfig.label}</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Ln {code.substring(0, code.length).split('\n').length}, Col 1</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>

      {/* AI Feedback Section */}
      {showAIFeedback && result && (
        <AIFeedback
          hasError={hasError}
          allTestsPassed={allTestsPassed}
          errorMessage={result.error || undefined}
        />
      )}
    </div>
  );
};
