"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Copy,
  Terminal,
  Code2,
  Globe,
  Coffee,
  FileCode
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Type definitions
type Language = "javascript" | "html" | "java";

interface CodePlaygroundProps {
  initialCode?: string;
  initialLanguage?: Language;
  showTests?: boolean;
  testCases?: TestCase[];
  onSuccess?: () => void;
  showAIFeedback?: boolean;
}

interface TestCase {
  description: string;
  expected: string;
}

interface ExecutionResult {
  output: string;
  error: string | null;
  success: boolean;
}

// Language configurations with icons
const languageConfigs = [
  {
    id: "javascript" as Language,
    name: "JavaScript",
    icon: <Code2 className="h-4 w-4" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400"
  },
  {
    id: "html" as Language,
    name: "HTML",
    icon: <Globe className="h-4 w-4" />,
    color: "text-orange-400",
    bgColor: "bg-orange-400"
  },
  {
    id: "java" as Language,
    name: "Java",
    icon: <Coffee className="h-4 w-4" />,
    color: "text-red-400",
    bgColor: "bg-red-400"
  },
];

/**
 * CodePlayground Component
 * Interactive code editor supporting JavaScript, HTML, and Java
 */
export default function CodePlayground({
  initialCode = "",
  initialLanguage = "javascript",
  showTests = false,
  testCases = [],
  onSuccess,
  showAIFeedback = false,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [activeTab, setActiveTab] = useState("output");
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const { toast } = useToast();

  const activeLang = languageConfigs.find(l => l.id === language);

  // Copy code to clipboard
  function handleCopyCode() {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
      duration: 2000
    });
  }

  // Execute JavaScript code
  function executeJavaScript(codeToRun: string): ExecutionResult {
    const logs: string[] = [];
    const originalLog = console.log;

    console.log = (...args) => {
      logs.push(args.map(arg =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" "));
    };

    try {
      const fn = new Function(codeToRun);
      fn();
      return { output: logs.join("\n") || "Code executed successfully!", error: null, success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      return { output: logs.join("\n"), error, success: false };
    } finally {
      console.log = originalLog;
    }
  }

  // Render HTML in iframe using srcdoc (avoids cross-origin issues)
  function executeHTML(): ExecutionResult {
    try {
      setHtmlPreview(code);
      return { output: "HTML rendered in preview tab.", error: null, success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to render HTML";
      return { output: "", error, success: false };
    }
  }

  // Java execution placeholder
  function executeJava(): ExecutionResult {
    return {
      output: `// Compiling Java...\n// Note: Java requires server-side execution.\n\n⚠️ Java compilation requires Techroot Cloud Compiler.\nThis feature will be available soon!`,
      error: null,
      success: true
    };
  }

  // Main run function
  const runCode = useCallback(() => {
    setIsRunning(true);
    setTestResults([]);

    setTimeout(() => {
      let executionResult: ExecutionResult;

      switch (language) {
        case "javascript":
          executionResult = executeJavaScript(code);
          setActiveTab("output");
          break;
        case "html":
          executionResult = executeHTML();
          setActiveTab("preview");
          break;
        case "java":
          executionResult = executeJava();
          setActiveTab("output");
          break;
        default:
          executionResult = { output: "", error: "Unsupported language", success: false };
      }

      setResult(executionResult);

      // Run test cases for JavaScript
      if (language === "javascript" && testCases.length > 0 && executionResult.success) {
        const results = testCases.map(testCase => {
          const output = executionResult.output.trim();
          const expected = testCase.expected.trim();
          const passed = output === expected;

          return {
            passed,
            message: passed
              ? `✓ ${testCase.description}`
              : `✗ ${testCase.description}\n  Expected: ${expected}\n  Got: ${output}`,
          };
        });

        setTestResults(results);
        setActiveTab("tests");

        if (results.every(r => r.passed) && onSuccess) {
          setTimeout(onSuccess, 1000);
        }
      }

      setIsRunning(false);
    }, 300);
  }, [code, language, testCases, onSuccess]);

  // Reset to initial state
  function resetCode() {
    setCode(initialCode);
    setResult(null);
    setTestResults([]);
    setActiveTab("output");
  }

  // Handle keyboard shortcuts
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setCode(code.substring(0, start) + "  " + code.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
  }

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.passed);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg ring-1 ring-border/50">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8">
                  {activeLang?.icon}
                  <span className="hidden sm:inline">{activeLang?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {languageConfigs.map((lang) => (
                  <DropdownMenuItem
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className="gap-2 cursor-pointer"
                  >
                    {lang.icon}
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleCopyCode}
              title="Copy Code"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
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
                "h-8 text-xs font-semibold transition-all gap-1.5",
                isRunning ? "opacity-80" : "hover:scale-105"
              )}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="grid lg:grid-cols-2 min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Code Editor */}
          <div className="relative group bg-[#1e1e1e]">
            {/* Line Numbers */}
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end py-4 pr-3 text-xs text-[#6e7681] font-mono select-none overflow-hidden">
              {code.split("\n").map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full pl-16 pr-4 py-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-0 scrollbar-hide selection:bg-[#264f78]"
              spellCheck={false}
              placeholder={`// Write your ${activeLang?.name} code here...`}
              style={{ minHeight: "500px" }}
            />
          </div>

          {/* Output / Preview Panel */}
          <div className="flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <div className="flex items-center px-4 border-b border-[#333] bg-[#252526]">
                <TabsList className="bg-transparent h-10 gap-2">
                  <TabsTrigger
                    value="output"
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-blue-400 text-xs gap-1.5"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    Console
                  </TabsTrigger>

                  {language === "html" && (
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-blue-400 text-xs gap-1.5"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Preview
                    </TabsTrigger>
                  )}

                  {showTests && testCases.length > 0 && (
                    <TabsTrigger
                      value="tests"
                      className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-blue-400 text-xs gap-1.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Tests
                      {testResults.length > 0 && (
                        <span className={cn(
                          "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                          allTestsPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        )}>
                          {testResults.filter(r => r.passed).length}/{testCases.length}
                        </span>
                      )}
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="flex-1 overflow-auto">
                {/* Console Output */}
                <TabsContent value="output" className="h-full p-4 m-0 font-mono text-sm">
                  {result ? (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {result.output && (
                        <div>
                          <div className="text-[#a1a1aa] mb-1.5 text-xs uppercase tracking-wider">Output</div>
                          <pre className="whitespace-pre-wrap text-green-400">{result.output}</pre>
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
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#52525b] gap-3">
                      <div className="p-3 rounded-full bg-white/5">
                        <Play className="h-6 w-6 opacity-40 ml-1" />
                      </div>
                      <p className="text-sm font-medium">Run your code to see output</p>
                      <p className="text-xs opacity-70">Press Ctrl + Enter to run</p>
                    </div>
                  )}
                </TabsContent>

                {/* HTML Preview */}
                <TabsContent value="preview" className="h-full m-0 bg-white">
                  <iframe
                    title="HTML Preview"
                    className="w-full h-full border-none"
                    srcDoc={htmlPreview}
                    sandbox="allow-scripts"
                  />
                </TabsContent>

                {/* Test Results */}
                <TabsContent value="tests" className="h-full p-4 m-0">
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
                      Run code to see test results
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#007acc] px-3 py-1 text-[11px] text-white flex items-center justify-between font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", activeLang?.bgColor)} />
              {activeLang?.name}
            </span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Ln {code.split("\n").length}, Col 1</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
